import { useState, useEffect, useRef, useMemo } from "react";

// ─── Design System: "Cinematic Noir" ───
const T = {
  bg: "#060810",
  surface: "#0D1117",
  surfaceHover: "#131A24",
  card: "#0F1520",
  cardHover: "#141C2A",
  border: "#1B2535",
  borderActive: "#2A3A52",
  accent: "#00D4AA",
  accentDim: "rgba(0,212,170,0.12)",
  accentGlow: "rgba(0,212,170,0.2)",
  blue: "#3B82F6",
  blueDim: "rgba(59,130,246,0.12)",
  amber: "#F59E0B",
  amberDim: "rgba(245,158,11,0.12)",
  rose: "#F43F5E",
  roseDim: "rgba(244,63,94,0.12)",
  violet: "#8B5CF6",
  violetDim: "rgba(139,92,246,0.12)",
  sky: "#38BDF8",
  skyDim: "rgba(56,189,248,0.12)",
  text: "#E8ECF1",
  textSec: "#8B95A5",
  textDim: "#556070",
  white: "#FFFFFF",
  font: "'Pretendard Variable', 'Pretendard', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  r: "14px",
  rSm: "8px",
  rLg: "20px",
};

const ORG_COLORS = {
  KOCCA: { bg: T.accentDim, fg: T.accent, label: "KOCCA" },
  KOFIC: { bg: T.blueDim, fg: T.blue, label: "KOFIC" },
  KOMACON: { bg: T.violetDim, fg: T.violet, label: "KOMACON" },
  문체부: { bg: T.amberDim, fg: T.amber, label: "문체부" },
  경기콘텐츠: { bg: T.skyDim, fg: T.sky, label: "경기콘텐츠" },
  서울산업: { bg: T.roseDim, fg: T.rose, label: "SBA" },
  부산영상: { bg: T.blueDim, fg: "#60A5FA", label: "부산영상" },
};

