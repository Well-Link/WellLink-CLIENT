import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS, createApiUrl } from '../config/api'

function PersonalInfo() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    age: '',
    interests: [], // 복수 선택 가능
    targets: [] // 복수 선택 가능
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // 체크박스 변경 핸들러 (복수 선택용)
  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [fieldName]: checked 
        ? [...prev[fieldName], value]
        : prev[fieldName].filter(item => item !== value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 유효성 검사
    if (formData.interests.length === 0) {
      setError('관심분야를 최소 1개 이상 선택해주세요.')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // API 호출을 위한 파라미터 설정
      const params = {
        age: formData.age,
        interests: formData.interests.join(','), // 배열을 쉼표로 구분된 문자열로 변환
        targets: formData.targets.join(','), // 배열을 쉼표로 구분된 문자열로 변환
        pageNo: 1,
        numOfRows: 10
      }
      
      // 요청 정보 콘솔에 출력
      console.log('========== API 요청 정보 ==========')
      console.log('메서드: GET')
      console.log('엔드포인트: /health/welfare-list')
      console.log('파라미터:', params)
      
      // 실제 요청 URL 생성 및 출력
      const queryString = new URLSearchParams(params).toString()
      const fullUrl = `/health/welfare-list?${queryString}`
      console.log('전체 요청 URL:', fullUrl)
      console.log('===================================')
      
      // API 호출
      const response = await axios.get(createApiUrl(API_ENDPOINTS.health.welfareList), {
        params: params,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('========== API 응답 정보 ==========')
      console.log('상태 코드:', response.status)
      console.log('응답 데이터:', response.data)
      console.log('===================================')
      
      // 응답 아이템 로컬스토리지 저장
      try {
        const items = Array.isArray(response.data?.items) ? response.data.items : []
        localStorage.setItem('welfareItems', JSON.stringify(items))
        localStorage.setItem('welfareLastParams', JSON.stringify(params))
        console.log(`✅ 로컬스토리지 저장: welfareItems(${items.length}개), welfareLastParams`)
      } catch (storageErr) {
        console.warn('로컬스토리지 저장 실패:', storageErr)
      }
      
      // 성공 시 결과 페이지로 이동
      navigate('/welfare-list', { 
        state: { 
          apiParams: params,
          data: response.data 
        } 
      })
      
    } catch (err) {
      console.log('========== API 에러 정보 ==========')
      console.error('에러 발생:', err.message)
      console.error('에러 코드:', err.code)
      console.error('응답 상태:', err.response?.status)
      console.error('전체 에러 객체:', err)
      console.log('===================================')
      
      setError('복지 정보를 불러오는데 실패했습니다. 다시 시도해주세요.')
      
      // 개발 중 임시로 결과 페이지로 이동 (API 연결 전)
      if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
        console.log('⚠️ 개발 모드: API 서버 연결 실패')
        
        // 전송하려던 URL 다시 표시
        const queryString = new URLSearchParams({
          age: formData.age,
          interests: formData.interests.join(','),
          targets: formData.targets.join(','),
          pageNo: 1,
          numOfRows: 10
        }).toString()
        console.log('시도한 요청 URL:', `/health/welfare-list?${queryString}`)
        
        navigate('/welfare-list', { 
          state: { 
            apiParams: {
              age: formData.age,
              interests: formData.interests.join(','),
              targets: formData.targets.join(','),
              pageNo: 1,
              numOfRows: 10
            },
            data: null // 실제 데이터 없음
          } 
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F9FAFB] h-screen flex justify-center">
      <div className="w-full max-w-[768px] h-full bg-white flex flex-col relative">
        {/* Header */}
        <div className="w-full h-[90px] flex items-center px-7 shadow-md">
          <h1 className="text-2xl font-normal text-black">Well-Link</h1>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col px-12 py-8">
          <h2 className="text-3xl font-medium text-black mb-8">
            복지 정보 검색
          </h2>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="space-y-6">
              {/* 나이 */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  나이
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 25"
                  min="1"
                  max="120"
                  required
                />
              </div>

              {/* 관심분야 */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  관심분야 (복수 선택 가능)
                </label>
                <div className="grid grid-cols-2 gap-3 p-4 border border-gray-300 rounded-lg">
                  {['교육', '일자리', '주거', '신체건강', '정신건강', '생활지원', '문화여가', '안전위기'].map(interest => (
                    <label key={interest} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={(e) => handleCheckboxChange(e, 'interests')}
                        className="mr-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-base">{interest}</span>
                    </label>
                  ))}
                </div>
                {formData.interests.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">최소 1개 이상 선택해주세요</p>
                )}
              </div>

              {/* 대상자 유형 */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  대상자 유형 (선택사항, 복수 선택 가능)
                </label>
                <div className="grid grid-cols-2 gap-3 p-4 border border-gray-300 rounded-lg">
                  {[
                    { value: '저소득', label: '저소득' },
                    { value: '장애인', label: '장애인' },
                    { value: '한부모조손', label: '한부모/조손' },
                    { value: '다문화탈북민', label: '다문화/탈북민' },
                    { value: '다자녀', label: '다자녀' },
                    { value: '보훈', label: '보훈' }
                  ].map(target => (
                    <label key={target.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        value={target.value}
                        checked={formData.targets.includes(target.value)}
                        onChange={(e) => handleCheckboxChange(e, 'targets')}
                        className="mr-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-base">{target.label}</span>
                    </label>
                  ))}
                </div>
                {formData.targets.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">선택하지 않으면 모든 대상자 유형이 검색됩니다</p>
                )}
              </div>


            </div>

            {/* Buttons */}
            <div className="mt-[20px]">
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-[75px] text-white text-2xl font-semibold rounded-[10px] transition-colors mb-[15px] ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                }`}
              >
                {loading ? '검색 중...' : '다음'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={loading}
                className={`w-full h-[75px] text-white text-2xl font-semibold rounded-[10px] transition-colors ${
                  loading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                이전
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfo
