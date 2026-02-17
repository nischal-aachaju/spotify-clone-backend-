import React, { useContext } from 'react'
import { ApiDataContext } from './context/ContextApi'
import Login from './pages/Login';
const App = () => {
  const data=useContext(ApiDataContext)
  console.log(data);
  
  return (
    <div>
      <Login/>
    </div>
  )
}

export default App
