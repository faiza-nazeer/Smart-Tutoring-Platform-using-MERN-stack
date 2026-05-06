// main.tsx
// index.css is imported HERE once — this makes all global styles
// (navbar, buttons, reset, variables) available to the entire app.
// You never need to import index.css anywhere else.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'   // ← global styles loaded once for the whole app
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)