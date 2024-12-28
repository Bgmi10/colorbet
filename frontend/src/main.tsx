import { createRoot } from 'react-dom/client'
//@ts-ignore
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import ThemeProvider from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <>
  <ThemeProvider>
   <AuthProvider>
     <App />
    </AuthProvider>
    </ThemeProvider>
  </>

  )
