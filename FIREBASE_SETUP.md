# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "well-link-reviews")
4. Google Analytics 설정 (선택사항)
5. "프로젝트 만들기" 클릭

## 2. Firestore 데이터베이스 설정

1. 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 보안 규칙 선택:
   - **테스트 모드에서 시작** (개발용)
   - 또는 **프로덕션 모드에서 시작** (운영용)
4. 위치 선택 (예: asia-northeast3 (서울))

## 3. 웹 앱 등록

1. 프로젝트 개요에서 웹 아이콘(</>) 클릭
2. 앱 닉네임 입력 (예: "well-link-web")
3. "Firebase Hosting 설정" 체크 해제
4. "앱 등록" 클릭

## 4. 설정 정보 복사

등록 후 표시되는 설정 정보를 복사하여 `src/firebase.js` 파일에 붙여넣기:

```javascript
const firebaseConfig = {
  apiKey: "실제_API_키",
  authDomain: "실제_도메인",
  projectId: "실제_프로젝트_ID",
  storageBucket: "실제_스토리지_버킷",
  messagingSenderId: "실제_메시징_ID",
  appId: "실제_앱_ID"
}
```

## 5. 보안 규칙 설정 (선택사항)

Firestore Database > 규칙 탭에서 다음 규칙 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 리뷰 컬렉션에 대한 읽기/쓰기 허용
    match /reviews/{document} {
      allow read, write: if true; // 모든 사용자에게 허용
    }
  }
}
```

## 6. 테스트

1. 앱을 실행하고 리뷰 작성
2. Firebase Console > Firestore Database에서 데이터 확인
3. 다른 브라우저나 기기에서 접속하여 리뷰 확인

## 주의사항

- **보안**: 현재 설정은 모든 사용자에게 읽기/쓰기를 허용합니다
- **비용**: Firebase는 무료 티어가 있지만 사용량에 따라 요금이 발생할 수 있습니다
- **백업**: localStorage를 fallback으로 사용하여 네트워크 오류 시에도 작동합니다

## 대안 옵션들

### 2. **Supabase (PostgreSQL 기반)**
- 무료 티어 제공
- PostgreSQL 데이터베이스
- 실시간 기능 지원

### 3. **JSON Server + GitHub Pages**
- GitHub에 JSON 파일로 저장
- 무료이지만 실시간 업데이트 제한

### 4. **LocalStorage + Export/Import**
- 데이터를 JSON 파일로 내보내기/가져오기
- 수동 동기화 필요

Firebase가 가장 간단하고 실용적인 솔루션입니다!
