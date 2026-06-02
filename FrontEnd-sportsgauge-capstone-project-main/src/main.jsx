import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { CoachProvider } from './context/CoachContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './components/Toast.jsx'
import './index.css'

const initialTheme = (() => {
  try {
    const t = localStorage.getItem('sportsgauge_theme');
    return t === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
})();
document.documentElement.classList.add(initialTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <CoachProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
          </CoachProvider>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)