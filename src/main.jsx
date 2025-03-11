import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/authContext.jsx'
import { ThemeProvider } from "@/contexts/theme-context";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider storageKey="theme">
      <AuthProvider>
        <App />
      </AuthProvider>,
    </ThemeProvider>
  </StrictMode>,
)
