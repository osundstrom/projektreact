import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import Start from './pages/Start.tsx';
import OneBook from './pages/OneBook.tsx';
import './index.css';
import { useState } from "react";
import Profile from "./pages/Profile.tsx";
import Login from "./pages/Login.tsx";




function App() {
  const [category, setCategory] = useState('');


  return (
    <>
      <Header setCategory={setCategory} />
      <Routes>
        <Route path="/" element={<Start category={category}/>}/>
        <Route path="/books/:bookId" element={<OneBook />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/profil" element={<Profile/>}/>
      </Routes>
      <Footer />
    </>
  )
}

export default App
