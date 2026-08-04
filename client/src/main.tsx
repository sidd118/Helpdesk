import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from './components/ThemeProvider.tsx'
import { applyTheme, getStoredTheme, resolveTheme } from './lib/theme.ts'
import App from './App.tsx'
import './index.css'

// Runs before the first render so the page never paints the wrong theme.
applyTheme(resolveTheme(getStoredTheme()))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
