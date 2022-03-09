# JSQuizzz (JSQuiz + zzz)

JSQuizzz는 자바스크립트의 핵심문제를 풀고 틀린 문제를 복습할 수 있는 서비스입니다.<br />
사용자는 랜덤으로 주어지는 문제를 시간안에 최대한 풀어야하며,<br />
연속 정답 콤보를 통해 빠르게 점수를 올릴 수도 있습니다.<br />
익명참여로 문제를 잘 못풀더라도 쉽게 도전할 수 있습니다. <br />
익명의 사용자 데이터들은 chart.js로 표현되며 이를 이용하여 문제 난이도 조절을 고려할 수 있습니다.<br />
또한, 명예의전당에는 상위점수 100명이 공개되어 사용자 간 동기부여가 됩니다.<br />
퀴즈를 통한 자바스크립트 배우기! jsQuizzz 입니다.

## 팀 구성원

| **강지승**                                                                                                                                                             | **김유선**                                                                                                                                                      | **임준홍**                                                                                                                                                            | **정우진**                                                                                                                                                         | **조아라**                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <img src="https://avatars.githubusercontent.com/u/58802599?v=4" alt="@jiseung-kang" size="80" height="80" width="80" data-view-component="true" class="avatar circle"> | <img src="https://avatars.githubusercontent.com/u/74897720?v=4" alt="@useon" size="80" height="80" width="80" data-view-component="true" class="avatar circle"> | <img src="https://avatars.githubusercontent.com/u/67459853?v=4" alt="@tesseractjh" size="80" height="80" width="80" data-view-component="true" class="avatar circle"> | <img src="https://avatars.githubusercontent.com/u/66201264?v=4" alt="@woobba94" size="80" height="80" width="80" data-view-component="true" class="avatar circle"> | <img src="https://avatars.githubusercontent.com/u/66999861?v=4" alt="@choar816" size="80" height="80" width="80" data-view-component="true" class="avatar circle"> |
| [Github](https://github.com/jiseung-kang)                                                                                                                              | [Github](https://github.com/useon)                                                                                                                              | [Github](https://github.com/tesseractjh)                                                                                                                              | [Github](https://github.com/woobba94)                                                                                                                              | [Github](https://github.com/choar816)                                                                                                                              |

## 1. 목표

- 자바스크립트를 연습하기 위한 재미있는 사이트 구축

## 2. 개발 환경 및 배포

### 2.1 사용기술

- HTML
- CSS
- JavaScript
- firebase
- chart.js

### 2.2 배포

- netlify를 통한 배포
- url : [js-quiz](https://jsquizzz.netlify.app/)

## 3. 프로젝트 구조와 개발 일정

### 3.1 프로젝트 구조

```
.
├── .gitignore
├── index.html
├── README.md
│
├── css
│   ├── reset.css
│   ├── style.css
│   └── visible&invisivle.css
│
├── data
│   ├── data.json
│   └── sampledata.json
│
├── dist
│   ├──  answer.js
│   ├──  constants.js
│   ├──  menual.js
│   ├──  question.js
│   ├──  result.js
│   ├──  test-work.js
│   ├──  timer.js
│   └──  util-func.js
│
├── fonts
│   └── ….ttf
│
├── images
│   ├── favicon_js.ico
│   ├── favicon.ico
│   └── intro-img.PNG
│
├── js
│   ├── answer.js
│   ├── constants.js
│   ├── menual.js
│   ├── question.js
│   ├── result.js
│   ├── test-work.js
│   ├── timer.js
│   └── util-func.js
│
└── page
    ├── result.html
    └── test.html
```

### 3.2 개발일정

기간 : 18일 - 2021.12.09(목) ~ 2021.12.27(월)

- 기본 기능 구현 1주 - 2021.12.09(목) ~ 2021.12.16(목)
- 기능 개선, 디자인 개선, 오류수정 - 2021.12.17(금) ~ 2021.12.27(월)

## 4. 역할 분담

#### 강지승

-

#### 김유선

-

#### 임준홍

- 문제 생성 함수 구현
- 정답 확인 함수 구현

#### 정우진

- test.html 페이지 구현
- 콤보기능
- 점수산출 로직..

#### 조아라

-

## 5. UI

<img src="https://user-images.githubusercontent.com/66201264/152634407-32936d23-b59d-4526-b0c1-d8f84f0631c9.gif" alt="jsQuizzzGIF"/>
<br/>
