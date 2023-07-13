import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './app/styles/styles.css'
import { AuthContextProvider } from './context/AuthContext'

createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
)
