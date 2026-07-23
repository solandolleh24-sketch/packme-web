/* PACKME 2026 — content data
   Extracted from the PRD / wireframe: archetypes, states, components, tones. */

window.PACKME_DATA = {
  archetypes: [
    { id: "worker",    emoji: "💼", name: "직장인",         tagline: "오늘도 살아남는 중" },
    { id: "jobseeker", emoji: "🎓", name: "취준생",         tagline: "합격만이 답이다" },
    { id: "dev",       emoji: "🧑‍💻", name: "개발자",       tagline: "커밋으로 말한다" },
    { id: "creator",   emoji: "🎨", name: "크리에이터",     tagline: "콘텐츠가 곧 나다" },
    { id: "student",   emoji: "📚", name: "학생",           tagline: "공부는 내일부터" },
    { id: "freelancer",emoji: "☕", name: "프리랜서",       tagline: "자유롭지만 불안정" },
    { id: "homebody",  emoji: "🏠", name: "집순이·집돌이", tagline: "집이 최고야" },
    { id: "traveler",  emoji: "🌍", name: "여행러",         tagline: "어디든 떠날 준비" },
    { id: "gymrat",    emoji: "💪", name: "헬스인",         tagline: "오늘 3대 얼마야?" }
  ],

  states: [
    { id: "atwork",   emoji: "🏢", name: "회사 중",       tagline: "오늘도 살아남는 중" },
    { id: "afterwork",emoji: "🌆", name: "퇴근 후",       tagline: "몸은 나왔지만 정신은 아직" },
    { id: "wfh",      emoji: "🏠", name: "재택 근무",     tagline: "집이 사무실, 사무실이 집" },
    { id: "weekend",  emoji: "☀️", name: "주말",          tagline: "완전한 자유, 근데 할 게 없음" },
    { id: "burnout",  emoji: "🕳️", name: "번아웃 진행 중", tagline: "이번 생은 여기까지인가" },
    { id: "jobhunt",  emoji: "📋", name: "취준 중",       tagline: "서류는 넣었고 연락은 없음" }
  ],

  tastes: [
    { id: "homecafe", emoji: "☕", name: "홈카페" },
    { id: "gaming",   emoji: "🎮", name: "게임" },
    { id: "reading",  emoji: "📚", name: "독서" },
    { id: "music",    emoji: "🎵", name: "음악 감상" },
    { id: "foodie",   emoji: "🍜", name: "맛집 탐방" },
    { id: "yoga",     emoji: "🧘", name: "요가·명상" },
    { id: "craft",    emoji: "🎨", name: "그림·만들기" },
    { id: "pet",      emoji: "🐾", name: "반려동물" }
  ],

  belongings: [
    { id: "airpods", emoji: "🎧", name: "에어팟" },
    { id: "laptop",  emoji: "💻", name: "노트북" },
    { id: "diary",   emoji: "📓", name: "다이어리" },
    { id: "cream",   emoji: "🧴", name: "핸드크림" },
    { id: "vitamin", emoji: "💊", name: "영양제" },
    { id: "cardcase",emoji: "🔑", name: "카드지갑" },
    { id: "camera",  emoji: "📷", name: "필름카메라" },
    { id: "tumbler", emoji: "🧃", name: "텀블러" }
  ],

  habits: [
    { id: "lateNight", emoji: "🌙", name: "늦게 잠" },
    { id: "youtube",   emoji: "📱", name: "유튜브 정주행" },
    { id: "dawnshop",  emoji: "🛒", name: "새벽 장보기" },
    { id: "gym",       emoji: "🏋️", name: "헬스" },
    { id: "plants",    emoji: "🌿", name: "식물 키우기" },
    { id: "journaling",emoji: "📝", name: "일기 쓰기" },
    { id: "singing",   emoji: "🎤", name: "노래 부르기" },
    { id: "blanking",  emoji: "☁️", name: "멍때리기" }
  ],

  tones: [
    { id: "positive",    name: "긍정적",   desc: "나름 잘 살고 있음. 밝고 따뜻한 컬러, 응원하는 문구." },
    { id: "selfmock",    name: "자조적",   desc: "현실 직시형. 무채색 계열, 뼈 때리는 한 줄." },
    { id: "exaggerated", name: "과장",     desc: "나 이 정도야. 형광 컬러, 드라마틱한 문구." },
    { id: "relaxed",     name: "여유로움", desc: "속도 조절 중. 파스텔 톤, 느긋한 감성 문구." },
    { id: "chaos",       name: "혼돈",     desc: "뭔가 많이 일어나고 있음. 강렬한 대비색, 카오스 문구." }
  ],

  reactions: [
    { id: "agree",   label: "인정" },
    { id: "dispute", label: "반박" },
    { id: "worse",   label: "더 심함" }
  ],

  captionTemplates: {
    positive: [
      "{archetype} 모드, {state}에도 웃는 중 ✨",
      "{taste}랑 {belonging}만 있으면 오늘도 완주 가능",
      "{habit}까지 챙기는 걸 보니 나 좀 잘 살고 있다"
    ],
    selfmock: [
      "{state}인데 {habit} 하는 중… 이게 접니다",
      "{archetype}인데 {belonging} 없으면 하루도 못 버팀",
      "{taste}로 도망치는 중, {state} 현실은 안 보임"
    ],
    exaggerated: [
      "{archetype}?! 이 정도면 전설이지",
      "{taste} × {belonging} × {habit} = 이번 생 최강 조합",
      "{state}조차 지배하는 자, 그것이 바로 나"
    ],
    relaxed: [
      "{state}엔 역시 {taste}, 급할 거 없잖아",
      "{belonging} 하나 들고 {habit}, 그거면 충분해",
      "{archetype}지만 오늘만큼은 여유롭게"
    ],
    chaos: [
      "{state} + {habit} + {taste}, 대체 무슨 일이 일어나는 거지",
      "{archetype}의 하루: {belonging} 들고 좌충우돌",
      "정리는 포기, {habit}로 오늘도 혼돈 속으로"
    ]
  }
};
