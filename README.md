# FS 2기 중급 프로젝트 3팀 - Docthru(FE)



## 팀 협업문서
<a href = "https://www.notion.so/128e951e3e618064a461c77c319274b2?v=128e951e3e6181e4a1ac000c923e8661">
    <img src="https://bizlog.me/wp-content/uploads/2021/03/notion-logo.png" width="100px">
</a>

## 팀원 구성

| 소재희(팀장) | 신지원 | 이강수 |
|:-----:|:-----:|:-----:|
| <image src = "https://avatars.githubusercontent.com/u/135010826?v=4" width = 150px> | <image src = "https://avatars.githubusercontent.com/u/80625377?v=4" width = 150px> | <image src = "https://avatars.githubusercontent.com/u/7779295?v=4" width = 150px> |
| [BuffSo](https://github.com/BuffSo) | [shinji530](https://github.com/shinji530) | [kipid](https://github.com/kipid) |
| 천우승 | 김은효 | 서지우 |
| <image src = "https://avatars.githubusercontent.com/u/174844724?v=4" width = 150px> | <image src = "https://avatars.githubusercontent.com/u/176313108?v=4" width = 150px> | <image src = "https://avatars.githubusercontent.com/u/176551801?v=4" width = 150px> |
| [mingmungXD](https://github.com/mingmungXD)| [kirinkiri](https://github.com/kirinkiri) | [JiwooFS](https://github.com/JiwooFS) |
| 현준배 |
| <image src = "https://avatars.githubusercontent.com/u/82556884?v=4" width = 150px> |
| [junbaehyun](https://github.com/junbaehyun) |

## 프로젝트 소개

대다수의 개발 시장 콘텐츠가 영어로 작성되어 있어, 영어에 익숙하지 않은 한국인들이 해당 기술을 습득하는데 어려움을 겪고 있습니다.

따라서 개발 관련 영어 문서를 함께 번역하는 챌린지를 진행하고, 번역 작업 에디터에서 번역을 진행하며 번역문에 대한 피드백을 주고받을 수 있는 개발 문서 번역 챌린지 서비스를 제작합니다.

## 프로젝트 기간

2024.11.15 ~ 2024.12.9


## 기술 스택

### 프론트엔드

![Next.js](https://img.shields.io/badge/Next.js-%23000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-%2320232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Query](https://img.shields.io/badge/React_Query-%23FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![React CSS Modules](https://img.shields.io/badge/React_CSS_Modules-%23000000?style=for-the-badge&logo=react&logoColor=61DAFB)
![Quill](https://img.shields.io/badge/Quill-%23000000?style=for-the-badge&logo=quill&logoColor=white)

### 협업 방식

![GitHub](https://img.shields.io/badge/GitHub-%23121011?style=for-the-badge&logo=github&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-%23000000?style=for-the-badge&logo=notion&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-%2392a8d1?style=for-the-badge&logo=discord&logoColor=white)
![Zoom](https://img.shields.io/badge/Zoom-%23121841?style=for-the-badge&logo=zoom&logoColor=white)


### 배포
![Vercel](https://img.shields.io/badge/Vercel-%23000000?style=for-the-badge&logo=vercel&logoColor=white)


## 팀원별 구현 기능 상세 및 담당 업무

### **이강수(FE리더)**

- #### 번역 챌린지 조회

    - 목록 조회
    - 상세 조회
    - 참여 현황 조회

- #### 번역 챌린지 참여

    - 챌린지 도전/포기
    - 번역 작성 (에디터로 번역 작성, 임시 저장 및 불러오기, 원문 확인)
    - 번역 제출

- #### 번역 챌린지 신청 관리

    - 신청 목록 조회

- #### 챌린지 관리

    - 작업물 수정/삭제
    - 하트 남기기 기능

- #### 나의 챌린지 관리

    - 참여 중인 챌린지 목록 조회
    - 완료한 챌린지 목록 조회
    - 신청한 챌린지 목록 조회


### **신지원**

- #### 신청한 챌린지 목록 조회(Admin)

    - 일부 css 수정
    - Sort 컴포넌트화
    - Search 기능

- #### 신청한 챌린지 상세 조회(Admin)

    - 승인 및 거절 기능
    - 승인 및 거절 모달

- #### 회원 및 관리자만 접근 가능한 페이지 리다이렉트 구현

    - useAuth 훅

- #### 반응형

    - kebab, sort 모달 등 화면 다른 곳 클릭 시 닫히도록 구현



### **천우승**

- #### 챌린지 보기 페이지
    
    - 신규 챌린지 신청
    - 챌린지 수정하기

- #### 작업물 페이지

    - 내 작업물
    - 피드백 남기기
    - 더보기 기능

- #### 작업물 페이지(Admin)

    - 피드백 수정
    - 작업물 수정
    - 작업물 삭제 모달



### **김은효**

- #### 비회원 페이지

    - 로그인 기능
    - 회원가입 기능

- #### 나의 챌린지 신청한 챌린지 상세보기

    - 승인 대기
    - 승인 취소 확인 모달
    - 승인 거절

- #### 푸터

### **서지우**

- #### 헤더

- #### Readme.md 작성

## 파일 구조

```
jsx
├─apis
│    applicationService.js
│    authService.js
│    challengeService.js
│    feedbackService.js
│    instance.js
│    notisService.js
│    translate.js
│    workService.js
├─components
│    Challenge.jsx
│    Challenge.module.css
│    CustomDatePicker.jsx
│    CustomDatePicker.module.css
│    DelModal.jsx
│    DelModal.module.css
│    Dropdown.jsx
│    Dropdown.module.css
│    Error.jsx
│    FeedbackInput.jsx
│    FeedbackInput.module.css
│    FeedbackList.jsx
│    FeedbackList.module.css
│    Header.jsx
│    Header.module.css
│    InputItem.jsx
│    Label.jsx
│    Loading.jsx
│    Loading.module.css
│    LoginForm.jsx
│    LoginForm.module.css
│    LoopSlider.jsx
│    LoopSlider.module.css
│    Modal.jsx
│    Modal.module.css
│    MyChallHeader.jsx
│    notis.jsx
│    Pagination.jsx
│    Pagination.module.css
│    PopUp.jsx
│    PopUp.module.css
│    SignupForm.jsx
│    SignupForm.module.css
│    Sort.jsx
│    Sort.module.css
│    Table.jsx
│    Table.module.css
│    TextareaItem.jsx
│    TextareaItem.module.css
│    X.jsx
│    X.module.css
├─context
│    UserProvider.jsx
│    ViewportProvider.jsx
├─hooks
│		 useAuth.jsx
├─pages
│	 │  home.jsx
│	 │  index.jsx
│	 │  login.jsx
│	 │  profile.jsx
│	 │  signup.jsx
│	 │  _app.js
│	 │  _document.js
│	 │
│	 ├─admin
│	 │  └─manage
│	 │          index.jsx
│	 │          [applicationId].jsx
│	 │
│	 ├─challenges
│	 │  │  new.jsx
│	 │  │
│	 │  └─[challengeId]
│	 │          editChallenge.jsx
│	 │          index.jsx
│	 │
│	 ├─google
│	 │      callback.js
│	 │
│	 ├─kakao
│	 │      callback.js
│	 │
│	 ├─users
│	 │  └─me
│	 │      └─challenges
│	 │          │  applied.jsx
│	 │          │  completed.jsx
│	 │          │  ongoing.jsx
│	 │          │
│	 │          └─applied
│	 │                  [applicationId].jsx
│	 │
│	 └─work
│	     └─[id]
│	             edit.jsx
│	             workdetail.jsx
├─public
│  └─images
└─styles
     ChallengeDetail.module.css
     editChallenge.module.css
     globals.css
     Home.module.css
     InputItem.module.css
     Label.module.css
     login.module.css
     Manage.module.css
     ManageApp.module.css
     MyChalls.module.css
     new.module.css
     Notis.module.css
     TextEditor.module.css
     WorkDetail.module.css
```



## 구현 홈페이지

FE: https://2gi-docthru-3team-fe.vercel.app/

BE: https://twogi-docthru-3team-be.onrender.com
