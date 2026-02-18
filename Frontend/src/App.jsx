import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApiDataContext } from './context/ContextApi'
import Login from './pages/Login';
import HomePage from './pages/HomePage';
const App = () => {
  const data=useContext(ApiDataContext)
  console.log(data);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
