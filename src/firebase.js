import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyAtOVokTyjz4ce3RQvb1IDRwKp4QWVthRg",
  authDomain: "amicom-well-link.firebaseapp.com",
  projectId: "amicom-well-link",
  storageBucket: "amicom-well-link.firebasestorage.app",
  messagingSenderId: "22836452418",
  appId: "1:22836452418:web:07e71e71f7b26d8392e1db",
  measurementId: "G-4486PTH7PR"
}

// Firebase 초기화
const app = initializeApp(firebaseConfig)

// Analytics 초기화 (선택사항)
const analytics = getAnalytics(app)

// Firestore 데이터베이스 가져오기
export const db = getFirestore(app)
