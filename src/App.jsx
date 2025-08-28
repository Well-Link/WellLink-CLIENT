import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GetStart from './components/GetStart'
import PersonalInfo from './components/PersonalInfo'
import WelfareList from './components/WelfareList'
import MyPage from './components/MyPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStart />} />
        <Route path="/personal-info" element={<PersonalInfo />} />
        <Route path="/welfare-list" element={<WelfareList />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  )
}

export default App
