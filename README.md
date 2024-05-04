# ✨Dev.cartes! backend Page (임시 페이지)

## 🪄 API 수정 사항

자세한 내용은 [API 문서](https://docs.google.com/spreadsheets/d/1xZFiT2gpMSSY5c2hOz8VhJL_gC7Prh9ZJ5Q6wfp4Itk/edit?usp=sharing)를 참고해 주세요.

- 2024년 5월 3일
  **- !BREAKING CHANGE : PATH, BODY, RESPONSE 대규모 수정**
  - 2024년 5월 3일 오피스 아워 이후 PATH 경로의 대대적인 수정이 필요해서 불가피하게 바뀐 부분이 많습니다.
  - 코치님께서 PATH 경로에 id가 없는게 좋다고 하셔서 id를 삭제했습니다.
  - PATH 뒤에 있는 동사명을 삭제했습니다.
  - 이제 서버에 FETCH 요청을 하실 때 주소에 id를 적었던 부분은 body안에 넣어서 보내주셔야 합니다. (API 문서 참고)

**- 변경된 부분이 많아서 오류가 나는 경우에는, 언제든지 디스코드 백엔드 채널에 문의 남겨 주세요.**

## 🌱 Branch

- Backend
  - back_auth
    - 회원가입
    - 로그인
    - 로그아웃
    - 로그인 상태 확인
  - back_users
    - 사용자 목록 (네트워크 페이지)
    - 사용자 정보 조회 (개인 페이지)
    - 본인 확인 (개인 페이지)
    - 사용자 정보 수정 (개인 페이지)
  - back_education
    - 학력 추가
    - 학력 정보 조회
    - 학력 정보 수정
    - 학력 정보 삭제

## 🔧 개발 중

- 🔑 회원가입, 로그인 (채명희)
- 🧸 User MVP (이유민)
- 🎓 Education MVP (박수정)

## 🎯️ 미구현 기능

- 🏆 Award MVP
- 🗂️ Project MVP
- ️🪪 Certificate MVP

## ✏️ 개발 완료

## 참고 사항

nanoid 최신 버전은 CommonJS를 지원해 주지 않기 때문에, 에러가 발생할 경우 구버전을 설치해 주세요.

```sh
npm uninstall nanoid
npm install nanoid@^3.0.0
```
