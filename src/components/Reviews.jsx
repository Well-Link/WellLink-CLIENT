import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore'

function Reviews() {
  const location = useLocation()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState('')
  const [rating, setRating] = useState(5)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [serviceInfo, setServiceInfo] = useState(null)

  useEffect(() => {
    try {
      // location.state에서 서비스 정보 가져오기
      if (location.state?.servId) {
        setServiceInfo({
          servId: location.state.servId,
          title: location.state.title,
          provider: location.state.provider
        })
      }

      // 리뷰 데이터 로드
      loadReviews()
    } catch (error) {
      console.error('리뷰 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }, [location.state])

  // 리뷰 로드 함수 (Firebase)
  const loadReviews = async () => {
    try {
      const servId = location.state?.servId
      if (servId) {
        const reviewsRef = collection(db, 'reviews')
        const q = query(
          reviewsRef, 
          where('servId', '==', servId),
          orderBy('createdAt', 'desc')
        )
        
        const querySnapshot = await getDocs(q)
        const reviewsData = []
        
        querySnapshot.forEach((doc) => {
          reviewsData.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        setReviews(reviewsData)
      }
    } catch (error) {
      console.error('리뷰 로드 오류:', error)
      // Firebase 오류 시 localStorage에서 로드 (fallback)
      try {
        const servId = location.state?.servId
        if (servId) {
          const storedReviews = localStorage.getItem(`reviews_${servId}`)
          if (storedReviews) {
            const parsedReviews = JSON.parse(storedReviews)
            setReviews(parsedReviews)
          }
        }
      } catch (localError) {
        console.error('localStorage 로드 오류:', localError)
      }
    }
  }

  // 리뷰 추가 함수 (Firebase)
  const handleAddReview = async () => {
    if (newReview.trim() === '') {
      alert('리뷰 내용을 입력해주세요.')
      return
    }

    try {
      const servId = location.state?.servId
      if (!servId) return

      const newReviewData = {
        servId: servId,
        text: newReview.trim(),
        rating: rating,
        createdAt: new Date().toISOString(),
        author: '익명 사용자', // 실제로는 사용자 정보를 사용
        serviceTitle: location.state?.title || '',
        serviceProvider: location.state?.provider || ''
      }

      // Firebase에 저장
      const docRef = await addDoc(collection(db, 'reviews'), newReviewData)
      
      // 로컬 상태 업데이트
      const newReviewItem = {
        id: docRef.id,
        ...newReviewData
      }
      
      setReviews([newReviewItem, ...reviews])
      setNewReview('')
      setRating(5)
      setShowReviewForm(false)
      alert('리뷰가 등록되었습니다.')
      
      // localStorage에도 백업 저장
      try {
        const existingReviews = JSON.parse(localStorage.getItem(`reviews_${servId}`) || '[]')
        const updatedLocalReviews = [newReviewItem, ...existingReviews]
        localStorage.setItem(`reviews_${servId}`, JSON.stringify(updatedLocalReviews))
      } catch (localError) {
        console.error('localStorage 백업 저장 오류:', localError)
      }
      
    } catch (error) {
      console.error('리뷰 저장 오류:', error)
      alert('리뷰 저장에 실패했습니다. 다시 시도해주세요.')
      
      // Firebase 실패 시 localStorage에만 저장
      try {
        const servId = location.state?.servId
        if (servId) {
          const newReviewItem = {
            id: Date.now().toString(),
            servId: servId,
            text: newReview.trim(),
            rating: rating,
            createdAt: new Date().toISOString(),
            author: '익명 사용자'
          }
          
          const existingReviews = JSON.parse(localStorage.getItem(`reviews_${servId}`) || '[]')
          const updatedReviews = [newReviewItem, ...existingReviews]
          localStorage.setItem(`reviews_${servId}`, JSON.stringify(updatedReviews))
          
          setReviews([newReviewItem, ...reviews])
          setNewReview('')
          setRating(5)
          setShowReviewForm(false)
          alert('리뷰가 로컬에 저장되었습니다. (네트워크 오류)')
        }
      } catch (localError) {
        console.error('localStorage 저장 오류:', localError)
        alert('리뷰 저장에 완전히 실패했습니다.')
      }
    }
  }

  // 리뷰 삭제 함수 (Firebase)
  const handleDeleteReview = async (reviewId) => {
    const isConfirmed = window.confirm('이 리뷰를 삭제하시겠습니까?')
    if (!isConfirmed) return

    try {
      // Firebase에서 삭제
      await deleteDoc(doc(db, 'reviews', reviewId))
      
      // 로컬 상태 업데이트
      const updatedReviews = reviews.filter(review => review.id !== reviewId)
      setReviews(updatedReviews)
      
      // localStorage에서도 삭제
      try {
        const servId = location.state?.servId
        if (servId) {
          const existingReviews = JSON.parse(localStorage.getItem(`reviews_${servId}`) || '[]')
          const updatedLocalReviews = existingReviews.filter(review => review.id !== reviewId)
          localStorage.setItem(`reviews_${servId}`, JSON.stringify(updatedLocalReviews))
        }
      } catch (localError) {
        console.error('localStorage 삭제 오류:', localError)
      }
      
      alert('리뷰가 삭제되었습니다.')
      
    } catch (error) {
      console.error('리뷰 삭제 오류:', error)
      alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 별점 렌더링 함수
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  // 평균 평점 계산
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const handleBack = () => {
    navigate('/bookmark-detail', { 
      state: { bookmarkData: location.state }
    })
  }

  if (loading) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen flex justify-center">
        <div className="w-[768px] h-[1080px] bg-white flex flex-col relative">
          <div className="w-full h-[90px] flex items-center px-7 shadow-md">
            <h1 className="text-2xl font-normal text-black">Well-Link</h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xl text-gray-600">로딩 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!serviceInfo) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen flex justify-center">
        <div className="w-[768px] h-[1080px] bg-white flex flex-col relative">
          <div className="w-full h-[90px] flex items-center px-7 shadow-md">
            <h1 className="text-2xl font-normal text-black">Well-Link</h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl text-red-600 mb-4">서비스 정보를 찾을 수 없습니다</div>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex justify-center">
      <div className="w-[768px] h-[1080px] bg-white flex flex-col relative">
        {/* Header */}
        <div className="w-full h-[90px] flex items-center px-7 shadow-md">
          <h1 className="text-2xl font-normal text-black">Well-Link</h1>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-black">리뷰</h2>
            <div className="w-full h-[2px] bg-purple-500 mt-2"></div>
          </div>

          {/* Service Info */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {serviceInfo.title}
            </h3>
            <p className="text-gray-600 mb-3">
              {serviceInfo.provider}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">평균 평점:</span>
                {renderStars(Math.round(averageRating))}
                <span className="text-sm text-gray-600">
                  ({averageRating.toFixed(1)})
                </span>
              </div>
              <span className="text-sm text-gray-600">
                리뷰 {reviews.length}개
              </span>
            </div>
          </div>

          {/* Review Form Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full py-3 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              {showReviewForm ? '리뷰 작성 취소' : '리뷰 작성하기'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">리뷰 작성</h3>
              
              {/* Rating Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  평점 선택
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating}점
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  리뷰 내용
                </label>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="이 복지 혜택에 대한 경험이나 의견을 자유롭게 작성해주세요..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="4"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddReview}
                  disabled={newReview.trim() === ''}
                  className="flex-1 py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  리뷰 등록
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">리뷰 목록</h3>
            
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">아직 리뷰가 없습니다.</p>
                <p className="text-sm">첫 번째 리뷰를 작성해보세요!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">
                            {review.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{review.author}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      {renderStars(review.rating)}
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={handleBack}
              className="w-full h-[60px] bg-gray-400 text-white text-xl font-semibold rounded-[10px] hover:bg-gray-500 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reviews
