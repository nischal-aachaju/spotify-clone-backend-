import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ContextApi from './context/ContextApi.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ContextApi>
      <App />
  </ContextApi>,
)