const css = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.min.css');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
html{font-size:15px;}
body{background:${T.bg};color:${T.text};font-family:${T.font};-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px;}
::selection{background:${T.accent};color:${T.bg};}
input,textarea,select{font-family:${T.font};}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes glow{0%,100%{box-shadow:0 0 12px ${T.accentGlow}}50%{box-shadow:0 0 28px ${T.accentGlow}}}
@keyframes slideRight{from{width:0}to{width:100%}}
.fu{animation:fadeUp .45s ease both}
.fi{animation:fadeIn .4s ease both}
.s1{animation-delay:.08s}.s2{animation-delay:.16s}.s3{animation-delay:.24s}.s4{animation-delay:.32s}.s5{animation-delay:.4s}
`;

// ─── Mock Data: All Orgs ───
const ALL_GRANTS = [
  { id:1, title:"2026 애니메이션 제작 지원(초기본편)", org:"KOCCA", cat:"애니메이션", budget:"최대 7억원", deadline:"2026-05-20", status:"접수중",
    desc:"국산 애니메이션(TV시리즈/극장/OTT)의 초기 기획부터 본편 제작까지 전주기 지원. 기획 완성도와 제작역량을 종합 평가합니다.",
    reqs:["사업계획서","시나리오(트리트먼트)","제작예산서","감독 포트폴리오","사업자등록증"],
    eval:[{name:"작품성",w:30,d:"시나리오, 캐릭터, 연출 비전"},{name:"제작역량",w:25,d:"감독·PD 경력, 제작사 실적"},{name:"시장성",w:20,d:"타겟, 유통전략, 해외진출"},{name:"기술혁신",w:15,d:"제작 파이프라인, 신기술 활용"},{name:"실현가능성",w:10,d:"예산 적정성, 일정 계획"}],
    match:94 },
  { id:2, title:"2026 방송영상콘텐츠 제작 지원", org:"KOCCA", cat:"방송영상", budget:"최대 10억원", deadline:"2026-06-10", status:"접수중",
    desc:"글로벌 OTT 플랫폼 연계 방송영상콘텐츠 제작을 지원합니다.",
    reqs:["기획안","제작계획서","예산서","유통계획서"],
    eval:[{name:"기획력",w:30},{name:"제작역량",w:25},{name:"유통전략",w:25},{name:"예산적정성",w:20}],
    match:87 },
  { id:3, title:"2026 AI 콘텐츠 제작지원", org:"KOCCA", cat:"AI/기술", budget:"최대 3억원", deadline:"2026-05-30", status:"접수중",
    desc:"AI 기술을 활용한 혁신 콘텐츠 제작 프로젝트를 지원합니다. 문체부와 공동으로 총 198억원 규모.",
    reqs:["기술기획서","AI 활용 계획서","프로토타입","사업계획서"],
    eval:[{name:"기술혁신성",w:35},{name:"콘텐츠 품질",w:25},{name:"사업화 가능성",w:20},{name:"팀 역량",w:20}],
    match:72 },
  { id:4, title:"2026 독립·예술영화 제작 지원", org:"KOFIC", cat:"독립영화", budget:"최대 4억원", deadline:"2026-05-25", status:"접수중",
    desc:"독립·예술영화의 다양성 확보를 위한 제작 지원사업입니다.",
    reqs:["시나리오(완본)","감독 연출의도서","제작계획서","예산서","캐스팅 계획"],
    eval:[{name:"작품성",w:35},{name:"독창성",w:25},{name:"감독역량",w:20},{name:"실현가능성",w:20}],
    match:81 },
  { id:5, title:"2026 극장용 애니메이션 제작 지원", org:"KOFIC", cat:"애니메이션", budget:"최대 5억원", deadline:"2026-06-01", status:"접수중",
    desc:"극장 개봉 목적의 장편 애니메이션 제작을 지원합니다.",
    reqs:["시나리오","제작기획서","예산서","파일럿 영상","감독 포트폴리오"],
    eval:[{name:"작품성",w:30},{name:"제작역량",w:25},{name:"시장성",w:25},{name:"기술력",w:20}],
    match:89 },
  { id:6, title:"2026 단편영화 제작 지원", org:"KOFIC", cat:"단편영화", budget:"최대 5천만원", deadline:"2026-04-30", status:"마감임박",
    desc:"신진 감독의 단편영화 제작을 지원합니다.",
    reqs:["시나리오","감독 소개서","제작계획서","예산서"],
    eval:[{name:"작품성",w:35},{name:"독창성",w:25},{name:"실현가능성",w:20},{name:"잠재력",w:20}],
    match:76 },
  { id:7, title:"2026 만화·웹툰 창작 지원", org:"KOMACON", cat:"만화/웹툰", budget:"최대 3천만원", deadline:"2026-05-15", status:"접수중",
    desc:"다양성 만화 제작 및 만화 창작 초기 단계를 지원합니다.",
    reqs:["작품 기획서","원고 샘플(5화 이상)","작가 이력서"],
    eval:[{name:"작품성",w:40},{name:"독창성",w:30},{name:"완성도",w:30}],
    match:68 },
  { id:8, title:"2026 만화 원작 콘텐츠 제작 지원", org:"KOMACON", cat:"IP 영상화", budget:"최대 2억원", deadline:"2026-06-15", status:"공고예정",
    desc:"만화·웹툰 IP를 활용한 영상화 프로젝트를 지원합니다.",
    reqs:["IP 권리 증빙","영상화 기획서","시놉시스","예산서"],
    eval:[{name:"IP 가치",w:30},{name:"영상화 전략",w:25},{name:"제작역량",w:25},{name:"시장성",w:20}],
    match:83 },
  { id:9, title:"2026 문화기술 R&D 지원", org:"문체부", cat:"R&D", budget:"과제당 최대 5억원", deadline:"2026-06-20", status:"접수중",
    desc:"문화체육관광 분야 연구개발 사업입니다. AI, XR, 실감콘텐츠 기술 개발을 지원합니다.",
    reqs:["연구계획서","기술개발 로드맵","사업화 전략","연구진 구성"],
    eval:[{name:"기술 우수성",w:30},{name:"사업화 가능성",w:25},{name:"연구역량",w:25},{name:"파급효과",w:20}],
    match:61 },
  { id:10, title:"2026 경기도 콘텐츠 기업 성장 지원", org:"경기콘텐츠", cat:"기업성장", budget:"최대 1억원", deadline:"2026-05-10", status:"접수중",
    desc:"경기도 소재 콘텐츠 기업의 성장을 위한 제작비·마케팅 지원입니다.",
    reqs:["사업계획서","기업 소개서","재무제표","경기도 소재 증빙"],
    eval:[{name:"사업성",w:30},{name:"성장가능성",w:25},{name:"고용창출",w:25},{name:"지역기여",w:20}],
    match:70 },
  { id:11, title:"2026 서울 영상콘텐츠 제작 지원", org:"서울산업", cat:"영상제작", budget:"최대 2억원", deadline:"2026-05-28", status:"접수중",
    desc:"서울 소재 영상 제작사를 대상으로 한 콘텐츠 제작 지원사업입니다.",
    reqs:["사업계획서","제작기획서","예산서","서울 소재 증빙"],
    eval:[{name:"기획력",w:30},{name:"제작역량",w:25},{name:"시장성",w:25},{name:"지역기여",w:20}],
    match:74 },
  { id:12, title:"2026 부산 영상산업 제작 인센티브", org:"부산영상", cat:"영상제작", budget:"최대 3억원", deadline:"2026-06-30", status:"공고예정",
    desc:"부산 지역 촬영·제작 프로젝트에 인센티브를 지원합니다.",
    reqs:["촬영계획서","부산 로케이션 계획","예산서","제작사 등록증"],
    eval:[{name:"작품성",w:25},{name:"지역경제 기여",w:30},{name:"제작규모",w:25},{name:"실현가능성",w:20}],
    match:58 },
];

const TEMPLATES = [
  { id:1, title:"KOCCA 애니메이션 제작지원 합격 사례", year:2025, score:94, org:"KOCCA", cat:"애니메이션", dl:412,
    project:"우주의 바다", company:"스튜디오 블루오션",
    summary:"SF 애니메이션 시리즈로, 해저 도시와 우주 탐사라는 이중 세계관을 통해 환경 문제와 인류의 미래를 탐구하는 작품.",
    keyPoints:["시놉시스에서 '왜 지금 이 이야기인가'의 시의성을 명확히 제시","감독의 단편 수상 이력 3건을 구체적 수치와 함께 기술","Netflix 아시아 담당자 사전 미팅 내용을 유통전략에 포함","UE5 하이브리드 파이프라인 기술 우위를 시각 자료로 설명","해외 유사작 흥행 데이터로 시장성 뒷받침"],
    structure:["1. 사업개요 (프로젝트 소개, 기획의도, 차별점)","2. 제작역량 (감독·PD 상세 이력, 수상/흥행 실적)","3. 작품 내용 (시놉시스, 캐릭터, 에피소드 구성)","4. 시장분석 및 유통전략 (타겟, 벤치마크, OTT 사전 협의)","5. 제작계획 (상세 일정표, WBS)","6. 예산계획 (항목별 산출근거)","7. 기대효과 (산업적·문화적·경제적)"],
    tips:"KOCCA는 '글로벌 유통 가능성'과 '기술 혁신성'을 중시합니다. 사전 유통 협의 실적이 있다면 반드시 포함하세요." },
  { id:2, title:"KOFIC 독립영화 제작지원 합격 사례", year:2025, score:88, org:"KOFIC", cat:"독립영화", dl:298,
    project:"잔상", company:"필름 레터스",
    summary:"5·18 민주화운동 당시 사진기자의 시선을 통해 기억과 기록의 의미를 묻는 독립 드라마.",
    keyPoints:["연출의도서에 개인적 동기와 사회적 메시지를 분리하여 깊이 서술","역사 자문위원 3인의 참여 계획을 명시하여 고증 신뢰성 확보","부산·광주 로케이션 사전답사 결과를 사진과 함께 첨부","저예산 촬영 경험을 어필하며 예산 효율성 강조","독립영화제 3곳 출품 일정을 구체적으로 제시"],
    structure:["1. 감독 연출의도 (개인적 동기, 영화적 비전)","2. 시나리오 개요 (로그라인, 시놉시스, 트리트먼트)","3. 제작진 소개 (감독 필모, 프로듀서 실적)","4. 제작계획 (촬영 일정, 로케이션, 캐스팅)","5. 예산서 (항목별 상세)","6. 유통계획 (영화제 전략, 배급사)"],
    tips:"KOFIC 독립영화는 '작품성+독창성' 배점이 60%입니다. 연출의도서에 가장 많은 공을 들이세요." },
  { id:3, title:"KOCCA 방송영상 OTT 연계 합격 사례", year:2025, score:91, org:"KOCCA", cat:"방송영상", dl:356,
    project:"디지털 노마드", company:"콘텐츠팩토리",
    summary:"전 세계를 떠도는 디지털 노마드 청년들의 리얼리티 다큐 시리즈. 글로벌 OTT 동시 방영 목표.",
    keyPoints:["왓챠와 사전 MOU 체결 내용을 첨부","해외 7개국 촬영 로드맵을 인포그래픽으로 제시","타겟 시청자 페르소나 3종을 데이터 기반으로 작성","시즌2 확장 및 IP 파생(웹예능, 숏폼) 계획 포함","이전 OTT 시리즈 시청률 데이터를 실적 근거로 제시"],
    structure:["1. 기획안 (컨셉, 포맷, 차별점)","2. 에피소드 구성안 (전체 8화)","3. 제작계획서 (촬영지, 일정, 인력)","4. 유통계획서 (OTT 협의 현황, 해외 판매)","5. 예산서","6. 시즌 확장 및 IP 활용 전략"],
    tips:"OTT 연계 사업은 '유통전략' 비중이 25%로 높습니다. 플랫폼과의 구체적 협의 내역이 핵심입니다." },
  { id:4, title:"KOMACON 웹툰 IP 영상화 합격 사례", year:2024, score:86, org:"KOMACON", cat:"IP 영상화", dl:189,
    project:"환생검 영상화 프로젝트", company:"IP브릿지",
    summary:"네이버 웹툰 인기작 '환생검'을 극장판 애니메이션으로 영상화하는 프로젝트.",
    keyPoints:["누적 조회수·댓글수·별점으로 IP 가치를 정량적 증명","원작자 참여 각색 계획과 계약 조건 명시","해외(일본·동남아) 웹툰 인기 순위로 글로벌 시장성 입증","원작 대비 영상화 변경점과 이유를 명확히 서술","캐릭터 디자인 컨셉아트 5종 첨부"],
    structure:["1. IP 소개 (원작 정보, 인기 데이터, 수상 이력)","2. 영상화 전략 (각색 방향, 원작자 참여)","3. 시놉시스 (극장판 기준)","4. 제작역량 (제작진, 기술력)","5. 예산계획","6. 시장분석 (국내·해외)"],
    tips:"KOMACON은 'IP 가치'를 정량적으로 증명하는 것이 핵심입니다. 조회수, 매출, 해외 랭킹 등 숫자로 보여주세요." },
  { id:5, title:"문체부 문화기술 R&D 합격 사례", year:2025, score:90, org:"문체부", cat:"R&D", dl:221,
    project:"AI 실시간 애니메이션 렌더링 엔진", company:"테크비전랩",
    summary:"생성형 AI를 활용해 애니메이션 제작 시간을 70% 단축하는 실시간 렌더링 엔진 개발 프로젝트.",
    keyPoints:["기존 파이프라인 대비 시간·비용 절감 효과를 정량 데이터로 제시","특허 출원 2건의 기술 우위를 논문 인용과 함께 설명","산학협력(KAIST) 연구진 구성으로 기술 신뢰성 확보","3년 로드맵(기초연구→프로토타입→상용화)을 단계별 제시","기존 고객사 3곳 LoI 첨부로 사업화 의지 증명"],
    structure:["1. 연구 개요 (배경, 목적, 필요성)","2. 기술개발 내용 (핵심 기술, 차별점)","3. 개발 로드맵 (단계별 목표, 마일스톤)","4. 연구진 구성 (책임연구자, 참여기관)","5. 사업화 전략 (시장규모, 타겟, 수익모델)","6. 예산계획 (연차별 상세)"],
    tips:"문체부 R&D는 '기술 우수성'과 '사업화 가능성'이 핵심입니다. LoI(관심표명서)나 MOU가 큰 가산점이 됩니다." },
  { id:6, title:"경기콘텐츠 기업성장 지원 합격 사례", year:2025, score:85, org:"경기콘텐츠", cat:"기업성장", dl:145,
    project:"XR 콘텐츠 제작 인프라 구축", company:"리얼리티웍스",
    summary:"경기도 판교 소재 XR 스튜디오의 제작 인프라 고도화 및 신규 인력 채용을 위한 성장 지원 프로젝트.",
    keyPoints:["신규 고용 15명을 직급별로 구체 제시","지역 대학(경기대, 한신대) 인턴십 연계 프로그램 계획","3년 매출 성장을 보수적·중간·낙관 3가지 시나리오로 제시","기존 납품 실적(삼성, LG)을 매출액과 함께 기술","경기도 콘텐츠 클러스터 활성화 기여도를 수치화"],
    structure:["1. 기업 소개 (연혁, 실적, 핵심역량)","2. 사업계획 (성장 전략, 투자 계획)","3. 고용 계획 (채용 규모, 직무, 일정)","4. 재무계획 (매출 전망, 수익성)","5. 지역 기여도 (산업 생태계 기여)"],
    tips:"지역 기관은 '지역 기여도'와 '고용 창출'이 20~30% 차지합니다. 구체적 숫자와 일정을 반드시 포함하세요." },
  { id:7, title:"KOFIC 장편 애니메이션 합격 사례", year:2024, score:92, org:"KOFIC", cat:"애니메이션", dl:378,
    project:"달빛 공방", company:"문라이트 애니메이션",
    summary:"조선시대 도자기 장인 소녀의 성장기를 그린 극장용 장편 애니메이션. 한국적 미학과 현대적 감성의 결합.",
    keyPoints:["파일럿 영상(3분) 첨부로 시각적 완성도 직접 증명","안시 국제 애니메이션 영화제 피칭 포럼 선정 실적 어필","한국 전통 색채 연구 자문(국립민속박물관) 계획","글로벌 배급사 2곳과 사전 MOU 첨부","예산서에 항목별 산출근거를 1페이지 분량으로 상세 기재"],
    structure:["1. 프로젝트 개요 (로그라인, 시놉시스, 톤)","2. 감독 비전 (연출의도, 비주얼 컨셉)","3. 제작역량 (팀 구성, 파일럿 영상, 기술)","4. 시장분석 (타겟, 벤치마크, 유통전략)","5. 제작계획 (WBS, 마일스톤)","6. 예산서 (산출근거 포함)","7. 기대효과"],
    tips:"KOFIC 극장 애니는 '파일럿 영상'이 당락을 좌우합니다. 30초~3분이라도 비주얼 완성도를 보여주는 것이 결정적입니다." },
];

// ─── Icons ───
const Ico = ({n, sz=18, c}) => {
  const p = {width:sz,height:sz,display:"inline-block",verticalAlign:"middle"};
  const cl = c||"currentColor";
  const m = {
    search:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    doc:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    ai:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
    trophy:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
    chart:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
    home:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    close:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    chk:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    spark:<svg style={p} viewBox="0 0 24 24" fill={cl} stroke="none"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>,
    arrow:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    filter:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    dl:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    back:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    send:<svg style={p} viewBox="0 0 24 24" fill={cl} stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
    building:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>,
  };
  return m[n]||null;
};

// ─── Shared Components ───
const Badge = ({children, bg, fg, sz="xs"}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:sz==="xs"?"3px 8px":"4px 10px",
    borderRadius:20,background:bg||T.accentDim,color:fg||T.accent,fontSize:sz==="xs"?11:12,fontWeight:650,letterSpacing:"0.02em",lineHeight:1}}>{children}</span>
);

const Btn = ({children, primary, sm, style:s, ...p}) => (
  <button {...p} style={{padding:sm?"7px 14px":"10px 20px",borderRadius:T.rSm,
    border:primary?"none":`1px solid ${T.border}`,cursor:"pointer",fontFamily:T.font,
    background:primary?`linear-gradient(135deg,${T.accent},#00B894)`:"transparent",
    color:primary?T.bg:T.textSec,fontSize:sm?12:13,fontWeight:650,
    display:"inline-flex",alignItems:"center",gap:6,transition:"all .2s",whiteSpace:"nowrap",...s}}>{children}</button>
);

