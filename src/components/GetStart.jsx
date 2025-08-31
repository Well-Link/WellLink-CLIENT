import React from 'react'
import { useNavigate } from 'react-router-dom'

function GetStart() {
  const navigate = useNavigate()
  
  const handleStart = () => {
    navigate('/personal-info')
  }
  
  const handleMyPage = () => {
    // 마이페이지 라우트가 추가되면 여기에 경로를 설정
    navigate('/mypage')
  }
  
  return (
    <div className="bg-[#F9FAFB] h-screen flex justify-center">
      <div className="w-full max-w-[768px] h-full bg-white flex flex-col relative">
        {/* Header */}
        <div className="w-full h-[90px] flex items-center px-7 shadow-md">
          <h1 className="text-2xl font-normal text-black">Well-Link</h1>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center relative">
          {/* Title positioned absolutely */}
          <h2 className="text-4xl font-medium text-black text-center leading-[43px] mt-[168px]">
            나에게 필요한 복지 혜택을<br />
            찾아보세요!
          </h2>
          
          {/* Buttons positioned at bottom */}
          <div className="absolute bottom-[81px] w-full flex flex-col items-center px-[94px]">
            <button 
              onClick={handleStart}
              className="w-[580px] h-[75px] bg-[#2563eb] text-white text-2xl font-semibold rounded-[10px] hover:bg-[#1d4ed8] transition-colors mb-[15px]"
            >
              지금 시작하기
            </button>
            <button 
              onClick={handleMyPage}
              className="w-[580px] h-[75px] bg-[#3b82f6] text-white text-2xl font-semibold rounded-[10px] hover:bg-[#2563eb] transition-colors"
            >
              마이 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GetStart
