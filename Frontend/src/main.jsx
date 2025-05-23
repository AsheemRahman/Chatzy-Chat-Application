import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner'
import { SocketProvider } from './context/socketContext'


createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <StrictMode>
      <App />
      <Toaster closeButton />
    </StrictMode>,
  </SocketProvider>
)
