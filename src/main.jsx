import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Header } from '../components/Header.jsx'
import { Context } from '../store/store.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Context>
      <Header/>
      <App />
      </Context>
    </BrowserRouter>
  </StrictMode>,
)
