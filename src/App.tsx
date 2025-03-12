import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import Start from './pages/Start.tsx';
import OneBook from './pages/OneBook.tsx';
import './index.css';
import { useState } from "react";



function App() {
  const [category, setCategory] = useState('sci-fi');


  return (
    <>
      <Header setCategory={setCategory} />
      <Routes>
        <Route path="/" element={<Start category={category}/>}/>
        <Route path="/books/:bookId" element={<OneBook />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
