
import { Link } from 'react-router-dom';
import "../css/Header.css";



function Header({ setCategory }: { setCategory: (category: string) => void }) {

  const CategoryChoose = (category: string) => {
    setCategory(category) };
//----------------------------------Return-----------------------------------------//

    return (
        <>
                <div className="container">
                
                    <Link to="/">
                        <img src="/bokkollen.png" alt="Logo" width="35%" height="fit-content" />
                    </Link>
                
                

            <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">

        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">Start</Link>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="#">Betyg</a>
        </li>

        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Kategorier
          </a>
          
          <ul className="dropdown-menu">
          <li><a className="dropdown-item" onClick={() => CategoryChoose("Sci-fi")}>Sci-fi</a></li>
                    <li><a className="dropdown-item" onClick={() => CategoryChoose("Romance")}>Romantik</a></li>
                    <li><a className="dropdown-item" onClick={() => CategoryChoose("Scary")}>Skräck</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
</div>
            </>
    );
}

export default Header;