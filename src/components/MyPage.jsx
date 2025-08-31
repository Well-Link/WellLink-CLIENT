import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function MyPage() {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem('welfareBookmarks')
      if (storedBookmarks) {
        const parsedBookmarks = JSON.parse(storedBookmarks)
        setBookmarks(parsedBookmarks)
      }
      
      // 북마크 관련 welfareItems도 로드
      const storedWelfareItems = localStorage.getItem('welfareBookmarkItems')
      if (storedWelfareItems) {
        const parsedWelfareItems = JSON.parse(storedWelfareItems)
        console.log('welfareBookmarkItems 로드:', parsedWelfareItems.length, '개 항목')
      }
    } catch (error) {
      console.error('북마크 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleBookmarkClick = (bookmark) => {
    // 북마크 상세 정보 페이지로 이동
    navigate('/bookmark-detail', { 
      state: { bookmarkData: bookmark }
    })
  }

  const handleRemoveBookmark = (servId, event) => {
    // 이벤트 버블링 방지
    event.stopPropagation()
    
    // 삭제 확인 메시지
    const isConfirmed = window.confirm('삭제하시겠습니까?')
    
    if (!isConfirmed) {
      return // 사용자가 취소한 경우
    }
    
    try {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.servId !== servId)
      localStorage.setItem('welfareBookmarks', JSON.stringify(updatedBookmarks))
      setBookmarks(updatedBookmarks)
      alert('북마크가 제거되었습니다.')
    } catch (error) {
      console.error('북마크 제거 오류:', error)
      alert('북마크 제거에 실패했습니다.')
    }
  }

  const handleBack = () => {
    navigate('/welfare-list')
  }

  if (loading) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen flex justify-center">
        <div className="w-full max-w-[768px] min-h-screen bg-white flex flex-col relative">
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

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex justify-center">
      <div className="w-full max-w-[768px] min-h-screen bg-white flex flex-col relative">
        {/* Header */}
        <div className="w-full h-[90px] flex items-center px-7 shadow-md">
          <h1 className="text-2xl font-normal text-black">Well-Link</h1>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col px-8 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-black">마이 페이지</h2>
            <div className="w-full h-[2px] bg-blue-500 mt-2"></div>
          </div>

          {/* Bookmarks List */}
          <div className="flex-1 overflow-y-auto pb-4">
            {bookmarks.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-gray-400 text-lg mb-2">저장된 북마크가 없습니다</div>
                  <div className="text-gray-500 text-sm">복지 서비스를 북마크에 저장해보세요</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarks.map((bookmark, index) => (
                  <div 
                    key={bookmark.servId || index} 
                    className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleBookmarkClick(bookmark)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-gray-800 flex-1 mr-4">
                        {bookmark.title}
                      </h3>
                      <button
                        onClick={(e) => handleRemoveBookmark(bookmark.servId, e)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        삭제
                      </button>
                    </div>
                    
                    {bookmark.provider && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">제공기관:</span> {bookmark.provider}
                      </p>
                    )}
                    
                    {bookmark.targetsDetail && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">지원대상:</span>
                        </p>
                        <p className="text-sm text-gray-700 bg-white p-2 rounded mt-1 text-xs">
                          {bookmark.targetsDetail.substring(0, 100)}
                          {bookmark.targetsDetail.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    )}
                    
                    {bookmark.benefitContent && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">지원내용:</span>
                        </p>
                        <p className="text-sm text-gray-700 bg-white p-2 rounded mt-1 text-xs">
                          {bookmark.benefitContent.substring(0, 100)}
                          {bookmark.benefitContent.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    )}
                    
                    {bookmark.supportCycle && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">지원주기:</span> {bookmark.supportCycle}
                      </p>
                    )}
                    
                    {bookmark.bookmarkedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        저장일: {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                      </p>
                    )}
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
              이전
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage
