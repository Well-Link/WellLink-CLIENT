import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

// 상세 정보 모달 컴포넌트
const DetailModal = ({ isOpen, onClose, detailData, loading, welfareItems }) => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  
  // 북마크 저장 함수
  const handleBookmark = () => {
    console.log('🔍 북마크 함수 시작')
    console.log('detailData:', detailData)
    console.log('welfareItems:', welfareItems)
    
    if (!detailData || !detailData.servId) {
      console.log('❌ detailData 또는 servId가 없습니다')
      alert('북마크할 수 있는 데이터가 없습니다.')
      return
    }
    
    try {
      // 기존 북마크 목록 가져오기
      const existingBookmarks = JSON.parse(localStorage.getItem('welfareBookmarks') || '[]')
      console.log('기존 북마크 목록:', existingBookmarks)
      
      // 이미 저장된 북마크인지 확인
      const isAlreadyBookmarked = existingBookmarks.some(bookmark => bookmark.servId === detailData.servId)
      console.log('이미 북마크된 항목인가?', isAlreadyBookmarked)
      
      if (isAlreadyBookmarked) {
        // 이미 저장된 경우 제거
        const updatedBookmarks = existingBookmarks.filter(bookmark => bookmark.servId !== detailData.servId)
        localStorage.setItem('welfareBookmarks', JSON.stringify(updatedBookmarks))
        setIsBookmarked(false)
        alert('북마크가 제거되었습니다.')
        
        // welfareBookmarkItems에서도 해당 항목 제거
        const existingBookmarkItems = JSON.parse(localStorage.getItem('welfareBookmarkItems') || '[]')
        const updatedBookmarkItems = existingBookmarkItems.filter(item => item.servId !== detailData.servId)
        localStorage.setItem('welfareBookmarkItems', JSON.stringify(updatedBookmarkItems))
        console.log('✅ welfareBookmarkItems에서 항목 제거:', detailData.title)
        console.log('업데이트된 welfareBookmarkItems:', updatedBookmarkItems)
      } else {
        // 새로운 북마크 추가
        const newBookmark = {
          ...detailData,
          bookmarkedAt: new Date().toISOString()
        }
        const updatedBookmarks = [...existingBookmarks, newBookmark]
        localStorage.setItem('welfareBookmarks', JSON.stringify(updatedBookmarks))
        setIsBookmarked(true)
        alert('북마크에 저장되었습니다.')
        
        // welfareItems에서 일치하는 항목 찾기 및 welfareBookmarkItems에 저장
        if (welfareItems && welfareItems.length > 0) {
          console.log('welfareItems에서 일치하는 항목 검색 중...')
          console.log('찾을 servId:', detailData.servId)
          console.log('전체 welfareItems:', welfareItems)
          
          // servId로 일치하는 항목 찾기
          const matchingItem = welfareItems.find(item => item.servId === detailData.servId)
          
          if (matchingItem) {
            console.log('✅ 일치하는 항목 발견:', matchingItem)
            
            // 기존 welfareBookmarkItems 가져오기
            const existingBookmarkItems = JSON.parse(localStorage.getItem('welfareBookmarkItems') || '[]')
            console.log('기존 welfareBookmarkItems:', existingBookmarkItems)
            
            // 이미 저장된 항목인지 확인
            const isAlreadyStored = existingBookmarkItems.some(item => item.servId === matchingItem.servId)
            console.log('이미 welfareBookmarkItems에 저장된 항목인가?', isAlreadyStored)
            
            if (!isAlreadyStored) {
              // 새로운 항목 추가
              const updatedBookmarkItems = [...existingBookmarkItems, matchingItem]
              localStorage.setItem('welfareBookmarkItems', JSON.stringify(updatedBookmarkItems))
              console.log('✅ welfareBookmarkItems에 새 항목 추가 성공:', matchingItem.title)
              console.log('업데이트된 welfareBookmarkItems:', updatedBookmarkItems)
            } else {
              console.log('이미 welfareBookmarkItems에 저장된 항목입니다:', matchingItem.title)
            }
          } else {
            console.log('❌ welfareItems에서 일치하는 항목을 찾을 수 없습니다')
            console.log('찾으려는 servId:', detailData.servId)
            console.log('welfareItems의 servId들:', welfareItems.map(item => item.servId))
            
            // 일치하는 항목이 없어도 detailData를 기반으로 저장
            const existingBookmarkItems = JSON.parse(localStorage.getItem('welfareBookmarkItems') || '[]')
            const fallbackItem = {
              servId: detailData.servId,
              title: detailData.title,
              summary: detailData.benefitContent || '상세 정보에서 가져온 서비스',
              provider: detailData.provider,
              bookmarkedAt: new Date().toISOString()
            }
            
            const isAlreadyStored = existingBookmarkItems.some(item => item.servId === fallbackItem.servId)
            if (!isAlreadyStored) {
              const updatedBookmarkItems = [...existingBookmarkItems, fallbackItem]
              localStorage.setItem('welfareBookmarkItems', JSON.stringify(updatedBookmarkItems))
              console.log('✅ fallback으로 welfareBookmarkItems에 항목 추가:', fallbackItem.title)
            }
          }
        } else {
          console.log('❌ welfareItems가 비어있거나 없습니다')
        }
      }
      
      // 최종 저장 결과 확인
      const finalBookmarks = JSON.parse(localStorage.getItem('welfareBookmarks') || '[]')
      const finalBookmarkItems = JSON.parse(localStorage.getItem('welfareBookmarkItems') || '[]')
      console.log('최종 북마크 목록:', finalBookmarks)
      console.log('최종 welfareBookmarkItems:', finalBookmarkItems)
      
    } catch (error) {
      console.error('북마크 저장 오류:', error)
      alert('북마크 저장에 실패했습니다.')
    }
  }
  
  // 컴포넌트가 열릴 때 북마크 상태 확인
  useEffect(() => {
    if (detailData && detailData.servId) {
      const existingBookmarks = JSON.parse(localStorage.getItem('welfareBookmarks') || '[]')
      const isAlreadyBookmarked = existingBookmarks.some(bookmark => bookmark.servId === detailData.servId)
      setIsBookmarked(isAlreadyBookmarked)
    }
  }, [detailData])
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 반투명 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50"
      ></div>
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">복지 서비스 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* 로딩 상태 */}
        {loading && (
          <div className="p-8 text-center">
            <div className="text-lg text-gray-600">상세 정보를 불러오는 중...</div>
          </div>
        )}
        
        {/* 상세 정보 */}
        {!loading && detailData && (
          <div className="p-6 space-y-6">
                         {/* 서비스 제목 */}
             <div>
               <h3 className="text-lg font-semibold text-gray-800 mb-2">서비스명</h3>
               <p className="text-gray-700 leading-relaxed">
                 {detailData.title || '제목 정보가 없습니다'}
               </p>
             </div>
            
                         {/* 제공기관 */}
             <div>
               <h3 className="text-lg font-semibold text-gray-800 mb-2">제공기관</h3>
               <p className="text-gray-700">
                 {detailData.provider || '제공기관 정보가 없습니다'}
               </p>
             </div>
            
                         {/* 지원대상 */}
             <div>
               <h3 className="text-lg font-semibold text-gray-800 mb-2">지원대상</h3>
               <div className="bg-gray-50 p-4 rounded-lg">
                 <p className="text-gray-700 whitespace-pre-line">
                   {detailData.targetsDetail || '지원대상 정보가 없습니다'}
                 </p>
               </div>
             </div>
            
                         {/* 지원내용 */}
             <div>
               <h3 className="text-lg font-semibold text-gray-800 mb-2">지원내용</h3>
               <div className="bg-blue-50 p-4 rounded-lg">
                 <p className="text-gray-700 whitespace-pre-line">
                   {detailData.benefitContent || '지원내용 정보가 없습니다'}
                 </p>
               </div>
             </div>
            
                         {/* 지원기준 */}
             <div>
               <h3 className="text-lg font-semibold text-gray-800 mb-2">지원기준</h3>
               <div className="bg-yellow-50 p-4 rounded-lg">
                 <p className="text-gray-700 whitespace-pre-line">
                   {detailData.criteria || '지원기준 정보가 없습니다'}
                 </p>
               </div>
             </div>
            
                         {/* 지원주기 */}
             <div>
               <h3 className="text-lg font-semibold text-gray-800 mb-2">지원주기</h3>
               <p className="text-gray-700">
                 {detailData.supportCycle || '지원주기 정보가 없습니다'}
               </p>
             </div>
            
            {/* 연락처 */}
            {detailData.contacts && detailData.contacts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">연락처</h3>
                <div className="flex flex-wrap gap-2">
                  {detailData.contacts.map((contact, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {contact}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* 사이트 링크 */}
            {detailData.siteLinks && detailData.siteLinks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">관련 사이트</h3>
                <div className="space-y-2">
                  {detailData.siteLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
                 {/* 북마크 및 닫기 버튼 */}
         <div className="p-6 border-t border-gray-200 space-y-3">
           <button
             onClick={handleBookmark}
             disabled={!detailData}
             className={`w-full py-3 px-4 rounded-lg transition-colors ${
               isBookmarked 
                 ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                 : 'bg-blue-500 text-white hover:bg-blue-600'
             } ${!detailData ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
             {isBookmarked ? '북마크 제거' : '북마크에 저장'}
           </button>
           <button
             onClick={onClose}
             className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
           >
             닫기
           </button>
         </div>
      </div>
    </div>
  )
}

function WelfareList() {
  const location = useLocation()
  const navigate = useNavigate()
  const [welfareItems, setWelfareItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [detailLoadingId, setDetailLoadingId] = useState(null)
  const [detailError, setDetailError] = useState('')
  const [detailFallbackLink, setDetailFallbackLink] = useState('')
  const pageSize = 6
  
  // 모달 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    try {
      if (location.state?.data?.items) {
        setWelfareItems(location.state.data.items)
        // 새로운 데이터가 오면 localStorage에 저장 (삭제하지 않음)
        localStorage.setItem('welfareItems', JSON.stringify(location.state.data.items))
        console.log('✅ 새로운 데이터로 localStorage 저장 완료')
        setLoading(false)
        return
      }
      const stored = localStorage.getItem('welfareItems')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setWelfareItems(parsed)
        }
      }
    } catch (err) {
      console.error('로컬스토리지 읽기 오류:', err)
      setError('저장된 데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [location.state])

  useEffect(() => {
    setCurrentPage(1)
  }, [welfareItems])

  // 컴포넌트가 언마운트될 때 로컬스토리지 삭제
  useEffect(() => {
    return () => {
      // 다른 페이지로 이동할 때 로컬스토리지 삭제
      localStorage.removeItem('welfareItems')
      console.log('✅ 페이지 이동으로 localStorage 삭제 완료')
    }
  }, [])

  const totalPages = Math.max(1, Math.ceil(welfareItems.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const pagedItems = welfareItems.slice(startIndex, endIndex)

  async function requestWelfareDetail(servId) {
    const params = { servId }
    const queryString = new URLSearchParams(params).toString()
    const fullUrl = `/health/welfare-detail?${queryString}`

    console.log('========== 상세 API 요청 정보 =========')
    console.log('메서드: GET')
    console.log('엔드포인트: /health/welfare-detail')
    console.log('파라미터:', params)
    console.log('전체 요청 URL:', fullUrl)
    console.log('=====================================')

    const maxRetries = 3
    let attempt = 0
    let lastError

    while (attempt < maxRetries) {
      attempt += 1
      try {
        const res = await axios.get('/health/welfare-detail', {
          params,
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })
        const result = res.data
        console.log('========== 상세 API 응답 정보 =========')
        console.log('시도 횟수:', attempt)
        console.log('상태 코드:', res.status)
        console.log('응답 데이터(raw):', result)
        if (!result || result.ok !== true) {
          throw new Error('응답 ok=false 또는 응답 형식 불일치')
        }
        console.log('메타:', result.meta)
        console.log('아이템 수:', Array.isArray(result.items) ? result.items.length : 0)
        console.log('아이템:', result.items)
        console.log('=====================================')
        return result
      } catch (err) {
        lastError = err
        const status = err.response?.status
        const isTimeout = err.code === 'ECONNABORTED'
        const shouldRetry = status === 504 || isTimeout
        console.warn(`상세 요청 실패 (시도 ${attempt}/${maxRetries}) status=${status} timeout=${isTimeout}`)
        if (!shouldRetry || attempt >= maxRetries) break
        const backoffMs = 500 * Math.pow(2, attempt - 1)
        console.log(`재시도 대기 ${backoffMs}ms 후 재요청`)
        await new Promise(r => setTimeout(r, backoffMs))
      }
    }

    console.log('========== 상세 API 에러 정보 =========')
    console.error('최종 실패:', lastError?.message)
    console.error('에러 코드:', lastError?.code)
    console.error('응답 상태:', lastError?.response?.status)
    console.error('전체 에러 객체:', lastError)
    console.log('=====================================')
    throw lastError
  }

  const handleItemClick = async (item) => {
    if (detailLoadingId) return
    setDetailError('')
    setDetailFallbackLink('')
    console.log('선택된 아이템:', item)
    if (!item?.servId) {
      console.warn('servId가 없어 상세 조회를 수행할 수 없습니다.')
      return
    }

    try {
      setDetailLoadingId(item.servId)
      setModalLoading(true)
      setIsModalOpen(true) // 모달을 먼저 열고 로딩 상태 표시
      
             const result = await requestWelfareDetail(item.servId)
       
       // null 값 처리: 모든 필드가 null인 경우 기본값 설정
       const processedData = {
         ...result,
         title: result.title || '제목 정보 없음',
         provider: result.provider || '제공기관 정보 없음',
         targetsDetail: result.targetsDetail || '지원대상 정보 없음',
         benefitContent: result.benefitContent || '지원내용 정보 없음',
         criteria: result.criteria || '지원기준 정보 없음',
         supportCycle: result.supportCycle || '지원주기 정보 없음',
         contacts: result.contacts || [],
         siteLinks: result.siteLinks || []
       }
       
       console.log('처리된 데이터:', processedData)
       setDetailData(processedData)
    } catch (err) {
      const raw = err?.response?.data
      const msg = typeof raw === 'string' && raw.includes('UnrecognizedPropertyException')
        ? '상세 응답 형식과 백엔드 DTO가 달라 처리에 실패했습니다. (백엔드 수정 필요)'
        : '상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도하세요.'
      setDetailError(msg)
      if (item.link) {
        setDetailFallbackLink(item.link)
      }
      setIsModalOpen(false) // 에러 시 모달 닫기
    } finally {
      setDetailLoadingId(null)
      setModalLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/personal-info')
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

  if (error) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen flex justify-center">
        <div className="w-[768px] h-[1080px] bg-white flex flex-col relative">
          <div className="w-full h-[90px] flex items-center px-7 shadow-md">
            <h1 className="text-2xl font-normal text-black">Well-Link</h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xl text-red-600">{error}</div>
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
        <div className="flex-1 flex flex-col px-8 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-black">리스트 조회</h2>
            <div className="w-full h-[2px] bg-blue-500 mt-2"></div>
          </div>

          {detailError && (
            <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm flex items-center justify-between">
              <span>{detailError}</span>
              {detailFallbackLink && (
                <button
                  onClick={() => window.open(detailFallbackLink, '_blank', 'noopener,noreferrer')}
                  className="ml-3 px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-sm"
                >
                  외부 링크 열기
                </button>
              )}
            </div>
          )}
          
          {/* Items Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {pagedItems.map((item, index) => (
                <div
                  key={item.servId || `${startIndex + index}`}
                  onClick={() => handleItemClick(item)}
                  className={`bg-gray-100 rounded-lg p-4 cursor-pointer transition-colors min-h-[120px] flex flex-col ${detailLoadingId === item.servId ? 'opacity-60' : 'hover:bg-gray-200'}`}
                >
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 flex-1 line-clamp-3">
                    {item.summary}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {item.lifeArray && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {item.lifeArray}
                      </span>
                    )}
                    {item.interests && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {item.interests}
                      </span>
                    )}
                    {item.targets && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                        {item.targets}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {welfareItems.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-gray-400 text-lg mb-2">검색 결과가 없습니다</div>
                  <div className="text-gray-500 text-sm">다른 조건으로 검색해보세요</div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {welfareItems.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 select-none">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded border ${currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 hover:bg-gray-50 border-gray-300'}`}
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-9 h-9 rounded border text-sm font-medium ${
                    num === currentPage
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded border ${currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-700 hover:bg-gray-50 border-gray-300'}`}
              >
                다음
              </button>
            </div>
          )}
          
          {/* My Page and Back Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate('/mypage')}
              className="w-full h-[60px] bg-blue-500 text-white text-xl font-semibold rounded-[10px] hover:bg-blue-600 transition-colors"
            >
              마이 페이지로 이동
            </button>
            <button
              onClick={handleBack}
              className="w-full h-[60px] bg-gray-400 text-white text-xl font-semibold rounded-[10px] hover:bg-gray-500 transition-colors"
            >
              이전
            </button>
          </div>
        </div>
      </div>
      {/* 상세 정보 모달 */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        detailData={detailData}
        loading={modalLoading}
        welfareItems={welfareItems}
      />
    </div>
  )
}

export default WelfareList