const Ring = ({score, sz=52}) => {
  const r=(sz-7)/2, c=2*Math.PI*r, o=c-(score/100)*c;
  const cl = score>=85?T.accent:score>=70?T.amber:score>=50?T.blue:T.rose;
  return (
    <svg width={sz} height={sz} style={{transform:"rotate(-90deg)",flexShrink:0}}>
      <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={T.border} strokeWidth="3.5"/>
      <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={cl} strokeWidth="3.5"
        strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s ease"}}/>
      <text x={sz/2} y={sz/2} textAnchor="middle" dominantBaseline="central"
        fill={cl} fontSize={sz*.26} fontWeight="700" style={{transform:"rotate(90deg)",transformOrigin:"center",fontFamily:T.mono}}>{score}</text>
    </svg>
  );
};

const OrgBadge = ({org}) => {
  const o = ORG_COLORS[org]; if(!o) return null;
  return <Badge bg={o.bg} fg={o.fg}>{o.label}</Badge>;
};

const Spinner = ({sz=16,c}) => <div style={{width:sz,height:sz,border:`2px solid ${c||T.accent}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>;

// ─── Grant Card ───
function GrantCard({g, onClick}) {
  const [h,setH] = useState(false);
  const dl = Math.max(0,Math.ceil((new Date(g.deadline)-new Date())/864e5));
  const urgent = dl <= 10;
  const stColor = g.status==="접수중"?T.accent:g.status==="마감임박"?T.rose:T.amber;
  const stBg = g.status==="접수중"?T.accentDim:g.status==="마감임박"?T.roseDim:T.amberDim;
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      background:h?T.cardHover:T.card, border:`1px solid ${h?T.accent+"50":T.border}`, borderRadius:T.r,
      padding:"20px 22px", cursor:"pointer", transition:"all .22s",
      transform:h?"translateY(-2px)":"none", boxShadow:h?`0 8px 30px rgba(0,0,0,.35)`:"none",
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
            <Badge bg={stBg} fg={stColor}>{g.status}</Badge>
            <OrgBadge org={g.org}/>
            <Badge bg={T.surface} fg={T.textDim}>{g.cat}</Badge>
          </div>
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:5,lineHeight:1.45,overflow:"hidden",textOverflow:"ellipsis",
            display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{g.title}</h3>
          <div style={{display:"flex",gap:16,fontSize:12,color:T.textDim,marginTop:6}}>
            <span>💰 {g.budget}</span>
            <span style={{color:urgent?T.rose:T.textDim}}>⏰ D-{dl}</span>
            <span>📅 {g.deadline}</span>
          </div>
        </div>
        <Ring score={g.match}/>
      </div>
    </div>
  );
}

// ─── Grant Detail Modal ───
function GrantModal({g, onClose, onGen}) {
  if(!g) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",backdropFilter:"blur(10px)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="fu" style={{
        background:T.surface,borderRadius:T.rLg,border:`1px solid ${T.border}`,
        maxWidth:700,width:"100%",maxHeight:"85vh",overflow:"auto",padding:"28px 30px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <OrgBadge org={g.org}/>
            <Badge bg={g.status==="접수중"?T.accentDim:T.roseDim} fg={g.status==="접수중"?T.accent:T.rose}>{g.status}</Badge>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,padding:4}}>
            <Ico n="close" sz={22}/>
          </button>
        </div>
        <h2 style={{fontSize:20,fontWeight:800,marginBottom:8,lineHeight:1.4}}>{g.title}</h2>
        <p style={{color:T.textSec,lineHeight:1.75,marginBottom:22,fontSize:14}}>{g.desc}</p>

        <div style={{marginBottom:22}}>
          <h4 style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>📋 제출 서류</h4>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {g.reqs?.map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",
                background:T.bg,borderRadius:T.rSm,fontSize:13,border:`1px solid ${T.border}`}}>
                <Ico n="chk" sz={14} c={T.accent}/> {r}
              </div>
            ))}
          </div>
        </div>

        {g.eval && <div style={{marginBottom:24}}>
          <h4 style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>📊 평가 기준</h4>
          {g.eval.map((e,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                <span style={{fontWeight:600}}>{e.name}</span>
                <span style={{color:T.accent,fontFamily:T.mono,fontWeight:700}}>{e.w}%</span>
              </div>
              <div style={{height:5,background:T.bg,borderRadius:3,overflow:"hidden"}}>
                <div style={{width:`${e.w*2.5}%`,height:"100%",borderRadius:3,
                  background:`linear-gradient(90deg,${T.accent},${T.blue})`,transition:"width .7s ease"}}/>
              </div>
              {e.d&&<p style={{fontSize:11,color:T.textDim,marginTop:3}}>{e.d}</p>}
            </div>
          ))}
        </div>}

        <Btn primary onClick={()=>onGen(g)} style={{width:"100%",justifyContent:"center",padding:14,fontSize:15,borderRadius:T.r,
          boxShadow:`0 4px 20px ${T.accentGlow}`}}>
          <Ico n="spark" sz={18} c={T.bg}/> AI 지원서 자동 생성
        </Btn>
      </div>
    </div>
  );
}

// ─── Template Detail Modal ───
function TplModal({t, onClose}) {
  if(!t) return null;
  const oc = ORG_COLORS[t.org]||{fg:T.accent,bg:T.accentDim};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",backdropFilter:"blur(10px)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="fu" style={{
        background:T.surface,borderRadius:T.rLg,border:`1px solid ${T.border}`,
        maxWidth:720,width:"100%",maxHeight:"88vh",overflow:"auto",padding:"28px 30px"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <Badge bg={T.accentDim} fg={T.accent}>합격</Badge>
            <OrgBadge org={t.org}/>
            <Badge bg={T.surface} fg={T.textDim}>{t.cat}</Badge>
            <Badge bg={T.surface} fg={T.textDim}>{t.year}년</Badge>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,padding:4,flexShrink:0}}>
            <Ico n="close" sz={22}/>
          </button>
        </div>

        <h2 style={{fontSize:19,fontWeight:800,marginBottom:4,lineHeight:1.4}}>{t.title}</h2>
        {t.project && <p style={{fontSize:13,color:oc.fg,fontWeight:600,marginBottom:2}}>📽️ {t.project}</p>}
        {t.company && <p style={{fontSize:12,color:T.textDim,marginBottom:14}}>🏢 {t.company}</p>}

        {/* Score Banner */}
        <div style={{display:"flex",alignItems:"center",gap:16,padding:"16px 18px",
          background:`linear-gradient(135deg,${oc.bg},${T.card})`,borderRadius:T.r,
          border:`1px solid ${oc.fg}20`,marginBottom:20}}>
          <Ring score={t.score} sz={60}/>
          <div>
            <div style={{fontSize:11,color:T.textDim}}>평가 점수</div>
            <div style={{fontSize:24,fontWeight:800,fontFamily:T.mono,color:oc.fg}}>{t.score}<span style={{fontSize:13,color:T.textDim}}>/100</span></div>
            <div style={{fontSize:11,color:T.textSec,marginTop:1}}><Ico n="dl" sz={11}/> {t.dl}회 다운로드</div>
          </div>
        </div>

        {/* Summary */}
        {t.summary && <div style={{marginBottom:20}}>
          <h4 style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:8,letterSpacing:.5}}>📌 프로젝트 개요</h4>
          <p style={{fontSize:13.5,color:T.textSec,lineHeight:1.75,padding:"12px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.border}`}}>{t.summary}</p>
        </div>}

        {/* Key Points */}
        {t.keyPoints && <div style={{marginBottom:20}}>
          <h4 style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:8,letterSpacing:.5}}>🔑 합격 핵심 포인트</h4>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {t.keyPoints.map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 14px",
                background:T.bg,borderRadius:T.rSm,fontSize:13,lineHeight:1.6,border:`1px solid ${T.border}`}}>
                <span style={{color:T.accent,fontWeight:700,fontFamily:T.mono,flexShrink:0,marginTop:1}}>{i+1}</span>
                <span style={{color:T.textSec}}>{p}</span>
              </div>
            ))}
          </div>
        </div>}

        {/* Structure */}
        {t.structure && <div style={{marginBottom:20}}>
          <h4 style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:8,letterSpacing:.5}}>📄 지원서 구성</h4>
          <div style={{padding:"14px 16px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.border}`}}>
            {t.structure.map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",
                borderBottom:i<t.structure.length-1?`1px solid ${T.border}`:"none",fontSize:13,color:T.textSec}}>
                <Ico n="chk" sz={13} c={T.accent}/> {s}
              </div>
            ))}
          </div>
        </div>}

        {/* Tips */}
        {t.tips && <div style={{padding:"14px 16px",background:T.amberDim,borderRadius:T.r,
          border:`1px solid ${T.amber}20`,marginBottom:18}}>
          <div style={{fontSize:12,fontWeight:700,color:T.amber,marginBottom:4}}>💡 전문가 팁</div>
          <p style={{fontSize:13,color:T.textSec,lineHeight:1.65}}>{t.tips}</p>
        </div>}

        {/* Download Button */}
        <Btn primary onClick={()=>{
          const lines = [
            `═══════════════════════════════════════`,
            `  ${t.title}`,
            `═══════════════════════════════════════`,
            ``,
            `📽️ 프로젝트: ${t.project||""}`,
            `🏢 제작사: ${t.company||""}`,
            `📅 연도: ${t.year}년`,
            `🏆 평가 점수: ${t.score}/100`,
            `🏷️ 기관: ${ORG_COLORS[t.org]?.label||t.org}`,
            `🎬 분야: ${t.cat}`,
            ``,
            `───────────────────────────────────────`,
            `📌 프로젝트 개요`,
            `───────────────────────────────────────`,
            t.summary||"",
            ``,
            `───────────────────────────────────────`,
            `🔑 합격 핵심 포인트`,
            `───────────────────────────────────────`,
            ...(t.keyPoints||[]).map((p,i)=>`  ${i+1}. ${p}`),
            ``,
            `───────────────────────────────────────`,
            `📄 지원서 구성`,
            `───────────────────────────────────────`,
            ...(t.structure||[]).map(s=>`  ✓ ${s}`),
            ``,
            `───────────────────────────────────────`,
            `💡 전문가 팁`,
            `───────────────────────────────────────`,
            t.tips||"",
            ``,
            `═══════════════════════════════════════`,
            `GrantAI Pro - 합격 사례 레퍼런스`,
            `※ 본 자료는 참고용이며 실제 합격 지원서 원문이 아닙니다.`,
          ];
          const blob = new Blob(["\uFEFF"+lines.join("\n")],{type:"text/plain;charset=utf-8"});
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href=url; a.download=`합격사례_${ORG_COLORS[t.org]?.label||t.org}_${t.cat}_${t.year}.txt`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        }} style={{width:"100%",justifyContent:"center",padding:13,fontSize:14,borderRadius:T.r,
          boxShadow:`0 4px 20px ${T.accentGlow}`}}>
          <Ico n="dl" sz={17} c={T.bg}/> 합격 사례 다운로드 (.txt)
        </Btn>
      </div>
    </div>
  );
}

