import React from 'react'
import App from './src/App.jsx'
import { createRoot } from 'react-dom/client'
import './src/index.css'

createRoot(document.getElementById('app')).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(App)
  )
)