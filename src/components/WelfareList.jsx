import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

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

  useEffect(() => {
    try {
      if (location.state?.data?.items) {
        setWelfareItems(location.state.data.items)
        // 캐시 유지: localStorage 삭제하지 않음
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
      await requestWelfareDetail(item.servId)
    } catch (err) {
      const raw = err?.response?.data
      const msg = typeof raw === 'string' && raw.includes('UnrecognizedPropertyException')
        ? '상세 응답 형식과 백엔드 DTO가 달라 처리에 실패했습니다. (백엔드 수정 필요)'
        : '상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도하세요.'
      setDetailError(msg)
      if (item.link) {
        setDetailFallbackLink(item.link)
      }
    } finally {
      setDetailLoadingId(null)
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

export default WelfareList