// ─── AI Writer ───
function AIWriter({grant, onBack}) {
  const [step,setStep]=useState(0);
  const [fd,setFd]=useState({company:"",director:"",project:"",genre:"",synopsis:"",target:"",budget:"",timeline:""});
  const [gen,setGen]=useState(false);
  const [result,setResult]=useState(null);
  const [stream,setStream]=useState("");
  const ref=useRef(null);

  const fields = [
    [{k:"company",l:"제작사/팀명",ph:"예: 스튜디오 미르"},{k:"director",l:"감독/대표자명",ph:"예: 홍길동"},{k:"project",l:"프로젝트 제목",ph:"예: 별의 노래"},{k:"genre",l:"장르",ph:"예: SF 애니메이션"}],
    [{k:"synopsis",l:"시놉시스 (간략)",ph:"프로젝트의 핵심 스토리를 200자 내외로...",ml:true},{k:"target",l:"타겟 관객/시장",ph:"예: 15-35세, 글로벌 OTT 시장"}],
    [{k:"budget",l:"총 제작 예산",ph:"예: 5억원"},{k:"timeline",l:"제작 기간",ph:"예: 2026.07 ~ 2027.12 (18개월)"}],
  ];
  const stepLabels=["기본 정보","프로젝트 개요","예산/일정"];

  const doGen = () => {
    setGen(true); setStream("");
    const orgLabel = ORG_COLORS[grant?.org]?.label || grant?.org || "기관";
    const fullText = `# ${fd.project||"프로젝트명"} — ${orgLabel} 지원서\n\n## 1. 사업 개요\n\n### 1.1 프로젝트 소개\n"${fd.project}"는 ${fd.genre||"영상 콘텐츠"} 장르의 작품으로, ${fd.company||"제작사"}에서 기획·제작합니다. 본 프로젝트는 ${orgLabel} ${grant?.title||"지원사업"}의 취지에 부합하여 대한민국 ${grant?.cat||"영상"} 산업의 글로벌 경쟁력 강화에 기여하고자 합니다.\n\n### 1.2 기획 의도\n${fd.synopsis||"본 작품은 독창적인 스토리텔링과 혁신적인 비주얼로 국내외 관객에게 새로운 경험을 제공하고자 합니다."}\n\n본 프로젝트의 핵심 차별점:\n- 국내 최초 시도되는 독자적 비주얼 스타일과 서사 구조\n- 글로벌 OTT 플랫폼과의 사전 유통 협의 진행\n- 한국적 소재와 보편적 감성의 결합으로 해외 시장 진출 용이\n\n## 2. 제작 역량\n\n### 2.1 제작진\n감독 ${fd.director||"OOO"}은 ${grant?.cat||"영상"} 분야에서 다수의 수상 경력과 상업적 성과를 보유하고 있습니다. ${fd.company||"본 제작사"}는 설립 이후 꾸준히 양질의 콘텐츠를 제작해왔으며, 국내외 유수 영화제·마켓에서 작품성과 사업성을 인정받았습니다.\n\n### 2.2 기술 역량\n- 자체 개발 제작 파이프라인 보유 (Unreal Engine / Blender / Nuke)\n- 클라우드 렌더팜 운영 및 AI 기반 워크플로우 도입\n- 국내외 협력 네트워크를 통한 공동제작 경험\n\n## 3. 시장 분석 및 유통 전략\n\n### 3.1 타겟\n${fd.target||"국내외 다양한 관객"}을 1차 타겟으로 설정하며, 글로벌 OTT 플랫폼을 통한 해외 유통을 계획합니다.\n\n### 3.2 유통 전략\n- 1단계: 국내 극장/OTT 동시 런칭\n- 2단계: 주요 국제 영화제·마켓 출품 (안시, 부산, 칸 등)\n- 3단계: 글로벌 OTT 2차 판권 및 머천다이징\n\n## 4. 제작 계획\n\n### 4.1 일정\n${fd.timeline||"총 18개월 예정"}\n- 프리프로덕션 4개월: 시나리오, 콘셉트, 스토리보드\n- 프로덕션 10개월: 본 제작\n- 포스트프로덕션 4개월: 합성, 사운드, DI, 마스터링\n\n### 4.2 예산\n총 제작비: ${fd.budget||"미정"}\n- 인건비 45% / 기술·장비 25% / 외주·협력 20% / 기타 10%\n\n## 5. 기대 효과\n\n- 국내 ${grant?.cat||"영상"} 산업 인프라 강화 및 기술 축적\n- 신진 인력 양성 및 양질의 일자리 창출 (30명+)\n- 한국 문화의 글로벌 확산과 한류 콘텐츠 다양성 확보\n- ${orgLabel} 지원사업의 성과 가시화 (해외 수상·판매 실적)\n\n---\n※ 본 지원서는 AI 초안이며, 실제 제출 전 전문가 검토 및 기관별 양식 확인을 권장합니다.`;
    let i=0;
    ref.current=setInterval(()=>{
      i+=Math.floor(Math.random()*10)+5;
      if(i>=fullText.length){i=fullText.length;clearInterval(ref.current);setResult(fullText);setGen(false);}
      setStream(fullText.substring(0,i));
    },18);
  };

  useEffect(()=>()=>{if(ref.current)clearInterval(ref.current);},[]);

  const renderMd = (txt) => txt.split("\n").map((line,i)=>{
    if(line.startsWith("# ")) return <h1 key={i} style={{fontSize:22,fontWeight:800,margin:"0 0 14px",color:T.accent}}>{line.slice(2)}</h1>;
    if(line.startsWith("## ")) return <h2 key={i} style={{fontSize:17,fontWeight:700,margin:"20px 0 10px",borderBottom:`1px solid ${T.border}`,paddingBottom:6}}>{line.slice(3)}</h2>;
    if(line.startsWith("### ")) return <h3 key={i} style={{fontSize:14.5,fontWeight:650,margin:"14px 0 6px",color:T.amber}}>{line.slice(4)}</h3>;
    if(line.startsWith("- ")) return <div key={i} style={{paddingLeft:14,position:"relative",marginBottom:3,fontSize:13.5,color:T.textSec}}><span style={{position:"absolute",left:0,color:T.accent}}>•</span>{line.slice(2)}</div>;
    if(line.startsWith("※")) return <p key={i} style={{color:T.amber,fontStyle:"italic",marginTop:14,padding:10,background:T.amberDim,borderRadius:T.rSm,fontSize:12.5}}>{line}</p>;
    if(line==="---") return <hr key={i} style={{border:"none",borderTop:`1px solid ${T.border}`,margin:"16px 0"}}/>;
    if(!line.trim()) return <br key={i}/>;
    return <p key={i} style={{marginBottom:3,color:T.textSec,fontSize:13.5,lineHeight:1.7}}>{line}</p>;
  });

  if(result||gen) return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,gap:8}}>
        <h2 style={{fontSize:18,fontWeight:800,display:"flex",alignItems:"center",gap:8}}>
          <Ico n="spark" sz={20} c={T.accent}/> AI 생성 지원서
        </h2>
        <div style={{display:"flex",gap:6}}>
          {result&&<Btn sm onClick={()=>{setResult(null);setGen(false);setStream("");setStep(0);}}>다시 작성</Btn>}
          <Btn sm onClick={onBack}><Ico n="back" sz={14}/> 목록</Btn>
        </div>
      </div>
      {gen&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"10px 14px",background:T.accentDim,borderRadius:T.rSm,border:`1px solid ${T.accent}25`}}>
        <Spinner sz={14}/><span style={{fontSize:13,color:T.accent,fontWeight:600}}>AI가 {ORG_COLORS[grant?.org]?.label} 지원서를 작성하고 있습니다...</span>
      </div>}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"26px 28px",maxHeight:"58vh",overflow:"auto",lineHeight:1.7}}>
        {renderMd(stream||result||"")}
        {gen&&<span style={{display:"inline-block",width:2,height:16,background:T.accent,animation:"pulse .8s infinite",verticalAlign:"middle",marginLeft:2}}/>}
      </div>
    </div>
  );

  const inp = (f) => ({
    width:"100%",padding:"10px 14px",background:T.bg,border:`1px solid ${T.border}`,
    borderRadius:T.rSm,color:T.text,fontSize:13.5,fontFamily:T.font,outline:"none",
    transition:"border-color .2s",
  });

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <h2 style={{fontSize:18,fontWeight:800,display:"flex",alignItems:"center",gap:8}}>
          <Ico n="ai" sz={20} c={T.accent}/> AI 지원서 작성
        </h2>
        <Btn sm onClick={onBack}><Ico n="back" sz={14}/> 뒤로</Btn>
      </div>
      <p style={{fontSize:12,color:T.textDim,marginBottom:20,display:"flex",gap:6,alignItems:"center"}}>
        <OrgBadge org={grant?.org}/> {grant?.title}
      </p>

      <div style={{display:"flex",gap:6,marginBottom:22}}>
        {stepLabels.map((l,i)=>(
          <div key={i} style={{flex:1,textAlign:"center"}}>
            <div style={{height:3,borderRadius:2,marginBottom:6,background:i<=step?`linear-gradient(90deg,${T.accent},${T.blue})`:T.border,transition:"all .3s"}}/>
            <span style={{fontSize:11,color:i<=step?T.accent:T.textDim,fontWeight:600}}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {fields[step].map(f=>(
          <div key={f.k}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:T.textSec,marginBottom:5}}>{f.l}</label>
            {f.ml?
              <textarea value={fd[f.k]} placeholder={f.ph} onChange={e=>setFd({...fd,[f.k]:e.target.value})}
                style={{...inp(f),minHeight:110,resize:"vertical"}}
                onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
              :<input value={fd[f.k]} placeholder={f.ph} onChange={e=>setFd({...fd,[f.k]:e.target.value})}
                style={inp(f)}
                onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
            }
          </div>
        ))}
      </div>

      <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
        <Btn sm onClick={()=>setStep(Math.max(0,step-1))} style={{opacity:step===0?.4:1}}>← 이전</Btn>
        {step<2?<Btn primary sm onClick={()=>setStep(step+1)}>다음 →</Btn>
          :<Btn primary sm onClick={doGen} style={{animation:"glow 2s infinite"}}>
            <Ico n="spark" sz={15} c={T.bg}/> AI 지원서 생성
          </Btn>}
      </div>
    </div>
  );
}

