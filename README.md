# Well-Link - 복지 혜택 관리 플랫폼

복지 혜택을 검색하고, 북마크하며, 개인적인 할 일 목록과 리뷰를 관리할 수 있는 React 기반 웹 애플리케이션입니다.

## 🚀 주요 기능

### 1. 복지 혜택 검색 및 상세 정보
- 복지 서비스 목록 조회
- 상세 정보 모달 팝업
- 실시간 API 연동

### 2. 북마크 시스템
- 복지 혜택 북마크 추가/제거
- 북마크된 항목 목록 관리
- 북마크 상세 페이지

### 3. 개인 할 일 목록 (Todo)
- 북마크된 복지 혜택별 개인 할 일 관리
- CRUD 기능 (생성, 읽기, 수정, 삭제)
- 진행률 표시

### 4. 리뷰 시스템
- 복지 혜택별 리뷰 작성/조회/삭제
- 별점 평가 (1-5점)
- 평균 평점 계산

### 5. 마이페이지
- 북마크된 복지 혜택 목록
- 북마크 제거 기능
- 북마크 상세 페이지 연결

## 🛠 기술 스택

### Frontend
- **React 19.1.1** - 사용자 인터페이스 구축
- **React Router DOM 7.8.2** - 클라이언트 사이드 라우팅
- **Tailwind CSS 4.1.12** - 스타일링 및 UI 컴포넌트
- **Vite 7.1.2** - 빌드 도구 및 개발 서버

### Backend & API
- **Axios 1.11.0** - HTTP 클라이언트 (복지 API 연동)
- **Firebase 12.1.0** - 클라우드 데이터베이스
  - **Firestore** - 리뷰 데이터 저장
  - **Analytics** - 사용자 행동 분석

### 데이터 저장
- **localStorage** - 북마크, 할 일 목록, 사용자 설정
- **Firebase Firestore** - 리뷰 데이터 (원격 저장)

### 개발 도구
- **ESLint 9.33.0** - 코드 품질 관리

## 📁 프로젝트 구조

```
my-app/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── WelfareList.jsx      # 복지 혜택 목록 및 상세 정보
│   │   ├── MyPage.jsx           # 마이페이지 (북마크 관리)
│   │   ├── BookmarkDetail.jsx   # 북마크 상세 페이지
│   │   ├── Reviews.jsx          # 리뷰 시스템
│   │   ├── PersonalInfo.jsx     # 개인 정보 관리
│   │   └── GetStart.jsx         # 시작 페이지
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx                  # 메인 앱 컴포넌트 (라우팅)
│   ├── main.jsx                 # 앱 진입점
│   ├── index.css                # 전역 스타일
│   └── firebase.js              # Firebase 설정
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd my-app
```

### 2. 의존성 설치
```bash
npm install
```

### 3. Firebase 설정 (리뷰 기능 사용 시)
리뷰 기능을 사용하려면 Firebase 프로젝트 설정이 필요합니다. `src/firebase.js` 파일에서 환경변수를 통해 Firebase 설정을 관리합니다.

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 빌드
```bash
npm run build
```

## 📱 주요 페이지 및 기능

### WelfareList 페이지
- **기술**: React Hooks, Axios API 연동
- **기능**: 복지 혜택 목록 조회, 상세 정보 모달, 북마크 추가

### MyPage 페이지
- **기술**: React Router, localStorage
- **기능**: 북마크 목록 표시, 북마크 제거, 상세 페이지 연결

### BookmarkDetail 페이지
- **기술**: React Router, localStorage
- **기능**: 북마크 상세 정보, 외부 링크 연결, 할 일 목록 관리

### Reviews 페이지
- **기술**: Firebase Firestore, React Hooks
- **기능**: 리뷰 작성/조회/삭제, 별점 평가, 평균 평점 계산

## 🔧 주요 컴포넌트 설명

### WelfareList.jsx
```javascript
// 주요 기능
- 복지 API 데이터 fetch (Axios)
- 상세 정보 모달 팝업
- 북마크 추가 로직
- 검색 및 필터링
```

### BookmarkDetail.jsx
```javascript
// 주요 기능
- Todo 리스트 CRUD (localStorage)
- 외부 링크 연결
- 북마크 제거
- 리뷰 페이지 연결
```

### Reviews.jsx
```javascript
// 주요 기능
- Firebase Firestore 연동
- 리뷰 CRUD 작업
- 별점 시스템
- 평균 평점 계산
```

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일 친화적 레이아웃
- **일관된 색상 체계**: 보라색 계열의 브랜드 컬러
- **직관적인 네비게이션**: 명확한 페이지 구조
- **사용자 피드백**: 로딩 상태, 성공/오류 메시지

## 📊 데이터 흐름

1. **복지 데이터**: 외부 API → Axios → React State
2. **북마크 데이터**: React State → localStorage
3. **할 일 데이터**: React State → localStorage (servId별)
4. **리뷰 데이터**: React State → Firebase Firestore

## 🔒 보안 및 권한

- **Firebase 보안 규칙**: Firestore 읽기/쓰기 권한 설정
- **localStorage**: 클라이언트 사이드 데이터 저장
- **API 키 관리**: 환경 변수 또는 설정 파일 분리

## 🚀 배포

### Vercel 배포 (권장)
```bash
npm run build
# Vercel CLI 또는 GitHub 연동으로 배포
```

### Netlify 배포
```bash
npm run build
# build 폴더를 Netlify에 업로드
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**Well-Link** - 복지 혜택을 더 쉽게, 더 스마트하게 관리하세요! 🎉
