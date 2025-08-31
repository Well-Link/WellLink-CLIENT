import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function BookmarkDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const [bookmarkData, setBookmarkData] = useState(null)
  const [welfareItemData, setWelfareItemData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    try {
      // location.state에서 전달받은 데이터 확인
      if (location.state?.bookmarkData) {
        setBookmarkData(location.state.bookmarkData)
      }

      // welfareBookmarkItems에서 해당 servId의 데이터 찾기
      const storedWelfareItems = localStorage.getItem('welfareBookmarkItems')
      if (storedWelfareItems) {
        const parsedWelfareItems = JSON.parse(storedWelfareItems)
        const servId = location.state?.bookmarkData?.servId
        
        if (servId) {
          const matchingItem = parsedWelfareItems.find(item => item.servId === servId)
          if (matchingItem) {
            setWelfareItemData(matchingItem)
          }
        }
      }

      // Todo 리스트 로드
      loadTodos()
    } catch (error) {
      console.error('북마크 상세 정보 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }, [location.state])

  // Todo 리스트 로드 함수
  const loadTodos = () => {
    try {
      const servId = location.state?.bookmarkData?.servId
      if (servId) {
        const storedTodos = localStorage.getItem(`todos_${servId}`)
        if (storedTodos) {
          const parsedTodos = JSON.parse(storedTodos)
          setTodos(parsedTodos)
        }
      }
    } catch (error) {
      console.error('Todo 로드 오류:', error)
    }
  }

  // Todo 리스트 저장 함수
  const saveTodos = (newTodos) => {
    try {
      const servId = location.state?.bookmarkData?.servId
      if (servId) {
        localStorage.setItem(`todos_${servId}`, JSON.stringify(newTodos))
      }
    } catch (error) {
      console.error('Todo 저장 오류:', error)
    }
  }

  const handleExternalLink = () => {
    if (welfareItemData?.link) {
      window.open(welfareItemData.link, '_blank', 'noopener,noreferrer')
    } else {
      alert('외부 링크가 없습니다.')
    }
  }

  const handleRemoveBookmark = () => {
    const isConfirmed = window.confirm('북마크를 제거하시겠습니까?')
    
    if (!isConfirmed) return
    
    try {
      const servId = bookmarkData?.servId
      if (!servId) return

      // welfareBookmarks에서 제거
      const existingBookmarks = JSON.parse(localStorage.getItem('welfareBookmarks') || '[]')
      const updatedBookmarks = existingBookmarks.filter(bookmark => bookmark.servId !== servId)
      localStorage.setItem('welfareBookmarks', JSON.stringify(updatedBookmarks))

      // welfareBookmarkItems에서 제거
      const existingBookmarkItems = JSON.parse(localStorage.getItem('welfareBookmarkItems') || '[]')
      const updatedBookmarkItems = existingBookmarkItems.filter(item => item.servId !== servId)
      localStorage.setItem('welfareBookmarkItems', JSON.stringify(updatedBookmarkItems))

      alert('북마크가 제거되었습니다.')
      navigate('/mypage')
    } catch (error) {
      console.error('북마크 제거 오류:', error)
      alert('북마크 제거에 실패했습니다.')
    }
  }

  // Todo 추가 함수
  const handleAddTodo = () => {
    if (newTodo.trim() === '') return
    
    const newTodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    const updatedTodos = [...todos, newTodoItem]
    setTodos(updatedTodos)
    saveTodos(updatedTodos)
    setNewTodo('')
  }

  // Todo 완료/미완료 토글 함수
  const handleToggleTodo = (todoId) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    )
    setTodos(updatedTodos)
    saveTodos(updatedTodos)
  }

  // Todo 삭제 함수
  const handleDeleteTodo = (todoId) => {
    const isConfirmed = window.confirm('이 할 일을 삭제하시겠습니까?')
    if (!isConfirmed) return
    
    const updatedTodos = todos.filter(todo => todo.id !== todoId)
    setTodos(updatedTodos)
    saveTodos(updatedTodos)
  }

  // Todo 수정 시작 함수
  const handleStartEdit = (todo) => {
    setEditingTodoId(todo.id)
    setEditingText(todo.text)
  }

  // Todo 수정 완료 함수
  const handleFinishEdit = () => {
    if (editingText.trim() === '') return
    
    const updatedTodos = todos.map(todo => 
      todo.id === editingTodoId ? { ...todo, text: editingText.trim() } : todo
    )
    setTodos(updatedTodos)
    saveTodos(updatedTodos)
    setEditingTodoId(null)
    setEditingText('')
  }

  // Todo 수정 취소 함수
  const handleCancelEdit = () => {
    setEditingTodoId(null)
    setEditingText('')
  }

  const handleViewReviews = () => {
    // 리뷰 페이지로 이동
    navigate('/reviews', { 
      state: { 
        servId: bookmarkData?.servId,
        title: bookmarkData?.title,
        provider: bookmarkData?.provider
      }
    })
  }

  const handleBack = () => {
    navigate('/mypage')
  }

  if (loading) {
    return (
      <div className="bg-[#F9FAFB] h-screen flex justify-center">
        <div className="w-full max-w-[768px] h-full bg-white flex flex-col relative">
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

  if (!bookmarkData) {
    return (
      <div className="bg-[#F9FAFB] h-screen flex justify-center">
        <div className="w-full max-w-[768px] h-full bg-white flex flex-col relative">
          <div className="w-full h-[90px] flex items-center px-7 shadow-md">
            <h1 className="text-2xl font-normal text-black">Well-Link</h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl text-red-600 mb-4">북마크 정보를 찾을 수 없습니다</div>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                마이페이지로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F9FAFB] h-screen flex justify-center">
      <div className="w-full max-w-[768px] h-full bg-white flex flex-col relative">
        {/* Header */}
        <div className="w-full h-[90px] flex items-center px-7 shadow-md">
          <h1 className="text-2xl font-normal text-black">Well-Link</h1>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-black">북마크 상세 정보</h2>
            <div className="w-full h-[2px] bg-blue-500 mt-2"></div>
          </div>

          {/* Bookmark Detail Content */}
          <div className="flex-1 space-y-6">
            {/* 서비스 제목 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">서비스명</h3>
              <p className="text-gray-700 leading-relaxed">
                {bookmarkData.title || '제목 정보가 없습니다'}
              </p>
            </div>
            
            {/* 제공기관 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">제공기관</h3>
              <p className="text-gray-700">
                {bookmarkData.provider || '제공기관 정보가 없습니다'}
              </p>
            </div>
            
            {/* 지원대상 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">지원대상</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {bookmarkData.targetsDetail || '지원대상 정보가 없습니다'}
                </p>
              </div>
            </div>
            
            {/* 지원내용 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">지원내용</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {bookmarkData.benefitContent || '지원내용 정보가 없습니다'}
                </p>
              </div>
            </div>
            
            {/* 지원기준 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">지원기준</h3>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {bookmarkData.criteria || '지원기준 정보가 없습니다'}
                </p>
              </div>
            </div>
            
            {/* 지원주기 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">지원주기</h3>
              <p className="text-gray-700">
                {bookmarkData.supportCycle || '지원주기 정보가 없습니다'}
              </p>
            </div>

            {/* 연락처 */}
            {bookmarkData.contacts && bookmarkData.contacts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">연락처</h3>
                <div className="flex flex-wrap gap-2">
                  {bookmarkData.contacts.map((contact, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {contact}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* 사이트 링크 */}
            {bookmarkData.siteLinks && bookmarkData.siteLinks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">관련 사이트</h3>
                <div className="space-y-2">
                  {bookmarkData.siteLinks.map((link, index) => (
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

            {/* 북마크 저장일 */}
            {bookmarkData.bookmarkedAt && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">북마크 저장일</h3>
                <p className="text-gray-700">
                  {new Date(bookmarkData.bookmarkedAt).toLocaleString()}
                </p>
              </div>
            )}

            {/* Todo 리스트 섹션 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">체크리스트</h3>
              
              {/* Todo 추가 폼 */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  placeholder="할 일을 입력하세요..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddTodo}
                  disabled={newTodo.trim() === ''}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  추가
                </button>
              </div>

              {/* Todo 리스트 */}
              <div className="space-y-2">
                {todos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>아직 할 일이 없습니다.</p>
                    <p className="text-sm">위에 할 일을 추가해보세요!</p>
                  </div>
                ) : (
                  todos.map((todo) => (
                    <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {/* 체크박스 */}
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      
                      {/* Todo 텍스트 */}
                      <div className="flex-1">
                        {editingTodoId === todo.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleFinishEdit()}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={handleFinishEdit}
                              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              완료
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <span 
                            className={`${
                              todo.completed 
                                ? 'line-through text-gray-500' 
                                : 'text-gray-800'
                            }`}
                          >
                            {todo.text}
                          </span>
                        )}
                      </div>
                      
                      {/* 액션 버튼들 */}
                      {editingTodoId !== todo.id && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStartEdit(todo)}
                            className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Todo 통계 */}
              {todos.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>전체: {todos.length}개</span>
                    <span>완료: {todos.filter(todo => todo.completed).length}개</span>
                    <span>미완료: {todos.filter(todo => !todo.completed).length}개</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${todos.length > 0 ? (todos.filter(todo => todo.completed).length / todos.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

                     {/* Action Buttons */}
           <div className="mt-6 space-y-3">
             {/* 외부 링크 버튼 */}
             {welfareItemData?.link && (
               <button
                 onClick={handleExternalLink}
                 className="w-full h-[60px] bg-green-500 text-white text-xl font-semibold rounded-[10px] hover:bg-green-600 transition-colors"
               >
                 외부 사이트로 이동
               </button>
             )}
             
             {/* 리뷰 보기 버튼 */}
             <button
               onClick={handleViewReviews}
               className="w-full h-[60px] bg-purple-500 text-white text-xl font-semibold rounded-[10px] hover:bg-purple-600 transition-colors"
             >
               리뷰 보기
             </button>
             
             {/* 북마크 제거 버튼 */}
             <button
               onClick={handleRemoveBookmark}
               className="w-full h-[60px] bg-red-500 text-white text-xl font-semibold rounded-[10px] hover:bg-red-600 transition-colors"
             >
               북마크 제거
             </button>
            
            {/* 뒤로가기 버튼 */}
            <button
              onClick={handleBack}
              className="w-full h-[60px] bg-gray-400 text-white text-xl font-semibold rounded-[10px] hover:bg-gray-500 transition-colors"
            >
              마이페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookmarkDetail
