import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── 비용 최적화 설정 ──
const MODEL   = 'claude-haiku-4-5-20251001'; // Sonnet 대비 ~20배 저렴
const MAX_TOK = 1200;                         // 지원서 초안에 충분한 분량

// ── 고정 시스템 프롬프트 (짧고 캐시 효율적) ──
const SYSTEM =
  '당신은 한국 영상·애니메이션 지원사업 전문 컨설턴트입니다. ' +
  '주어진 정보로 공모 지원서 초안을 마크다운으로 작성합니다. ' +
  '구성: # 제목 → ## 1.기획의도 → ## 2.프로젝트 개요 → ## 3.제작역량 → ## 4.시장분석 → ## 5.예산·일정 → ## 6.기대효과. ' +
  '각 섹션 150~200자. 말투: 공식 문어체. 마지막에 ※ 주의사항 1줄 추가.';

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  // SSE 헤더
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOK,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta?.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
  } catch (err) {
    console.error('Anthropic error:', err.message);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
  }
});

app.listen(3001, () =>
  console.log('API server running on http://localhost:3001')
);
