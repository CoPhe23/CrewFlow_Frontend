import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from '../pages/login'
import { Register } from '../pages/Register'
import Home from '../pages/Home'
import EventPage from '../pages/EventPage'
import SchedulePage from '../pages/SchedulePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/event/:id" element={<EventPage/>} />
      <Route path="/event/:id/schedule" element={<SchedulePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
