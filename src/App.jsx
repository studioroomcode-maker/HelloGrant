import { useState, useEffect, useRef, useMemo } from "react";

// ─── Design System: "Paper Light" ───
const T = {
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  surfaceHover: "#F8FAFC",
  card: "#FFFFFF",
  cardHover: "#F8FAFC",
  border: "#E2E8F0",
  borderActive: "#CBD5E1",
  accent: "#00956D",
  accentDim: "rgba(0,149,109,0.09)",
  accentGlow: "rgba(0,149,109,0.16)",
  blue: "#2563EB",
  blueDim: "rgba(37,99,235,0.08)",
  amber: "#B45309",
  amberDim: "rgba(180,83,9,0.08)",
  rose: "#BE123C",
  roseDim: "rgba(190,18,60,0.08)",
  violet: "#6D28D9",
  violetDim: "rgba(109,40,217,0.08)",
  sky: "#0369A1",
  skyDim: "rgba(3,105,161,0.08)",
  text: "#1A2332",
  textSec: "#475569",
  textDim: "#94A3B8",
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
  부산영상: { bg: T.blueDim, fg: T.blue, label: "부산영상" },
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
const KOCCA_GUIDE = "https://www.kocca.kr/download/cop/kocca_business_2026_v1_1.pdf";
const KOCCA_LIST  = "https://www.kocca.kr/kocca/pims/list.do?menuNo=204104";
const KOFIC_LIST  = "https://www.kofic.or.kr/kofic/business/prom/promotionBoardList.do";

// ※ 공고 데이터는 각 기관 공식 사이트 기준이며, 상세 내용은 반드시 원문 공고를 확인하세요.
const ALL_GRANTS = [
  // ── KOCCA 현재 접수 중 · 마감임박 (공식 사이트 기준 2026.04.09) ──
  { id:1, title:"2026년 화면해설방송 제작지원작 공모", org:"KOCCA", cat:"방송영상",
    budget:"최대 5천만원", budgetDetail:"작품당 3천만원~5천만원 차등 지원, 8~10개 작품 선정 (장애인 미디어 접근성 향상 사업)",
    deadline:"2026-05-08", period:"2026-04-09 ~ 2026-05-08 18:00", status:"접수중",
    url:KOCCA_LIST, guideUrl:KOCCA_GUIDE,
    contact:"한국콘텐츠진흥원 방송영상산업팀 061-900-6233",
    eligibility:"국내 방송영상 제작사 (화면해설 작가 계획 포함 필수, 방송사 편성 협의 우대)",
    desc:"시청각장애인의 영상 미디어 접근성 향상을 위한 화면해설방송 제작을 지원합니다. 완성 작품은 지상파·공영방송 편성 연계. ※ KOCCA 공식 공고(2026.04.09) 기준.",
    reqs:["사업계획서","제작기획서","화면해설 작가 섭외 계획","예산서","방송사 협의 확인서(있는 경우)"],
    eval:[{name:"기획완성도",w:30,d:"화면해설 퀄리티, 대본 완성도"},{name:"접근성 기여",w:30,d:"장애인 접근성 향상 효과"},{name:"제작역량",w:25,d:"제작사 실적"},{name:"방송연계",w:15,d:"방송사 편성 계획"}],
    match:79 },

  { id:2, title:"2026 글로벌 OTT 연계형 제작지원(Rakuten Viki)", org:"KOCCA", cat:"방송영상",
    budget:"최대 3억원", budgetDetail:"프로젝트당 최대 3억원 (KOCCA 지원 + Rakuten Viki 투자 매칭), 4~6편 선정",
    deadline:"2026-04-16", period:"2026-04-01 ~ 2026-04-16 18:00", status:"마감임박",
    url:KOCCA_LIST, guideUrl:KOCCA_GUIDE,
    contact:"한국콘텐츠진흥원 방송영상산업팀 061-900-6235",
    eligibility:"국내 드라마·웹드라마 제작사 (Rakuten Viki 플랫폼 공급 협의 완료 또는 진행 중인 프로젝트)",
    desc:"Rakuten Viki와 연계한 아시아 타겟 K-드라마·웹드라마 제작을 지원합니다. 동남아·일본·대만 등 아시아 OTT 시장 진출 프로젝트 우대. ※ KOCCA 공식 공고(2026.03.27) 기준.",
    reqs:["드라마 기획안(전 에피소드 구성)","Rakuten Viki 협의 확인서","시놉시스","예산서","제작사 실적"],
    eval:[{name:"OTT 연계",w:30,d:"Rakuten Viki 협의 수준"},{name:"기획력",w:25,d:"에피소드 구성, 차별성"},{name:"글로벌 소구력",w:25,d:"아시아 타겟 적합성"},{name:"제작역량",w:20,d:"드라마 제작 실적"}],
    match:84 },

  { id:3, title:"2026 글로벌 OTT 연계형 제작지원(DramaBox)", org:"KOCCA", cat:"방송영상",
    budget:"최대 3억원", budgetDetail:"프로젝트당 최대 3억원 (KOCCA 지원 + DramaBox 투자 매칭), 4~6편 선정",
    deadline:"2026-04-20", period:"2026-04-01 ~ 2026-04-20 18:00", status:"마감임박",
    url:KOCCA_LIST, guideUrl:KOCCA_GUIDE,
    contact:"한국콘텐츠진흥원 방송영상산업팀 061-900-6235",
    eligibility:"국내 드라마·웹드라마 제작사 (DramaBox 플랫폼 공급 협의 완료 또는 진행 중인 프로젝트)",
    desc:"DramaBox(중화권 OTT)와 연계한 K-드라마 제작 지원. 중국·대만·홍콩 중화권 타겟 콘텐츠 우대. 수정공고 포함. ※ KOCCA 공식 공고(2026.03.27) 기준.",
    reqs:["드라마 기획안","DramaBox 협의 확인서","중화권 시장 전략서","예산서","제작사 실적"],
    eval:[{name:"OTT 연계",w:30,d:"DramaBox 협의 수준"},{name:"기획력",w:25,d:"스토리, 캐릭터 완성도"},{name:"중화권 소구력",w:25,d:"중화권 타겟 적합성"},{name:"제작역량",w:20,d:"제작 실적"}],
    match:81 },

  { id:4, title:"2026 글로벌 OTT 연계형 제작지원(Viu)", org:"KOCCA", cat:"방송영상",
    budget:"최대 3억원", budgetDetail:"프로젝트당 최대 3억원 (KOCCA 지원 + Viu 투자 매칭), 4~6편 선정",
    deadline:"2026-04-16", period:"2026-04-01 ~ 2026-04-16 18:00", status:"마감임박",
    url:KOCCA_LIST, guideUrl:KOCCA_GUIDE,
    contact:"한국콘텐츠진흥원 방송영상산업팀 061-900-6235",
    eligibility:"국내 드라마·웹드라마 제작사 (Viu 플랫폼 공급 협의 완료 또는 진행 중인 프로젝트)",
    desc:"Viu(동남아·중동 OTT)와 연계한 K-드라마 제작 지원. 동남아(태국·인도네시아·말레이시아)·중동 시장 진출 콘텐츠 우대. ※ KOCCA 공식 공고(2026.03.27) 기준.",
    reqs:["드라마 기획안","Viu 협의 확인서","동남아·중동 시장 전략","예산서","제작사 실적"],
    eval:[{name:"OTT 연계",w:30,d:"Viu 협의 수준"},{name:"기획력",w:25,d:"스토리, 에피소드 구성"},{name:"동남아 소구력",w:25,d:"동남아·중동 적합성"},{name:"제작역량",w:20,d:"제작 실적"}],
    match:80 },

  { id:5, title:"2026 IP 라이선싱 빌드업 참가기업(중소IP사) 모집", org:"KOCCA", cat:"IP 영상화",
    budget:"최대 5천만원", budgetDetail:"기업당 최대 5천만원 (IP 비즈니스 역량 강화 + 해외 라이선싱 컨설팅 포함), 20개사 내외",
    deadline:"2026-04-23", period:"2026-04-06 ~ 2026-04-23 18:00", status:"접수중",
    url:KOCCA_LIST, guideUrl:KOCCA_GUIDE,
    contact:"한국콘텐츠진흥원 IP콘텐츠팀 061-900-6370",
    eligibility:"애니메이션·웹툰·캐릭터 등 콘텐츠 IP 보유 국내 중소기업 (매출 50억 미만, IP 상업 활동 이력)",
    desc:"중소 IP 보유 기업의 글로벌 라이선싱 역량 강화 지원. MIPCOM·Licensing Expo 등 해외 박람회 참가비 및 IP 컨설팅 비용 포함. ※ KOCCA 공식 공고(2026.04.06) 기준.",
    reqs:["사업계획서","보유 IP 목록 및 소개자료","IP 해외 라이선싱 전략","기업 소개서","사업자등록증"],
    eval:[{name:"IP 가치",w:30,d:"IP 독창성, 상업 활용 가능성"},{name:"사업 전략",w:30,d:"라이선싱 계획 구체성"},{name:"기업역량",w:25,d:"IP 활동 이력"},{name:"해외진출",w:15,d:"해외 시장 이해도"}],
    match:71 },

  { id:6, title:"2026년 지역 대표 글로컬 콘텐츠 제작·재투자 지원", org:"KOCCA", cat:"영상제작",
    budget:"최대 10억원", budgetDetail:"프로젝트당 최대 10억원 (정부 70%, 지역 자부담 30%), 권역별 1~2개 선정",
    deadline:"2026-04-14", period:"2026-03-18 ~ 2026-04-14 18:00", status:"마감임박",
    url:KOCCA_LIST, guideUrl:KOCCA_GUIDE,
    contact:"한국콘텐츠진흥원 지역콘텐츠팀 061-900-6310",
    eligibility:"수도권 외 지역 소재 콘텐츠 기업 (지역 대표 문화자원 활용, 글로벌 유통 계획 필수)",
    desc:"지역의 고유 문화자원을 활용한 글로벌 경쟁력 있는 콘텐츠 제작·재투자 지원. 완성 콘텐츠 수익을 지역 생태계에 환원하는 구조. ※ KOCCA 공식 공고(2026.03.18) 기준.",
    reqs:["기획서","지역 문화자원 활용 계획","제작계획서","글로벌 유통 전략","예산서","지역 소재 증빙"],
    eval:[{name:"글로벌 가능성",w:30,d:"해외 시장 경쟁력"},{name:"지역성",w:25,d:"지역 문화자원 활용도"},{name:"제작역량",w:25,d:"프로젝트 실현 가능성"},{name:"재투자 계획",w:20,d:"수익 환원 구조"}],
    match:73 },

  // ── KOFIC 2026년 1분기 지원사업 (접수 결과 발표 완료 — 마감) ──
  // ※ KOFIC 공식 사이트(promotionBoardList) 접수결과 공지 기준, 상세 조건은 원문 확인 요망
  { id:7, title:"2026년 1분기 한국영화 차기작 기획개발 지원사업", org:"KOFIC", cat:"기획개발",
    budget:"최대 5천만원", budgetDetail:"프로젝트당 최대 5천만원, 15건 내외 선정",
    deadline:"2026-02-28", period:"2026-01-13 ~ 2026-02-28 18:00", status:"마감",
    url:KOFIC_LIST, guideUrl:KOFIC_LIST,
    contact:"영화진흥위원회 창작개발팀 051-720-4813",
    eligibility:"국내 영화 제작사 (사업자등록 후 1년 이상) 또는 시나리오 작가·감독",
    desc:"장편 한국영화 차기작 시나리오 개발 지원. 2026년 1분기 접수 결과 발표 완료(2026.03.20). 2분기 재공고 예정. ※ KOFIC 공식 사이트 기준.",
    reqs:["기획의도서","트리트먼트(5~20페이지)","작가·감독 이력서","기획 일정표"],
    eval:[{name:"소재 독창성",w:35,d:"차별화된 소재"},{name:"기획 완성도",w:30,d:"세계관·캐릭터"},{name:"시장성",w:20,d:"상업 가능성"},{name:"작가역량",w:15,d:"수상·이력"}],
    match:77 },

  { id:8, title:"2026년 한국영화 시나리오 공모전", org:"KOFIC", cat:"시나리오",
    budget:"최대 3천만원", budgetDetail:"대상 3천만원 / 최우수 1천5백만원 / 우수 5백만원, 수상작 기획개발 연계",
    deadline:"2026-02-21", period:"2026-01-06 ~ 2026-02-21 18:00", status:"마감",
    url:KOFIC_LIST, guideUrl:KOFIC_LIST,
    contact:"영화진흥위원회 창작개발팀 051-720-4813",
    eligibility:"국내 거주 누구나 (기성·신인 구분 없음, 1인 1편)",
    desc:"한국영화 시나리오 저변 확대·신인 발굴. 접수 결과 발표 완료(2026.03.13). ※ KOFIC 공식 사이트 기준.",
    reqs:["시나리오 완본(90~130매)","작품 개요서","작가 이력서"],
    eval:[{name:"완성도",w:35,d:"극작·대사·구성"},{name:"독창성",w:30,d:"소재·관점"},{name:"영화성",w:20,d:"영상화 가능성"},{name:"대중성",w:15,d:"관객 흡인력"}],
    match:76 },

  { id:9, title:"2026년 AI 기반 영화 제작지원(장편)", org:"KOFIC", cat:"AI/기술",
    budget:"최대 6억원", budgetDetail:"장편 편당 최대 6억원 (AI 기술비 최대 1억원 별도), 5편 내외",
    deadline:"2026-02-19", period:"2026-01-05 ~ 2026-02-19 18:00", status:"마감",
    url:KOFIC_LIST, guideUrl:KOFIC_LIST,
    contact:"영화진흥위원회 기술혁신팀 051-720-4890",
    eligibility:"AI 기술을 영화 제작 공정에 적용하는 국내 영화 제작사",
    desc:"AI 기술 적용 장편 극영화 제작 지원. 접수 결과 발표 완료(2026.03.11). ※ KOFIC 공식 사이트 기준.",
    reqs:["시나리오 완본","AI 기술 적용 계획서","제작기획서","예산서"],
    eval:[{name:"AI 혁신성",w:30,d:"기술 적용 독창성"},{name:"작품성",w:25,d:"시나리오·연출 비전"},{name:"제작역량",w:25,d:"제작사 실적"},{name:"사업화",w:20,d:"배급 계획"}],
    match:80 },

  { id:10, title:"2026년 AI 기반 영화 제작지원(단편)", org:"KOFIC", cat:"AI/기술",
    budget:"최대 1억원", budgetDetail:"단편 편당 5천만원~1억원 차등 (AI 기술비 최대 3천만원 별도), 10편 내외",
    deadline:"2026-02-19", period:"2026-01-05 ~ 2026-02-19 18:00", status:"마감",
    url:KOFIC_LIST, guideUrl:KOFIC_LIST,
    contact:"영화진흥위원회 기술혁신팀 051-720-4890",
    eligibility:"만 40세 이하 신진 감독 또는 AI 기술 보유 개인·팀",
    desc:"AI 기술 활용 단편 영화 지원. 접수 결과 발표 완료(2026.03.11). ※ KOFIC 공식 사이트 기준.",
    reqs:["시나리오(20~40매)","AI 활용 계획서","감독 소개서","예산서"],
    eval:[{name:"AI 창의성",w:35,d:"기술 적용 독창성"},{name:"작품성",w:30,d:"연출 비전"},{name:"실현가능성",w:20,d:"일정·예산"},{name:"잠재력",w:15,d:"감독 성장 가능성"}],
    match:74 },

  { id:11, title:"2026년 독립·예술영화 개봉지원", org:"KOFIC", cat:"독립영화",
    budget:"최대 1억5천만원", budgetDetail:"P&A(홍보·마케팅·배급) 비용 최대 1억5천만원, 완성 영화 신청",
    deadline:"2026-02-13", period:"2026-01-05 ~ 2026-02-13 18:00", status:"마감",
    url:KOFIC_LIST, guideUrl:KOFIC_LIST,
    contact:"영화진흥위원회 배급지원팀 051-720-4826",
    eligibility:"국내 독립·예술영화 배급사 또는 제작사 (완성 영화, 극장 개봉 확정)",
    desc:"완성된 독립·예술영화의 극장 개봉 P&A 비용 지원. 접수 결과 발표 완료(2026.03.06). ※ KOFIC 공식 사이트 기준.",
    reqs:["완성본(DCP 또는 링크)","개봉 확약서","P&A 계획서","예산서","관람등급 심의 결과"],
    eval:[{name:"작품성",w:30,d:"완성도, 영화제 수상"},{name:"배급 전략",w:30,d:"상영관 확보 계획"},{name:"P&A 적정성",w:25,d:"예산 타당성"},{name:"기대 성과",w:15,d:"관객 목표"}],
    match:70 },

  { id:12, title:"2026년 상반기 한국영화 기획개발지원(제작사·초기기획)", org:"KOFIC", cat:"기획개발",
    budget:"최대 5천만원", budgetDetail:"초기기획 단계 최대 5천만원, 15건 내외 선정",
    deadline:"2026-02-07", period:"2025-12-22 ~ 2026-02-07 18:00", status:"마감",
    url:KOFIC_LIST, guideUrl:KOFIC_LIST,
    contact:"영화진흥위원회 창작개발팀 051-720-4813",
    eligibility:"국내 영화 제작사 (사업자등록 후 1년 이상)",
    desc:"장편 상업영화 초기 기획 단계 지원. 접수 결과 발표 완료(2026.03.03). ※ KOFIC 공식 사이트 기준.",
    reqs:["기획의도서","트리트먼트","감독 이력서","기획 일정표"],
    eval:[{name:"소재 독창성",w:35,d:"차별화된 소재"},{name:"기획 완성도",w:30,d:"세계관·캐릭터"},{name:"시장성",w:20,d:"상업 가능성"},{name:"작가역량",w:15,d:"이전 작품"}],
    match:75 },

  // ── KOMACON ──
  { id:13, title:"2026 만화·웹툰 창작 지원", org:"KOMACON", cat:"만화/웹툰",
    budget:"최대 3천만원", budgetDetail:"작품당 1천만원~3천만원 차등, 50작품 내외 선정 (국비 100%)",
    deadline:"2026-05-15", period:"2026-04-08 ~ 2026-05-15 17:00", status:"접수중",
    url:"https://www.komacon.kr/b_sys/index.asp?b_mode=view&b_code=4&b_sq=29884&s_cate=1",
    guideUrl:"https://www.komacon.kr/b_sys/index.asp?b_mode=view&b_code=4&b_sq=29884&s_cate=1",
    contact:"한국만화영상진흥원 창작지원팀 063-320-0114",
    eligibility:"국내 거주 만화·웹툰 작가 (데뷔 여부 무관, 팀 창작 가능, 1인 1작품 한정)",
    desc:"다양성 만화 및 웹툰 창작 초기 단계를 지원합니다. 완성 작품은 KOMACON 플랫폼 연계 유통 지원. KOMACON 공식 공고 기준.",
    reqs:["작품 기획서","원고 샘플(5화 이상)","작가 이력서"],
    eval:[{name:"작품성",w:40,d:"스토리, 그림체 완성도"},{name:"독창성",w:30,d:"주제·캐릭터 차별성"},{name:"완성도",w:30,d:"샘플 원고 품질"}],
    match:68 },

  { id:14, title:"2026 만화 원작 콘텐츠 영상화 지원", org:"KOMACON", cat:"IP 영상화",
    budget:"최대 2억원", budgetDetail:"프로젝트당 최대 2억원 (정부 50%, 민간 50% 매칭), 8개 프로젝트 내외",
    deadline:"2026-06-15", period:"2026-05-12 ~ 2026-06-15 17:00", status:"공고예정",
    url:"https://www.komacon.kr/b_sys/index.asp?b_mode=view&b_code=4&b_sq=29886&s_cate=1",
    guideUrl:"https://www.komacon.kr/b_sys/index.asp?b_mode=view&b_code=4&b_sq=29886&s_cate=1",
    contact:"한국만화영상진흥원 영상산업팀 063-320-0127",
    eligibility:"만화·웹툰 원작 IP 보유자 또는 정당한 계약을 맺은 영상 제작사 (원작자 동의서 필수)",
    desc:"만화·웹툰 IP를 활용한 애니메이션/드라마 영상화 프로젝트를 지원합니다. 누적 조회수 500만 이상 IP 우대. KOMACON 공식 공고 기준.",
    reqs:["IP 권리 증빙","영상화 기획서","시놉시스","예산서","원작자 동의서"],
    eval:[{name:"IP 가치",w:30,d:"조회수, 팬덤, 상업성"},{name:"영상화 전략",w:25,d:"각색 방향성"},{name:"제작역량",w:25,d:"제작사 실적"},{name:"시장성",w:20,d:"유통·해외 계획"}],
    match:83 },
];
const TEMPLATES = [
  { id:1, title:"KOCCA 애니메이션 제작지원 합격 사례", year:2025, score:94, org:"KOCCA", cat:"애니메이션", dl:412,
    project:"우주의 바다", company:"스튜디오 블루오션",
    summary:"SF 애니메이션 시리즈로, 해저 도시와 우주 탐사라는 이중 세계관을 통해 환경 문제와 인류의 미래를 탐구하는 작품.",
    keyPoints:["시놉시스에서 '왜 지금 이 이야기인가'의 시의성을 명확히 제시","감독의 단편 수상 이력 3건을 구체적 수치와 함께 기술","Netflix 아시아 담당자 사전 미팅 내용을 유통전략에 포함","UE5 하이브리드 파이프라인 기술 우위를 시각 자료로 설명","해외 유사작 흥행 데이터로 시장성 뒷받침"],
    structure:["1. 사업개요 (프로젝트 소개, 기획의도, 차별점)","2. 제작역량 (감독·PD 상세 이력, 수상/흥행 실적)","3. 작품 내용 (시놉시스, 캐릭터, 에피소드 구성)","4. 시장분석 및 유통전략 (타겟, 벤치마크, OTT 사전 협의)","5. 제작계획 (상세 일정표, WBS)","6. 예산계획 (항목별 산출근거)","7. 기대효과 (산업적·문화적·경제적)"],
    tips:"KOCCA는 '글로벌 유통 가능성'과 '기술 혁신성'을 중시합니다. 사전 유통 협의 실적이 있다면 반드시 포함하세요.",
    sampleDoc:{
      intent:`기후 위기와 우주 개발이 교차하는 2070년을 배경으로, '환경 재앙 이후 인류는 어떻게 다시 연대하는가'라는 질문을 담습니다. <나의 이웃 토토로>, <바람 계곡의 나우시카>가 증명하듯 자연-인간의 관계를 다룬 애니메이션은 전 세대를 관통하는 보편 정서를 지닙니다. 저희는 해저 도시라는 고유한 한국적 SF 세계관을 통해 글로벌 시장에서 차별화된 콘텐츠를 선보이고자 합니다. 본 작품의 기획은 2022년 KAIST 기후공학 연구진과의 3개월 자문에서 출발했으며, 세계관의 과학적 정합성이 이 작품의 최대 강점입니다.`,
      synopsis:`2070년. 대기 붕괴로 지상 거주가 불가해진 지구, 인류는 해저 돔 도시 '아쿠아리온'에서 삶을 이어간다. 해양 탐사 기사의 딸 소아(16)는 아버지의 유품인 고대 해류 지도를 발견하고, 그 끝에 우주 정거장 '헬리오스'—인류 최후의 탈출구—가 존재한다는 비밀을 알게 된다. 국제 자원관리기구의 추격을 피해 소아는 밀수업자 출신 항법사 준(19), AI 잠수함 파일럿 리아(17)와 함께 심해에서 우주까지 이어지는 위험한 항로에 나선다. 총 13화, 회당 22분.`,
      capability:`감독 박서준(39)은 단편 <해류>(2019, 부천판타스틱영화제 특별상), <심연의 빛>(2022, 안시 국제 애니메이션 영화제 심사위원상) 수상자입니다. 프로듀서 이지민은 OTT 시리즈 3편 제작, 누적 시청 1,200만 회를 달성했습니다. 스튜디오 블루오션은 Unreal Engine 5 기반 하이브리드 파이프라인을 자체 구축, 유사 규모 작품 대비 제작 기간을 30% 단축하는 기술 우위를 보유합니다. 2024년 넷플릭스 아시아 콘텐츠팀과 시즌 전체 공급 관련 2차 미팅을 완료하였습니다(의향서 별첨 1).`,
      market:`글로벌 애니메이션 시장은 2026년 기준 3,200억 달러 규모로 성장 예상(PwC 미디어 리포트 2025). 경쟁 벤치마크인 넷플릭스 <Sea Beast>(2022)는 공개 4주 내 2억 분 시청을 기록, 환경·해양 소재 애니메이션의 글로벌 수요를 증명했습니다. 주 타겟은 13~24세 Z세대이며, 환경 감수성이 높은 해당 층에서 OTT 소비가 급증하고 있습니다. 1차 방영 후 일본·동남아 동시 배급, 캐릭터 IP 라이선싱(완구·게임)으로 수익 다각화를 계획합니다.`
    }},
  { id:2, title:"KOFIC 독립영화 제작지원 합격 사례", year:2025, score:88, org:"KOFIC", cat:"독립영화", dl:298,
    project:"잔상", company:"필름 레터스",
    summary:"5·18 민주화운동 당시 사진기자의 시선을 통해 기억과 기록의 의미를 묻는 독립 드라마.",
    keyPoints:["연출의도서에 개인적 동기와 사회적 메시지를 분리하여 깊이 서술","역사 자문위원 3인의 참여 계획을 명시하여 고증 신뢰성 확보","부산·광주 로케이션 사전답사 결과를 사진과 함께 첨부","저예산 촬영 경험을 어필하며 예산 효율성 강조","독립영화제 3곳 출품 일정을 구체적으로 제시"],
    structure:["1. 감독 연출의도 (개인적 동기, 영화적 비전)","2. 시나리오 개요 (로그라인, 시놉시스, 트리트먼트)","3. 제작진 소개 (감독 필모, 프로듀서 실적)","4. 제작계획 (촬영 일정, 로케이션, 캐스팅)","5. 예산서 (항목별 상세)","6. 유통계획 (영화제 전략, 배급사)"],
    tips:"KOFIC 독립영화는 '작품성+독창성' 배점이 60%입니다. 연출의도서에 가장 많은 공을 들이세요.",
    sampleDoc:{
      intent:`1980년 5월, 광주에서 카메라를 든 한 사진기자가 있었습니다. 그의 필름 안에는 역사교과서에 실리지 못한 얼굴들이 있었습니다. 본 작품은 '기록하는 자'의 윤리적 딜레마—찍어야 하는가, 뛰어들어야 하는가—를 현재 시제로 묻습니다. 감독 개인적으로는 외조부가 당시 광주 시민군 출신이라는 사실이 이 이야기를 시작하게 한 동기이며, 역사적 사건 재현이 아닌 '인간의 선택과 기억'에 초점을 맞춥니다.`,
      synopsis:`1980년 5월, 사진기자 홍재수(36)는 광주에 파견된다. 냉정한 관찰자로 셔터를 눌러왔던 그는, 렌즈 너머 한 소년(15)의 눈과 마주친다. 소년은 그에게 "왜 찍기만 하느냐"고 묻는다. 3일간의 기록과 선택, 그리고 40년 뒤 노인이 된 홍재수가 그 필름을 꺼내드는 현재. 과거와 현재의 교차 편집을 통해 기억이 어떻게 재구성되는지를 탐구하는 90분 장편.`,
      capability:`연출 최지수(34) 감독은 단편 <유리창>(2021, 전주국제영화제 한국경쟁)으로 데뷔, 동년 서울독립영화제 관객상 수상. 프로듀서 강민호는 <우리가 있는 곳>(2023, 독립영화 박스오피스 3주 1위) 제작 경력. 촬영감독 이서영은 16mm 필름(과거)과 디지털(현재)을 혼용하는 이중 촬영 방식으로 시각적 언어를 구분합니다. 광주·부산 현지 사전 답사 3회 완료, 로케이션 확정 및 지자체 협조 공문 취득 상태입니다.`,
      market:`5·18 소재 콘텐츠는 최근 5년간 안정적 수요를 보입니다. <택시운전사>(2017) 1,218만 관객, <오월의 청춘>(2021) OTT 진입 등이 근거입니다. 본 작품은 역사 재현이 아닌 '기자의 윤리'라는 보편 주제를 전면에 내세워 전주·부산 국제영화제 경쟁 부문 및 DOC NYC, 암스테르담 IDFA 출품을 1차 목표로 합니다. 아트하우스 배급사 씨네소파와 사전 협의 중이며, 극장 개봉 후 왓챠 단독 스트리밍을 검토 중입니다.`
    }},
  { id:3, title:"KOCCA 방송영상 OTT 연계 합격 사례", year:2025, score:91, org:"KOCCA", cat:"방송영상", dl:356,
    project:"디지털 노마드", company:"콘텐츠팩토리",
    summary:"전 세계를 떠도는 디지털 노마드 청년들의 리얼리티 다큐 시리즈. 글로벌 OTT 동시 방영 목표.",
    keyPoints:["왓챠와 사전 MOU 체결 내용을 첨부","해외 7개국 촬영 로드맵을 인포그래픽으로 제시","타겟 시청자 페르소나 3종을 데이터 기반으로 작성","시즌2 확장 및 IP 파생(웹예능, 숏폼) 계획 포함","이전 OTT 시리즈 시청률 데이터를 실적 근거로 제시"],
    structure:["1. 기획안 (컨셉, 포맷, 차별점)","2. 에피소드 구성안 (전체 8화)","3. 제작계획서 (촬영지, 일정, 인력)","4. 유통계획서 (OTT 협의 현황, 해외 판매)","5. 예산서","6. 시즌 확장 및 IP 활용 전략"],
    tips:"OTT 연계 사업은 '유통전략' 비중이 25%로 높습니다. 플랫폼과의 구체적 협의 내역이 핵심입니다.",
    sampleDoc:{
      intent:`'정착'을 강요받는 시대에, 정착하지 않는 삶을 선택한 청년들의 이야기입니다. 포르투갈 리스본, 발리 창구, 멕시코 오아하카—이들은 노트북 하나로 세계를 사무실로 삼습니다. 본 시리즈는 단순한 여행 콘텐츠가 아닌, '일의 의미'와 '자유의 대가'를 동시에 탐구하는 다큐 포맷입니다. 국내 프리랜서 인구 220만 명, MZ세대의 워라밸 관심 급증이라는 시의성 있는 맥락 위에 제작됩니다.`,
      synopsis:`총 8화. 각 화는 독립된 도시와 주인공을 가지며, 최종화에서 이들이 한 도시에 모여 '노마드 페스티벌'을 여는 것으로 완결됩니다. 1화 리스본(UX 디자이너 김지현, 28), 2화 발리(개발자 이민준, 31), 3화 오아하카(작가 박수아, 26), 4화 치앙마이(유튜버 최동욱, 29)… 각 에피소드는 그들의 하루 루틴, 현지 커뮤니티와의 관계, 그리고 가족에게 보내는 영상 편지로 구성됩니다.`,
      capability:`콘텐츠팩토리는 OTT 오리지널 <우리 동네 식당>(왓챠, 2023, 시즌 내 조회수 480만) 및 <직업의 비밀>(네이버 시리즈온, 2024) 제작사입니다. 연출 팀은 7개국 해외 촬영 경험을 보유하며, 현지 코디네이터 네트워크를 통해 제작비를 국내 촬영 대비 30% 절감한 실적이 있습니다. 왓챠와 시즌1 전 화 선공급 MOU를 2025년 3월 체결하였습니다(별첨 2).`,
      market:`글로벌 '노마드 라이프스타일' 관련 유튜브 콘텐츠 평균 조회수는 전년 대비 67% 증가(2024, Google Trends). 국내 OTT 다큐 장르 점유율은 21.4%로 드라마 다음으로 높습니다(KOCCA 2024 보고서). 왓챠 1차 배급 후 아시아 OTT(iQIYI, Viu)와 시즌 패키지 협상을 진행할 예정입니다. 시즌2에서는 숏폼 스핀오프와 브랜디드 콘텐츠(협찬 패키지)로 수익 다각화를 계획합니다.`
    }},
  { id:4, title:"KOMACON 웹툰 IP 영상화 합격 사례", year:2024, score:86, org:"KOMACON", cat:"IP 영상화", dl:189,
    project:"환생검 영상화 프로젝트", company:"IP브릿지",
    summary:"네이버 웹툰 인기작 '환생검'을 극장판 애니메이션으로 영상화하는 프로젝트.",
    keyPoints:["누적 조회수·댓글수·별점으로 IP 가치를 정량적 증명","원작자 참여 각색 계획과 계약 조건 명시","해외(일본·동남아) 웹툰 인기 순위로 글로벌 시장성 입증","원작 대비 영상화 변경점과 이유를 명확히 서술","캐릭터 디자인 컨셉아트 5종 첨부"],
    structure:["1. IP 소개 (원작 정보, 인기 데이터, 수상 이력)","2. 영상화 전략 (각색 방향, 원작자 참여)","3. 시놉시스 (극장판 기준)","4. 제작역량 (제작진, 기술력)","5. 예산계획","6. 시장분석 (국내·해외)"],
    tips:"KOMACON은 'IP 가치'를 정량적으로 증명하는 것이 핵심입니다. 조회수, 매출, 해외 랭킹 등 숫자로 보여주세요.",
    sampleDoc:{
      intent:`<환생검>은 2021년 네이버 웹툰 연재 시작 이래 누적 조회수 2억 3,000만 뷰, 댓글 180만 개, 평점 9.7점(10점 만점)을 기록한 무협 판타지 IP입니다. 일본 LINE망가 연재에서도 주간 랭킹 TOP 3를 17주 연속 유지하는 등 해외 검증이 완료되었습니다. 본 영상화 프로젝트는 원작의 방대한 세계관 중 '전편 영상화에 최적화된 기원의 장'(원작 1~48화)을 선별, 90분 극장판으로 재구성합니다.`,
      synopsis:`전설의 검 '운명검'의 파편을 삼킨 청년 무인 강하준은 서른다섯의 나이에 제자의 배신으로 절벽에서 생을 마감한다. 그러나 눈을 뜨니 열여섯의 자신, 사부의 첫 가르침을 받던 날로 돌아와 있다. 환생의 의미를 모르는 채 다시 시작하는 하준은, 이번 생에서 배신자를 찾아 그 이유를 묻기로 결심한다. 배신자는 왜 그를 죽였는가—진실은 그가 상상했던 것보다 훨씬 무겁다.`,
      capability:`IP브릿지는 웹툰 IP 기반 영상화 전문 프로덕션으로, <리턴드>(2023, 왓챠 오리지널 시리즈), <달의 기사>(2024, TVN 편성 확정) 등 3편의 영상화 실적을 보유합니다. 원작자 도연(필명)은 시나리오 각색에 직접 참여하며 '원작 훼손 최소화' 원칙을 제작 계약서에 명문화했습니다(계약서 별첨). 2D-3D 하이브리드 방식의 애니메이션 기술로 원작 특유의 필압(筆壓) 느낌을 영상에 구현할 예정입니다.`,
      market:`한국 무협 애니메이션은 글로벌 시장에서 미개척 장르로, <나 혼자만 레벨업>(2024, 크런치롤 전 세계 동시 방영)의 성공이 시장 가능성을 입증했습니다. <환생검>은 일본·동남아 팬덤이 이미 형성되어 있어, 극장판 공개 시 사전 마케팅 비용을 30% 절감할 수 있습니다. 국내 메가박스와 와이드 릴리즈 사전 협의 중이며, 크런치롤과 동시 스트리밍 협상을 진행하고 있습니다(의향서 별첨 3).`
    }},
  { id:5, title:"문체부 문화기술 R&D 합격 사례", year:2025, score:90, org:"문체부", cat:"R&D", dl:221,
    project:"AI 실시간 애니메이션 렌더링 엔진", company:"테크비전랩",
    summary:"생성형 AI를 활용해 애니메이션 제작 시간을 70% 단축하는 실시간 렌더링 엔진 개발 프로젝트.",
    keyPoints:["기존 파이프라인 대비 시간·비용 절감 효과를 정량 데이터로 제시","특허 출원 2건의 기술 우위를 논문 인용과 함께 설명","산학협력(KAIST) 연구진 구성으로 기술 신뢰성 확보","3년 로드맵(기초연구→프로토타입→상용화)을 단계별 제시","기존 고객사 3곳 LoI 첨부로 사업화 의지 증명"],
    structure:["1. 연구 개요 (배경, 목적, 필요성)","2. 기술개발 내용 (핵심 기술, 차별점)","3. 개발 로드맵 (단계별 목표, 마일스톤)","4. 연구진 구성 (책임연구자, 참여기관)","5. 사업화 전략 (시장규모, 타겟, 수익모델)","6. 예산계획 (연차별 상세)"],
    tips:"문체부 R&D는 '기술 우수성'과 '사업화 가능성'이 핵심입니다. LoI(관심표명서)나 MOU가 큰 가산점이 됩니다.",
    sampleDoc:{
      intent:`현재 국내 2D 애니메이션 스튜디오의 평균 렌더링 비용은 1분당 1,200만 원, 소요 시간은 72시간 이상입니다. 본 연구는 Diffusion Model 기반 AI가 기존 레이트레이싱 렌더링의 95% 품질을 1/10 시간에 구현하는 실시간 엔진을 개발합니다. 해당 기술은 소규모 독립 애니메이션 스튜디오가 대형 프로덕션에 버금가는 비주얼을 구현할 수 있게 함으로써 콘텐츠 산업의 구조적 불균형을 해소하는 데 기여합니다.`,
      synopsis:`[핵심 기술 개요] ① Latent Diffusion Rendering(LDR): 장면 의미 정보를 잠재 공간에 인코딩 후 실시간 디코딩, 렌더 시간 87% 절감. ② Temporal Consistency Module(TCM): 프레임 간 일관성을 유지해 '깜박임 현상' 제거. ③ Style-Adaptive Shader: 감독의 비주얼 레퍼런스를 학습해 자동 스타일 매핑. 2024년 국내 특허 출원 2건(제10-2024-XXXXX, 제10-2024-YYYYY), SIGGRAPH Asia 2024 논문 게재.`,
      capability:`책임연구자 이재현 박사(전산학, KAIST)는 컴퓨터 그래픽스 분야 SCI 논문 14편, h-index 18을 보유합니다. 산업 파트너 테크비전랩은 스튜디오 미르, 레드독컬쳐하우스 등 5개 제작사에 렌더링 솔루션을 납품 중입니다. 기업부설연구소(제2023-서울-XXXX호) 등록 완료. KAIST와 기술이전 전용 MOU를 체결하였으며, 연구인력 8인(박사 2, 석사 4, 학사 2) 구성 확정.`,
      market:`글로벌 미디어 렌더링 소프트웨어 시장 규모는 2026년 18.7억 달러 예상(Markets and Markets 2025). 국내 애니메이션 제작사 300개 중 자체 렌더팜 보유 업체는 12개(4%)에 불과해 SaaS 모델 수요가 높습니다. 1차 타겟: 국내 중소 애니메이션 스튜디오(월 구독 49만 원), 2차 타겟: 해외 인디 스튜디오. 스튜디오 미르, 아이코닉스, 손오공에서 LoI 수령 완료(별첨 4~6).`
    }},
  { id:6, title:"경기콘텐츠 기업성장 지원 합격 사례", year:2025, score:85, org:"경기콘텐츠", cat:"기업성장", dl:145,
    project:"XR 콘텐츠 제작 인프라 구축", company:"리얼리티웍스",
    summary:"경기도 판교 소재 XR 스튜디오의 제작 인프라 고도화 및 신규 인력 채용을 위한 성장 지원 프로젝트.",
    keyPoints:["신규 고용 15명을 직급별로 구체 제시","지역 대학(경기대, 한신대) 인턴십 연계 프로그램 계획","3년 매출 성장을 보수적·중간·낙관 3가지 시나리오로 제시","기존 납품 실적(삼성, LG)을 매출액과 함께 기술","경기도 콘텐츠 클러스터 활성화 기여도를 수치화"],
    structure:["1. 기업 소개 (연혁, 실적, 핵심역량)","2. 사업계획 (성장 전략, 투자 계획)","3. 고용 계획 (채용 규모, 직무, 일정)","4. 재무계획 (매출 전망, 수익성)","5. 지역 기여도 (산업 생태계 기여)"],
    tips:"지역 기관은 '지역 기여도'와 '고용 창출'이 20~30% 차지합니다. 구체적 숫자와 일정을 반드시 포함하세요.",
    sampleDoc:{
      intent:`리얼리티웍스는 2019년 설립 이래 삼성전자, LG유플러스, 현대자동차에 XR 트레이닝 콘텐츠를 납품, 2024년 매출 28억 원을 달성한 경기도 성남시 소재 기업입니다. 본 사업을 통해 LED 버추얼 프로덕션 스테이지(240㎡)를 구축하고, 콘텐츠 제작 역량을 산업용 B2B에서 방송·엔터테인먼트 B2C로 확장합니다. 이를 통해 2027년까지 매출 70억 원, 신규 고용 15명을 달성하고자 합니다.`,
      synopsis:`[투자 계획] ① LED 버추얼 스테이지 구축: 3.5억 원 (본 지원금 2.45억 + 자부담 1.05억). ② 리얼타임 렌더링 서버 증설: 1.2억 원. ③ 인력 채용 및 교육: 0.8억 원. 스테이지 완공 목표 2025년 10월, 첫 상업 가동 2025년 12월. 확보된 수주 잔고: KBS 드라마 버추얼 배경 제작 2억 원(2025.12 납품), tvN 예능 XR 세트 8,000만 원(2026.02 납품).`,
      capability:`대표이사 정수민(41)은 실감콘텐츠 분야 기업 운영 경력 12년. LED 버추얼 프로덕션 기술 도입은 국내 3번째 사례로, 자체 개발한 색온도 자동보정 알고리즘이 핵심 기술입니다(특허 제10-2025-AAAA). 기술 인력 현황: XR 개발 4명, 3D 아티스트 6명, 기술 감독 2명. 경기대학교 실감미디어학과와 산학협약을 통해 매년 인턴 4명을 채용, 정규직 전환율 75%.`,
      market:`국내 버추얼 프로덕션 시장은 2023년 380억 원에서 2027년 1,800억 원으로 성장 예상(한국VR산업협회). KBS·MBC·tvN의 '스튜디오 XR 외주 제작' 수요가 급증하고 있으며, 현재 국내 버추얼 프로덕션 전문 업체는 7개사에 불과합니다. [매출 시나리오] 보수적: 2027년 45억 원 / 중간: 60억 원 / 낙관: 78억 원. 경기도 내 하청·협력사 5개사와 연간 12억 원 규모의 협업을 유지하여 지역 생태계에 기여합니다.`
    }},
  { id:7, title:"KOFIC 장편 애니메이션 합격 사례", year:2024, score:92, org:"KOFIC", cat:"애니메이션", dl:378,
    project:"달빛 공방", company:"문라이트 애니메이션",
    summary:"조선시대 도자기 장인 소녀의 성장기를 그린 극장용 장편 애니메이션. 한국적 미학과 현대적 감성의 결합.",
    keyPoints:["파일럿 영상(3분) 첨부로 시각적 완성도 직접 증명","안시 국제 애니메이션 영화제 피칭 포럼 선정 실적 어필","한국 전통 색채 연구 자문(국립민속박물관) 계획","글로벌 배급사 2곳과 사전 MOU 첨부","예산서에 항목별 산출근거를 1페이지 분량으로 상세 기재"],
    structure:["1. 프로젝트 개요 (로그라인, 시놉시스, 톤)","2. 감독 비전 (연출의도, 비주얼 컨셉)","3. 제작역량 (팀 구성, 파일럿 영상, 기술)","4. 시장분석 (타겟, 벤치마크, 유통전략)","5. 제작계획 (WBS, 마일스톤)","6. 예산서 (산출근거 포함)","7. 기대효과"],
    tips:"KOFIC 극장 애니는 '파일럿 영상'이 당락을 좌우합니다. 30초~3분이라도 비주얼 완성도를 보여주는 것이 결정적입니다.",
    sampleDoc:{
      intent:`조선시대 도자기 속에는 단순한 기술이 아닌 철학이 담겨 있습니다. '달항아리'의 완벽하지 않은 원형은, 완벽을 강요받는 현대 청소년에게 '불완전함의 아름다움'을 이야기합니다. 본 작품은 <센과 치히로>가 일본 전통을 세계적 감성으로 번역했듯, 조선의 미의식(美意識)을 글로벌 관객과 공유하고자 합니다. 국립민속박물관 공예연구팀의 3개월 자문을 통해 시각적 고증의 정확성을 확보했습니다.`,
      synopsis:`18세기 조선, 열네 살 소녀 달이는 왕실 도자기 장인이었던 아버지의 가마터를 지키고 있다. 어느 날 가마에서 불꽃 정령 '화령'이 깨어나 달이와 계약을 맺는다. 왕실의 마지막 주문—'왕의 눈물을 담을 달항아리'—을 완성하면 화령은 자유를 얻는다. 달이는 흙을 빚는 과정에서 아버지가 남긴 비밀, 그리고 자신만의 선을 찾아간다. 총 상영 시간 95분.`,
      capability:`감독 한소미(37)는 <작은 새의 노래>(2019, 부천 애니메이션 영화제 대상), <오래된 집>(2022, 안시 피칭 포럼 선정)의 연출자입니다. 미술감독 박재원은 <클로버>(국제 공동제작, 2023) 시각 개발을 담당한 배경 전문가입니다. 현재 3분 분량의 파일럿 영상이 완성된 상태이며, 2024 안시 국제 애니메이션 영화제 '워크 인 프로그레스' 부문에 선정되었습니다(선정 통보서 별첨 1).`,
      market:`<스즈메의 문단속>(2023, 국내 358만 관객), <엘리멘탈>(2023, 국내 310만)이 보여주듯 극장 애니메이션 시장은 회복세입니다. 한국적 미감 소재 콘텐츠는 K-컬처 글로벌 팬덤과 결합해 해외 시장에서 높은 부가가치를 창출합니다. 메가박스와 300개관 이상 와이드 릴리즈 사전 협의 완료. 일본 배급사 Tohokushinsha Film과 MOU 체결, 프랑스 Gebeka Films와 유럽 배급 협상 진행 중(별첨 2, 3).`
    }},
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
    ext:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    calendar:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    person:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    phone:<svg style={p} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.39 2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16v.92z"/></svg>,
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
    background:primary?`linear-gradient(135deg,${T.accent},#059669)`:"transparent",
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
  const stColor = g.status==="접수중"?T.accent:g.status==="마감임박"?T.rose:g.status==="마감"?T.textDim:T.amber;
  const stBg = g.status==="접수중"?T.accentDim:g.status==="마감임박"?T.roseDim:g.status==="마감"?T.border:T.amberDim;
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      background:h?T.cardHover:T.card, border:`1px solid ${h?T.accent+"50":T.border}`, borderRadius:T.r,
      padding:"20px 22px", cursor:"pointer", transition:"all .22s",
      transform:h?"translateY(-2px)":"none", boxShadow:h?`0 8px 24px rgba(0,0,0,.09),0 2px 6px rgba(0,0,0,.04)`:`0 1px 3px rgba(0,0,0,.05)`,
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
  const statusColor = g.status==="접수중" ? {bg:T.accentDim,fg:T.accent}
    : g.status==="마감임박" ? {bg:T.amberDim,fg:T.amber}
    : g.status==="마감" ? {bg:T.border,fg:T.textDim}
    : {bg:T.roseDim,fg:T.rose};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",backdropFilter:"blur(10px)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="fu" style={{
        background:T.surface,borderRadius:T.rLg,border:`1px solid ${T.border}`,
        maxWidth:720,width:"100%",maxHeight:"88vh",overflow:"auto",padding:"26px 28px"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <OrgBadge org={g.org}/>
            <Badge bg={statusColor.bg} fg={statusColor.fg}>{g.status}</Badge>
            <Badge bg={T.bg} fg={T.textDim}>{g.cat}</Badge>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,padding:4,flexShrink:0}}>
            <Ico n="close" sz={22}/>
          </button>
        </div>

        <h2 style={{fontSize:20,fontWeight:800,marginBottom:8,lineHeight:1.4,color:T.text}}>{g.title}</h2>
        <p style={{color:T.textSec,lineHeight:1.75,marginBottom:18,fontSize:14}}>{g.desc}</p>

        {/* Key info grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
          {g.period && (
            <div style={{padding:"11px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.border}`,gridColumn:"1/-1"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                <Ico n="calendar" sz={12} c={T.textDim}/>
                <span style={{fontSize:11,color:T.textDim,fontWeight:600,letterSpacing:.5}}>접수 기간</span>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:T.mono}}>{g.period}</div>
            </div>
          )}
          {g.budgetDetail && (
            <div style={{padding:"11px 14px",background:T.accentDim,borderRadius:T.rSm,border:`1px solid rgba(0,149,109,0.18)`,gridColumn:"1/-1"}}>
              <div style={{fontSize:11,color:T.accent,fontWeight:600,letterSpacing:.5,marginBottom:3}}>지원 금액</div>
              <div style={{fontSize:13,fontWeight:700,color:T.accent,lineHeight:1.5}}>{g.budgetDetail}</div>
            </div>
          )}
          {g.eligibility && (
            <div style={{padding:"11px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.border}`,gridColumn:"1/-1"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                <Ico n="person" sz={12} c={T.textDim}/>
                <span style={{fontSize:11,color:T.textDim,fontWeight:600,letterSpacing:.5}}>지원 자격</span>
              </div>
              <div style={{fontSize:13,color:T.textSec,lineHeight:1.6}}>{g.eligibility}</div>
            </div>
          )}
          {g.contact && (
            <div style={{padding:"11px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.border}`,gridColumn:"1/-1"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                <Ico n="phone" sz={12} c={T.textDim}/>
                <span style={{fontSize:11,color:T.textDim,fontWeight:600,letterSpacing:.5}}>문의처</span>
              </div>
              <div style={{fontSize:13,color:T.textSec}}>{g.contact}</div>
            </div>
          )}
        </div>

        {/* External links row */}
        {g.url && (
          <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap"}}>
            <a href={g.url} target="_blank" rel="noopener noreferrer" style={{
              display:"inline-flex",alignItems:"center",gap:6,padding:"9px 16px",
              background:T.blue,color:"#fff",borderRadius:T.rSm,fontSize:13,fontWeight:650,
              textDecoration:"none",flexShrink:0}}>
              <Ico n="ext" sz={14} c="#fff"/> 공고 페이지
            </a>
            {g.guideUrl && (
              <a href={g.guideUrl} target="_blank" rel="noopener noreferrer" style={{
                display:"inline-flex",alignItems:"center",gap:6,padding:"9px 16px",
                background:T.accentDim,color:T.accent,border:`1px solid rgba(0,149,109,0.25)`,
                borderRadius:T.rSm,fontSize:13,fontWeight:650,textDecoration:"none",flexShrink:0}}>
                <Ico n="dl" sz={14} c={T.accent}/> 모집요강 다운로드
              </a>
            )}
          </div>
        )}

        {/* Required docs */}
        <div style={{marginBottom:22}}>
          <h4 style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:10,letterSpacing:1,textTransform:"uppercase"}}>제출 서류</h4>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {g.reqs?.map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",
                background:T.bg,borderRadius:T.rSm,fontSize:13,border:`1px solid ${T.border}`,color:T.textSec}}>
                <Ico n="chk" sz={14} c={T.accent}/> {r}
              </div>
            ))}
          </div>
        </div>

        {/* Eval criteria */}
        {g.eval && (
          <div style={{marginBottom:24}}>
            <h4 style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:10,letterSpacing:1,textTransform:"uppercase"}}>평가 기준</h4>
            {g.eval.map((e,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                  <span style={{fontWeight:650,color:T.text}}>{e.name}</span>
                  <span style={{color:T.accent,fontFamily:T.mono,fontWeight:700}}>{e.w}%</span>
                </div>
                <div style={{height:5,background:T.bg,borderRadius:3,overflow:"hidden",border:`1px solid ${T.border}`}}>
                  <div style={{width:`${e.w*2.5}%`,height:"100%",borderRadius:3,
                    background:`linear-gradient(90deg,${T.accent},${T.blue})`,transition:"width .7s ease"}}/>
                </div>
                {e.d && <p style={{fontSize:11,color:T.textDim,marginTop:3}}>{e.d}</p>}
              </div>
            ))}
          </div>
        )}

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
  const [sampleTab,setSampleTab] = React.useState("intent");
  const sampleTabs = [{k:"intent",l:"기획의도"},{k:"synopsis",l:"시놉시스"},{k:"capability",l:"제작역량"},{k:"market",l:"시장분석"}];
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

        {/* Sample Doc Section */}
        {t.sampleDoc && <div style={{marginBottom:22}}>
          <h4 style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:10,letterSpacing:.5}}>샘플 지원서 발췌</h4>
          {/* Tab Bar */}
          <div style={{display:"flex",gap:4,marginBottom:0,borderBottom:`2px solid ${T.border}`}}>
            {sampleTabs.map(tb=>(
              <button key={tb.k} onClick={()=>setSampleTab(tb.k)} style={{
                padding:"7px 14px",fontSize:12,fontWeight:sampleTab===tb.k?700:500,
                border:"none",background:"none",cursor:"pointer",
                color:sampleTab===tb.k?T.accent:T.textDim,
                borderBottom:sampleTab===tb.k?`2px solid ${T.accent}`:"2px solid transparent",
                marginBottom:-2,transition:"all .15s",borderRadius:"4px 4px 0 0"}}>
                {tb.l}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div style={{padding:"16px",background:T.bg,borderRadius:`0 0 ${T.rSm} ${T.rSm}`,
            border:`1px solid ${T.border}`,borderTop:"none",minHeight:120}}>
            <p style={{fontSize:13,color:T.textSec,lineHeight:1.85,whiteSpace:"pre-wrap",margin:0}}>
              {t.sampleDoc[sampleTab]}
            </p>
          </div>
          <div style={{fontSize:11,color:T.textDim,marginTop:6,paddingLeft:2}}>
            ※ 본 내용은 합격 사례를 바탕으로 재구성한 참고용 발췌문입니다.
          </div>
        </div>}

        {/* Download Button */}
        <Btn primary onClick={()=>{
          const sd = t.sampleDoc||{};
          const lines = [
            `═══════════════════════════════════════`,
            `  ${t.title}`,
            `═══════════════════════════════════════`,
            ``,
            `프로젝트: ${t.project||""}`,
            `제작사: ${t.company||""}`,
            `연도: ${t.year}년`,
            `평가 점수: ${t.score}/100`,
            `기관: ${ORG_COLORS[t.org]?.label||t.org}`,
            `분야: ${t.cat}`,
            ``,
            `───────────────────────────────────────`,
            `프로젝트 개요`,
            `───────────────────────────────────────`,
            t.summary||"",
            ``,
            `───────────────────────────────────────`,
            `합격 핵심 포인트`,
            `───────────────────────────────────────`,
            ...(t.keyPoints||[]).map((p,i)=>`  ${i+1}. ${p}`),
            ``,
            `───────────────────────────────────────`,
            `지원서 구성`,
            `───────────────────────────────────────`,
            ...(t.structure||[]).map(s=>`  v ${s}`),
            ``,
            `───────────────────────────────────────`,
            `전문가 팁`,
            `───────────────────────────────────────`,
            t.tips||"",
            ``,
            ...(t.sampleDoc?[
              `───────────────────────────────────────`,
              `[샘플 지원서 발췌]`,
              `───────────────────────────────────────`,
              ``,
              `< 기획의도 >`,
              sd.intent||"",
              ``,
              `< 시놉시스 >`,
              sd.synopsis||"",
              ``,
              `< 제작역량 >`,
              sd.capability||"",
              ``,
              `< 시장분석 >`,
              sd.market||"",
              ``,
            ]:[]),
            `═══════════════════════════════════════`,
            `Hello Grants - 합격 사례 레퍼런스`,
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

  const doGen = async () => {
    // ── 세션 캐시 확인 (동일 입력 재요청 방지) ──
    const cacheKey = `hg_${grant?.id}_${btoa(encodeURIComponent(JSON.stringify(fd))).slice(0,32)}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) { setResult(cached); return; }

    setGen(true); setStream("");
    const orgLabel = ORG_COLORS[grant?.org]?.label || grant?.org || "기관";

    // ── 입력된 항목만 포함 (불필요한 토큰 절감) ──
    const parts = [
      `공고: ${grant?.title || "지원사업"} (${orgLabel})`,
      `분야: ${grant?.cat || ""}`,
      fd.company   && `제작사: ${fd.company}`,
      fd.director  && `감독: ${fd.director}`,
      fd.project   && `프로젝트명: ${fd.project}`,
      fd.genre     && `장르: ${fd.genre}`,
      fd.synopsis  && `시놉시스: ${fd.synopsis}`,
      fd.target    && `타겟: ${fd.target}`,
      fd.budget    && `예산: ${fd.budget}`,
      fd.timeline  && `일정: ${fd.timeline}`,
    ].filter(Boolean).join("\n");

    try {
      const resp = await fetch("http://localhost:3001/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: parts }),
      });

      if (!resp.ok) throw new Error(`서버 오류 ${resp.status}`);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { setResult(full); setGen(false); sessionStorage.setItem(cacheKey, full); break; }
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) { full += parsed.text; setStream(full); }
          } catch {}
        }
      }
    } catch (err) {
      const msg = err.message.includes("fetch")
        ? "서버에 연결할 수 없습니다. `npm run dev`로 서버가 실행 중인지 확인하세요."
        : err.message;
      setStream(`## 오류\n\n${msg}`);
      setGen(false);
    }
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
      cursor:"pointer",transition:"all .22s",transform:h?"translateY(-1px)":"none",
      boxShadow:h?`0 6px 18px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04)`:`0 1px 3px rgba(0,0,0,.05)`}}>
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
    {label:"모집 중 공고",val:`${ALL_GRANTS.filter(g=>g.status==="접수중"||g.status==="마감임박").length}건`,icon:"doc",c:T.accent},
    {label:"지원 기관",val:"7개",icon:"building",c:T.blue},
    {label:"합격 템플릿",val:`${TEMPLATES.length}개`,icon:"trophy",c:T.amber},
    {label:"평균 매칭",val:Math.round(ALL_GRANTS.reduce((a,g)=>a+g.match,0)/ALL_GRANTS.length)+"%",icon:"chart",c:T.violet},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}}>
      {items.map((s,i)=>(
        <div key={i} className={`fu s${i+1}`} style={{background:T.card,
          border:`1px solid ${T.border}`,borderRadius:T.r,padding:"16px 10px",textAlign:"center",
          boxShadow:`0 1px 4px rgba(0,0,0,.05)`}}>
          <div style={{marginBottom:6,opacity:.8}}><Ico n={s.icon} sz={22} c={s.c}/></div>
          <div style={{fontSize:20,fontWeight:800,fontFamily:T.mono,color:s.c}}>{s.val}</div>
          <div style={{fontSize:11,color:T.textDim,marginTop:2}}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Grant Calendar ───
function GrantCalendar({onGrantClick}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const DOWS = ["일","월","화","수","목","금","토"];

  const grantEvents = useMemo(() => ALL_GRANTS.map(g => {
    const m = g.period?.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
    const startDate = m ? new Date(m[1]) : new Date(g.deadline);
    const endDate   = m ? new Date(m[2]) : new Date(g.deadline);
    const deadlineDate = new Date(g.deadline);
    const oc = ORG_COLORS[g.org] || {fg:T.accent, bg:T.accentDim};
    return {...g, startDate, endDate, deadlineDate, color:oc.fg, colorBg:oc.bg};
  }), []);

  const calDays = useMemo(() => {
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev  = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = firstDow - 1; i >= 0; i--)
      days.push({date: new Date(year, month - 1, daysInPrev - i), curr: false});
    for (let i = 1; i <= daysInMonth; i++)
      days.push({date: new Date(year, month, i), curr: true});
    let nx = 1;
    while (days.length < 42)
      days.push({date: new Date(year, month + 1, nx++), curr: false});
    return days;
  }, [year, month]);

  const monthGrants = useMemo(() => {
    const ms = new Date(year, month, 1);
    const me = new Date(year, month + 1, 0);
    return grantEvents
      .filter(g => g.endDate >= ms && g.startDate <= me)
      .sort((a,b) => a.deadlineDate - b.deadlineDate);
  }, [grantEvents, year, month]);

  const isSameDay = (a,b) =>
    a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

  const navBtn = {background:T.bg,border:`1px solid ${T.border}`,borderRadius:T.rSm,
    padding:"5px 9px",cursor:"pointer",color:T.textSec,display:"flex",alignItems:"center"};

  return (
    <div className="fu">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h2 style={{fontSize:18,fontWeight:800,display:"flex",alignItems:"center",gap:8}}>
          <Ico n="calendar" sz={20} c={T.accent}/> 공고 일정
        </h2>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={()=>setViewDate(new Date(today.getFullYear(),today.getMonth(),1))}
            style={{...navBtn,fontSize:11,fontWeight:650,padding:"5px 11px",color:T.textSec}}>오늘</button>
          <button onClick={()=>setViewDate(new Date(year,month-1,1))} style={navBtn}><Ico n="back" sz={15}/></button>
          <span style={{fontSize:14,fontWeight:700,minWidth:72,textAlign:"center"}}>
            {year}년 {MONTHS[month]}
          </span>
          <button onClick={()=>setViewDate(new Date(year,month+1,1))} style={navBtn}><Ico n="arrow" sz={15}/></button>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.r,overflow:"hidden",marginBottom:20}}>
        {/* Day-of-week header */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:T.bg,borderBottom:`1px solid ${T.border}`}}>
          {DOWS.map((d,i)=>(
            <div key={d} style={{textAlign:"center",padding:"8px 2px",fontSize:11,fontWeight:700,
              color:i===0?T.rose:i===6?T.blue:T.textDim}}>{d}</div>
          ))}
        </div>
        {/* Day cells */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
          {calDays.map(({date,curr},idx)=>{
            const isToday = isSameDay(date,today);
            const dow = date.getDay();
            const dayGrants = monthGrants.filter(g => date>=g.startDate && date<=g.endDate);
            return (
              <div key={idx} style={{
                minHeight:86,padding:"4px 2px",
                borderRight: idx%7!==6?`1px solid ${T.border}`:"none",
                borderBottom: idx<35?`1px solid ${T.border}`:"none",
                background: isToday?T.accentDim:T.surface,
                opacity: curr?1:0.38,
              }}>
                {/* Day number */}
                <div style={{
                  width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:11,fontWeight:isToday?800:400,marginBottom:3,
                  background:isToday?T.accent:"transparent",
                  color:isToday?T.bg:dow===0?T.rose:dow===6?T.blue:T.text,
                }}>{date.getDate()}</div>
                {/* Event bars */}
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  {dayGrants.slice(0,3).map(g=>{
                    const dl = isSameDay(date,g.deadlineDate);
                    const isFirst = isSameDay(date,g.startDate) || dow===0 || date.getDate()===1;
                    return (
                      <div key={g.id} onClick={e=>{e.stopPropagation();onGrantClick(g);}}
                        title={g.title} style={{
                          height:15,cursor:"pointer",overflow:"hidden",
                          borderRadius: dl?"3px":"0",
                          background: dl?g.color:`${g.color}25`,
                          borderLeft: dl?"none":`2.5px solid ${g.color}`,
                          display:"flex",alignItems:"center",paddingLeft:3,
                        }}>
                        {(isFirst||dl) && (
                          <span style={{fontSize:8.5,fontWeight:700,
                            color:dl?"#fff":g.color,
                            whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:52}}>
                            {dl?"마감":ORG_COLORS[g.org]?.label||g.org}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {dayGrants.length>3&&<div style={{fontSize:8,color:T.textDim,paddingLeft:2}}>+{dayGrants.length-3}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grant list for the month */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <h3 style={{fontSize:13,fontWeight:700,color:T.text}}>{MONTHS[month]} 공고 목록</h3>
        <span style={{fontSize:11,color:T.textDim,fontFamily:T.mono}}>{monthGrants.length}건</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {monthGrants.map(g=>{
          const daysLeft = Math.ceil((g.deadlineDate - today)/(1000*60*60*24));
          const dc = daysLeft<=0?T.rose:daysLeft<=14?T.amber:T.textSec;
          return (
            <div key={g.id} onClick={()=>onGrantClick(g)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"11px 14px",
              background:T.surface,border:`1px solid ${T.border}`,
              borderLeft:`4px solid ${g.color}`,borderRadius:`0 ${T.rSm} ${T.rSm} 0`,
              cursor:"pointer",transition:"background .15s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background=T.surfaceHover}
            onMouseLeave={e=>e.currentTarget.style.background=T.surface}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:T.text,overflow:"hidden",
                  textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{g.title}</div>
                <div style={{fontSize:11,color:T.textDim}}>{g.period}</div>
              </div>
              <Badge bg={g.colorBg} fg={g.color}>{ORG_COLORS[g.org]?.label||g.org}</Badge>
              <div style={{textAlign:"right",flexShrink:0,minWidth:52}}>
                <div style={{fontSize:12,fontWeight:800,fontFamily:T.mono,color:dc}}>
                  {daysLeft<0?"마감":daysLeft===0?"D-Day":`D-${daysLeft}`}
                </div>
                <div style={{fontSize:10,color:T.textDim}}>{g.deadline}</div>
              </div>
            </div>
          );
        })}
        {monthGrants.length===0&&(
          <div style={{textAlign:"center",padding:36,color:T.textDim,fontSize:13}}>이달 공고가 없습니다.</div>
        )}
      </div>
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
    {k:"schedule",l:"공고 일정",i:"calendar"},
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
          borderBottom:`1px solid ${T.border}`,
          position:"sticky",top:0,zIndex:100,backdropFilter:"blur(16px)",
        }}>
          <div style={{maxWidth:900,margin:"0 auto",padding:"14px 16px",
            display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:10,
                background:`linear-gradient(135deg,${T.accent},#059669)`,
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:`0 2px 12px ${T.accentGlow}`}}>
                <Ico n="spark" sz={18} c={T.bg}/>
              </div>
              <div>
                <h1 style={{fontSize:16,fontWeight:800,letterSpacing:"-0.3px",lineHeight:1.2}}>
                  Hello <span style={{color:T.accent}}>Grants</span>
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
              {ALL_GRANTS.filter(g=>g.status!=="공고예정"&&g.status!=="마감").sort((a,b)=>new Date(a.deadline)-new Date(b.deadline)).slice(0,3).map(g=>(
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

          {/* ── SCHEDULE ── */}
          {tab==="schedule"&&<GrantCalendar onGrantClick={g=>setSelGrant(g)}/>}

          {/* ── WRITER ── */}
          {tab==="writer"&&(wrGrant?<AIWriter grant={wrGrant} onBack={()=>setWrGrant(null)}/>:
            <div className="fu">
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
                <Ico n="ai" sz={20} c={T.accent}/> AI 지원서 작성
              </h2>
              <p style={{fontSize:12.5,color:T.textDim,marginBottom:16}}>지원할 공고를 선택하면 기관별 맞춤 지원서를 AI가 작성합니다.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {ALL_GRANTS.filter(g=>g.status!=="공고예정"&&g.status!=="마감").sort((a,b)=>b.match-a.match).map(g=>(
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

        {/* ── Footer ── */}
        <footer style={{borderTop:`1px solid ${T.border}`,background:T.surface}}>
          <div style={{
            maxWidth:900, margin:"0 auto", padding:"20px 16px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            flexWrap:"wrap", gap:12,
          }}>
            <img src="/logo-dark.png" alt="Studio Room" style={{height:22,opacity:0.75}}/>
            <div style={{fontSize:11,color:T.textDim,textAlign:"right",lineHeight:1.6}}>
              <span style={{fontWeight:600,color:T.textSec}}>Hello Grants</span>
              {" "}is made by Studio Room
              <br/>
              <span style={{letterSpacing:"0.02em"}}>&copy; {new Date().getFullYear()} Studio Room. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
