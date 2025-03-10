import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from 'react-router-dom';
import Start from './pages/Start.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter> 
     <Routes>
  <Route path="/" element={<App />}> 
      <Route index element={<Start />} /> 

  </Route>
      </Routes>
    </BrowserRouter> 
  </StrictMode>,
)
