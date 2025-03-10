import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Header from './components/Header';
import { Outlet } from "react-router-dom";
import './index.css';


function App() {
  

  return (
    <>
      <Header/>
      <Outlet/>
      <Footer />
    </>
  )
}

export default App
