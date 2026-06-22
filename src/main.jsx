import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './i18n/index.js'
import './fonts.css' // self-hosted fonts (no Google CDN — GDPR)
import './index.css'
import { initTheme } from './lib/theme.js'

initTheme()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
