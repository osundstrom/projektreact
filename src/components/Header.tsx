
import { Link, useNavigate } from 'react-router-dom';
import "../css/Header.css";
//import Cookies from 'js-cookie';
import { useAllCookies } from '../components/AllCookie'; 



function Header({ setCategory }: { setCategory: (category: string) => void }) {
  const navigate = useNavigate();
  const { token, username, logout} = useAllCookies();
  
   
    const Logout = () => {
      
      logout();  
      navigate("/");
    };


  const CategoryChoose = (category: string) => {
    setCategory(category) 
    navigate("/");
  };
//----------------------------------Return-----------------------------------------//

    return (
        <>
                <div className="container-fluid">
                
                    <Link to="/">
                        <img src="/bokkollen.png" alt="Logo" width="35%" height="fit-content" onClick={() => CategoryChoose("a")} />
                    </Link>
                    {username ? (
                  <p onClick={() => navigate("/profil")} className="loggedInP">Inloggad som: <span className="spanLoggedIn">{username}</span> </p>
                    ): (
                      <span className="loggedInP"></span>
                    )}

        <nav className="navbar bg-primary navbar-expand-lg" data-bs-theme="dark">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">

        <li className="nav-item">
          <Link className="nav-link active" onClick={() => CategoryChoose("a")} aria-current="page" to="/">Start</Link>
        </li>

        <li className="nav-item dropdown">
          <a className="nav-link active dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Kategorier
          </a>
          
          <ul className="dropdown-menu">
          <li><a className="dropdown-item" onClick={() => CategoryChoose("Sci-fi")}>Sci-fi</a></li>
          <li><a className="dropdown-item" onClick={() => CategoryChoose("Romance")}>Romantik</a></li>
          <li><a className="dropdown-item" onClick={() => CategoryChoose("Scary")}>Skräck</a></li>
          </ul>
        </li>
      </ul>


      {/* om token finns */}
      {token ? (
                
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link active" to="/profil">
                      Profil
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link active btn btn-link" onClick={Logout}>
                      Logga ut
                    </button>
                  </li>
                </ul>
              ) : (
               
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link active btn-success" to="/login">
                      Logga in
                    </Link>
                  </li>
                </ul>
              )}
      
    </div>
    
  </div>
  
</nav>

</div>
            </>
    );
}

export default Header;