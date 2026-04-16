import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import { Login } from '../pages/login'
import { Register } from '../pages/Register'
import Home from '../pages/Home'

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/home" element={<Home/>} />
    </Routes>
  )
}

export default App