// ─── Feedback Scorer ───
function Feedback() {
  const [txt,setTxt]=useState("");
  const [scoring,setScoring]=useState(false);
  const [scores,setScores]=useState(null);
  const [selOrg,setSelOrg]=useState("KOCCA");
  const handle=()=>{
    if(!txt.trim())return;
    setScoring(true);
    setTimeout(()=>{
      setScores({total:82,items:[
        {name:"작품성/기획력",s:85,fb:"시놉시스의 핵심 갈등이 명확하고 주제의식이 잘 드러납니다. 캐릭터 아크를 구체화하면 더 좋습니다."},
        {name:"제작역량",s:78,fb:"감독 경력이 잘 정리되어 있으나, 구체적인 수상 실적과 흥행 데이터를 보강하세요."},
        {name:"시장성/유통전략",s:80,fb:"타겟 관객 분석이 적절합니다. 해외 유사 작품 벤치마크를 추가하면 설득력이 높아집니다."},
        {name:"예산 적정성",s:88,fb:"예산 배분이 합리적이고 일정이 현실적입니다. 리스크 대응 방안을 추가하세요."},
        {name:"서류 완성도",s:79,fb:"구성은 양호하나 도표와 시각 자료를 활용하면 가독성이 향상됩니다."},
      ]});
      setScoring(false);
    },2200);
  };

  return (
    <div className="fu">
      <h2 style={{fontSize:18,fontWeight:800,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
        <Ico n="chart" sz={20} c={T.accent}/> 지원서 피드백 / 점수 평가
      </h2>
      <p style={{fontSize:12.5,color:T.textDim,marginBottom:16}}>작성한 지원서를 붙여넣으면 기관별 평가 기준에 맞춰 AI가 점수와 피드백을 제공합니다.</p>

      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {Object.entries(ORG_COLORS).map(([k,v])=>(
          <button key={k} onClick={()=>setSelOrg(k)} style={{
            padding:"5px 12px",borderRadius:20,border:`1px solid ${selOrg===k?v.fg:T.border}`,
            background:selOrg===k?v.bg:"transparent",color:selOrg===k?v.fg:T.textDim,
            fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:T.font,transition:"all .2s"
          }}>{v.label}</button>
        ))}
      </div>

      <textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="지원서 내용을 여기에 붙여넣으세요..."
        style={{width:"100%",minHeight:150,padding:14,background:T.bg,border:`1px solid ${T.border}`,
          borderRadius:T.r,color:T.text,fontSize:13.5,fontFamily:T.font,resize:"vertical",outline:"none",lineHeight:1.7}}
        onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
      <Btn primary sm onClick={handle} style={{marginTop:10}}>
        {scoring?<><Spinner sz={13} c={T.bg}/> 분석 중...</>:<><Ico n="ai" sz={15} c={T.bg}/> AI 평가 ({ORG_COLORS[selOrg]?.label} 기준)</>}
      </Btn>

      {scores&&<div className="fu" style={{marginTop:20}}>
        <div style={{display:"flex",alignItems:"center",gap:18,padding:20,
          background:`linear-gradient(135deg,${T.accentDim},${T.card})`,borderRadius:T.r,border:`1px solid ${T.accent}20`,marginBottom:16}}>
          <Ring score={scores.total} sz={72}/>
          <div>
            <div style={{fontSize:12,color:T.textDim,marginBottom:3}}>종합 점수</div>
            <div style={{fontSize:26,fontWeight:800,fontFamily:T.mono,color:T.accent}}>{scores.total}<span style={{fontSize:14,color:T.textDim}}>/100</span></div>
            <div style={{fontSize:12,color:T.textSec,marginTop:2}}>합격 가능성: 높음 ✅</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {scores.items.map((it,i)=>(
            <div key={i} className={`fu s${Math.min(i+1,5)}`} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontWeight:700,fontSize:13}}>{it.name}</span>
                <span style={{fontFamily:T.mono,fontWeight:700,fontSize:15,color:it.s>=85?T.accent:it.s>=75?T.amber:T.rose}}>{it.s}</span>
              </div>
              <div style={{height:3,background:T.bg,borderRadius:2,overflow:"hidden",marginBottom:8}}>
                <div style={{width:`${it.s}%`,height:"100%",borderRadius:2,
                  background:it.s>=85?T.accent:it.s>=75?T.amber:T.rose,transition:"width .8s ease"}}/>
              </div>
              <p style={{fontSize:12.5,color:T.textSec,lineHeight:1.6}}>{it.fb}</p>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}

// ─── Template Card ───
function TplCard({t, onClick}) {
  const [h,setH]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      background:h?T.cardHover:T.card,border:`1px solid ${h?T.accent+"40":T.border}`,borderRadius:T.r,
      padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",
      cursor:"pointer",transition:"all .22s",transform:h?"translateY(-1px)":"none"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
          <Badge bg={T.accentDim} fg={T.accent}>합격</Badge>
          <OrgBadge org={t.org}/>
          <Badge bg={T.surface} fg={T.textDim}>{t.cat}</Badge>
          <Badge bg={T.surface} fg={T.textDim}>{t.year}</Badge>
        </div>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</h4>
        <span style={{fontSize:11,color:T.textDim}}><Ico n="dl" sz={11}/> {t.dl}회</span>
      </div>
      <Ring score={t.score} sz={44}/>
    </div>
  );
}

// ─── Dashboard Stats ───
function Stats() {
  const items = [
    {label:"접수중 공고",val:`${ALL_GRANTS.filter(g=>g.status==="접수중").length}건`,icon:"doc",c:T.accent},
    {label:"지원 기관",val:"7개",icon:"building",c:T.blue},
    {label:"합격 템플릿",val:`${TEMPLATES.length}개`,icon:"trophy",c:T.amber},
    {label:"평균 매칭",val:Math.round(ALL_GRANTS.reduce((a,g)=>a+g.match,0)/ALL_GRANTS.length)+"%",icon:"chart",c:T.violet},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}}>
      {items.map((s,i)=>(
        <div key={i} className={`fu s${i+1}`} style={{background:`linear-gradient(145deg,${T.card},${T.surface})`,
          border:`1px solid ${T.border}`,borderRadius:T.r,padding:"16px 10px",textAlign:"center"}}>
          <div style={{marginBottom:6,opacity:.8}}><Ico n={s.icon} sz={22} c={s.c}/></div>
          <div style={{fontSize:20,fontWeight:800,fontFamily:T.mono,color:s.c}}>{s.val}</div>
          <div style={{fontSize:11,color:T.textDim,marginTop:2}}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main App ───
export default function App() {
  const [tab,setTab]=useState("home");
  const [selGrant,setSelGrant]=useState(null);
  const [wrGrant,setWrGrant]=useState(null);
  const [selTpl,setSelTpl]=useState(null);
  const [q,setQ]=useState("");
  const [orgFilter,setOrgFilter]=useState("전체");
  const [catFilter,setCatFilter]=useState("전체");

  const tabs = [
    {k:"home",l:"대시보드",i:"home"},
    {k:"grants",l:"공고 탐색",i:"search"},
    {k:"writer",l:"AI 작성",i:"ai"},
    {k:"tpl",l:"합격 사례",i:"trophy"},
    {k:"fb",l:"피드백",i:"chart"},
  ];

  const orgs = ["전체",...Object.keys(ORG_COLORS)];
  const cats = useMemo(()=>{
    const s = new Set(ALL_GRANTS.map(g=>g.cat));
    return ["전체",...Array.from(s)];
  },[]);

  const filtered = useMemo(()=>ALL_GRANTS.filter(g=>{
    if(q && !g.title.includes(q) && !g.cat.includes(q) && !g.org.includes(q)) return false;
    if(orgFilter!=="전체" && g.org!==orgFilter) return false;
    if(catFilter!=="전체" && g.cat!==catFilter) return false;
    return true;
  }),[q,orgFilter,catFilter]);

  const onGen = (g)=>{setSelGrant(null);setWrGrant(g);setTab("writer");};

  return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:T.bg}}>
        {/* Header */}
        <div style={{
          background:`linear-gradient(180deg,${T.surface} 0%,${T.bg} 100%)`,
          borderBottom:`1px solid ${T.border}`,padding:"14px 20px",
          display:"flex",justifyContent:"space-between",alignItems:"center",
          position:"sticky",top:0,zIndex:100,backdropFilter:"blur(16px)",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,
              background:`linear-gradient(135deg,${T.accent},#00B894)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:`0 2px 12px ${T.accentGlow}`}}>
              <Ico n="spark" sz={18} c={T.bg}/>
            </div>
            <div>
              <h1 style={{fontSize:16,fontWeight:800,letterSpacing:"-0.3px",lineHeight:1.2}}>
                Grant<span style={{color:T.accent}}>AI</span> <span style={{fontSize:11,fontWeight:500,color:T.textDim}}>Pro</span>
              </h1>
              <p style={{fontSize:10,color:T.textDim}}>영상·애니메이션 지원사업 통합 플랫폼</p>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",
            background:T.bg,borderRadius:20,border:`1px solid ${T.border}`,maxWidth:200}}>
            <Ico n="search" sz={13} c={T.textDim}/>
            <input placeholder="검색..." value={q} onChange={e=>{setQ(e.target.value);if(tab!=="grants")setTab("grants");}}
              style={{background:"none",border:"none",color:T.text,fontSize:12,fontFamily:T.font,outline:"none",width:"100%"}}/>
          </div>
        </div>

        <div style={{maxWidth:900,margin:"0 auto",padding:"18px 16px 40px"}}>
          {/* Tabs */}
          <div style={{display:"flex",gap:3,background:T.surface,borderRadius:T.rSm,padding:3,marginBottom:20,overflowX:"auto"}}>
            {tabs.map(t=>(
              <button key={t.k} onClick={()=>setTab(t.k)} style={{
                flex:1,padding:"9px 8px",borderRadius:6,border:"none",minWidth:0,
                background:tab===t.k?T.accentDim:"transparent",
                color:tab===t.k?T.accent:T.textDim,
                fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:T.font,
                transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:5,whiteSpace:"nowrap",
              }}>
                <Ico n={t.i} sz={14}/> {t.l}
              </button>
            ))}
          </div>

          {/* ── HOME ── */}
          {tab==="home"&&<div>
            <Stats/>
            {/* Org Overview */}
            <div style={{marginBottom:22}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>🏢 기관별 현황</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8}}>
                {Object.entries(ORG_COLORS).map(([k,v])=>{
                  const cnt = ALL_GRANTS.filter(g=>g.org===k&&g.status==="접수중").length;
                  return (
                    <div key={k} onClick={()=>{setOrgFilter(k);setTab("grants");}} style={{
                      background:T.card,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"14px 12px",
                      textAlign:"center",cursor:"pointer",transition:"all .2s",
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=v.fg+"60";e.currentTarget.style.background=T.cardHover;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.card;}}>
                      <div style={{fontSize:12,fontWeight:700,color:v.fg,marginBottom:4}}>{v.label}</div>
                      <div style={{fontSize:18,fontWeight:800,fontFamily:T.mono,color:T.text}}>{cnt}<span style={{fontSize:11,color:T.textDim}}>건</span></div>
                      <div style={{fontSize:10,color:T.textDim}}>접수중</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Urgent */}
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>🔥 마감 임박 공고</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
              {ALL_GRANTS.filter(g=>g.status!=="공고예정").sort((a,b)=>new Date(a.deadline)-new Date(b.deadline)).slice(0,3).map(g=>(
                <GrantCard key={g.id} g={g} onClick={()=>setSelGrant(g)}/>
              ))}
            </div>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>⭐ 인기 합격 템플릿</h3>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {TEMPLATES.sort((a,b)=>b.dl-a.dl).slice(0,3).map(t=><TplCard key={t.id} t={t} onClick={()=>setSelTpl(t)}/>)}
            </div>
          </div>}

          {/* ── GRANTS ── */}
          {tab==="grants"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <h2 style={{fontSize:18,fontWeight:800,display:"flex",alignItems:"center",gap:8}}>
                <Ico n="search" sz={20} c={T.accent}/> 지원사업 공고
              </h2>
              <span style={{fontSize:12,color:T.textDim,fontFamily:T.mono}}>{filtered.length}건</span>
            </div>
            {/* Org Filters */}
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:T.textDim,marginBottom:5,fontWeight:600}}>기관</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {orgs.map(o=>{
                  const v = o==="전체"?{bg:T.surface,fg:T.textSec}:ORG_COLORS[o];
                  const active = orgFilter===o;
                  return <button key={o} onClick={()=>setOrgFilter(o)} style={{
                    padding:"4px 10px",borderRadius:16,border:`1px solid ${active?v.fg:T.border}`,
                    background:active?v.bg:"transparent",color:active?v.fg:T.textDim,
                    fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font,transition:"all .2s"
                  }}>{o==="전체"?"전체":v.label||o}</button>;
                })}
              </div>
            </div>
            {/* Cat Filters */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.textDim,marginBottom:5,fontWeight:600}}>분야</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {cats.map(c=>(
                  <button key={c} onClick={()=>setCatFilter(c)} style={{
                    padding:"4px 10px",borderRadius:16,border:`1px solid ${catFilter===c?T.accent:T.border}`,
                    background:catFilter===c?T.accentDim:"transparent",color:catFilter===c?T.accent:T.textDim,
                    fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font,transition:"all .2s"
                  }}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {filtered.sort((a,b)=>b.match-a.match).map((g,i)=>(
                <div key={g.id} className={`fu s${Math.min(i+1,5)}`}>
                  <GrantCard g={g} onClick={()=>setSelGrant(g)}/>
                </div>
              ))}
              {filtered.length===0&&<div style={{textAlign:"center",padding:40,color:T.textDim}}>검색 결과가 없습니다.</div>}
            </div>
          </div>}

          {/* ── WRITER ── */}
          {tab==="writer"&&(wrGrant?<AIWriter grant={wrGrant} onBack={()=>setWrGrant(null)}/>:
            <div className="fu">
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
                <Ico n="ai" sz={20} c={T.accent}/> AI 지원서 작성
              </h2>
              <p style={{fontSize:12.5,color:T.textDim,marginBottom:16}}>지원할 공고를 선택하면 기관별 맞춤 지원서를 AI가 작성합니다.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {ALL_GRANTS.filter(g=>g.status!=="공고예정").sort((a,b)=>b.match-a.match).map(g=>(
                  <GrantCard key={g.id} g={g} onClick={()=>setWrGrant(g)}/>
                ))}
              </div>
            </div>
          )}

          {/* ── TEMPLATES ── */}
          {tab==="tpl"&&<div className="fu">
            <h2 style={{fontSize:18,fontWeight:800,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
              <Ico n="trophy" sz={20} c={T.amber}/> 합격 사례 DB
            </h2>
            <p style={{fontSize:12.5,color:T.textDim,marginBottom:16}}>기관별 실제 합격 지원서 구조와 핵심 전략을 참고하세요.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {TEMPLATES.map((t,i)=><div key={t.id} className={`fu s${Math.min(i+1,5)}`}><TplCard t={t} onClick={()=>setSelTpl(t)}/></div>)}
            </div>
          </div>}

          {/* ── FEEDBACK ── */}
          {tab==="fb"&&<Feedback/>}
        </div>

        <GrantModal g={selGrant} onClose={()=>setSelGrant(null)} onGen={onGen}/>
        <TplModal t={selTpl} onClose={()=>setSelTpl(null)}/>
      </div>
    </>
  );
}
