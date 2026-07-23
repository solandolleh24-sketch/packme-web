# packme-web
A mobile-first static web app that turns your personality, habits, and favorite items into a shareable starter pack poster.

## PACKME 2026 — 2026 스타터팩 포스터

직업·현재 상태·취향을 4단계로 조합해 9:16 "블리스터 패키지" 스타일 포스터를 만들고 저장·공유하는 순수 정적 웹앱입니다.
회원가입, 서버, 빌드 과정이 없습니다 — 모든 로직은 브라우저에서 바닐라 JS로 동작합니다.

### 페이지 구성
- `index.html` — 홈
- `sample.html` — 샘플 포스터 안내
- `create.html` — 4단계 선택 위저드 (아키타입 → 현재 상태 → 구성품 3개 → 결과 톤), 실시간 캔버스 미리보기
- `result.html` — 완성 포스터: PNG 저장, 공유 링크/QR 생성, 문구 다시 뽑기
- `shared.html` — 공유받은 포스터 보기, 가벼운 반응(인정/반박/더 심함), 자기 버전 만들기
- `privacy.html` — 데이터 처리 안내

### 데이터 처리
- 선택값은 `localStorage`에만 저장되고, 공유는 URL 쿼리 파라미터(`?d=`)에 base64url로 인코딩된 값으로만 이루어집니다.
- 포스터 이미지는 `<canvas>`로 렌더링되어 기기에 직접 다운로드되며, 서버에는 아무것도 전송되지 않습니다.
- QR 코드는 `assets/js/qrcode.js`에 벤더링된 오프라인 QR 인코더로 브라우저 내에서 생성됩니다.

### 로컬에서 실행
정적 파일이므로 아무 정적 서버로 열면 됩니다.

```sh
python3 -m http.server 8080
# http://localhost:8080 접속
```
