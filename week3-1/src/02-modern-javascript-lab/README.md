# 02 modern javascript lab

Node/npm/package.json 기반의 모던 JavaScript 실습 예제다.

## 목적

- `package.json`을 읽으며 팀 실행 규약을 설명한다.
- `npm install`, `npm run dev`, `npm run build` 순서를 실제로 시연한다.
- 브라우저 전역 함수 대신 ES module import 구조를 보여준다.

## 실행 순서

1. `node -v`
2. `npm -v`
3. `npm install`
4. `npm run dev`
5. `npm run build`

## package.json에서 볼 포인트

- `scripts.dev`: 개발 서버 실행
- `scripts.build`: 배포용 번들 생성
- `scripts.preview`: 빌드 결과 확인
- `devDependencies.vite`: 개발 도구 의존성 예시

## 자주 나는 오류 체크

- Node 버전이 너무 낮아 Vite가 실행되지 않는 경우
- 사내 네트워크 또는 프록시로 `npm install`이 실패하는 경우
- `package.json`의 script 이름 오타로 `npm run ...`이 실패하는 경우
