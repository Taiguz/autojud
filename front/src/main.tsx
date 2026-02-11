import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const normalizedBase = import.meta.env.BASE_URL.replace(/\/$/, '')

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename='/autojud'>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
