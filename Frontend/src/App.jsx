import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApiDataContext } from './context/ContextApi'
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Artist from './pages/Artist';
const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/artist" element={<Artist /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
