# week3-1 src 안내

week3-1은 Vue 문법보다 먼저 모던 JavaScript 실행 환경을 이해시키는 회차다.

## 구성

- `01-legacy-script-demo`: 브라우저에 script 태그를 직접 연결하는 전통 방식 예제
- `02-modern-javascript-lab`: Node/npm/package.json/Vite를 사용하는 모던 방식 예제

## 권장 시연 순서

1. `01-legacy-script-demo/index.html`을 열어 전통 방식의 파일 순서 의존성과 전역 함수 구조를 설명한다.
2. `02-modern-javascript-lab/package.json`을 열어 scripts, devDependencies, 프로젝트 실행 규약을 읽는다.
3. `02-modern-javascript-lab/README.md` 기준으로 `npm install`, `npm run dev`, `npm run build` 흐름을 시연한다.
4. 마지막에 2회차 Vue 소스인 `../../week3-2/src/week3-vue-skeleton`으로 연결해 "환경 위에 프레임워크가 올라간다"는 메시지를 정리한다.

## 슬라이드 캡처 포인트

- script 태그 비교 화면: `01-legacy-script-demo/index.html`
- package.json 설명 화면: `02-modern-javascript-lab/package.json`
- 모듈 import와 상태 렌더링 화면: `02-modern-javascript-lab/src/main.js`
