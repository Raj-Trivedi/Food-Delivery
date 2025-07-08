import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import App from './App.jsx'
import StoreContextProvider from './Context/StoreContext.jsx'
import AppContextProvider from './Context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </AppContextProvider>
  </BrowserRouter>
)
