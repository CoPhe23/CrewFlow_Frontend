import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import { Login } from '../pages/login'

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login/>} />
    </Routes>
  )
}

export default App
