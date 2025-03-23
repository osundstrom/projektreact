import { useState, useEffect } from "react";
//import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Review } from "../models/review";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "../css/Profil.css"
import RateBook from "../components/Grade"
import { useAllCookies } from "../components/AllCookie";

const Profile = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchBox, setSearchBox] = useState<string>("");
  const [searchedReviews, setSearchedReviews] = useState<Review[]>([]);
  
  
  const navigate = useNavigate();

  const { token, userId, username, role } = useAllCookies(); //från context


  useEffect(() => {
    if (!token) { //om ingen token
      navigate("/login");
      return
    }else if(!userId) {//om inget uderId
      navigate("/login")
      return;
    }
//--------------------------------Fetch reviews--------------------------------------------------//
    const fetchReviews = async () => {
      setLoading(true);//laddar

      try {
        let url = ""
        if (role === "admin") { //om role är admin
        url = "https://projektreactbackend.onrender.com/reviews"; 
        }
        if (role === "user") { //om role är user
        url = `https://projektreactbackend.onrender.com/reviews/user/${userId}`; 
        }
        if(url) { //om url finns, fetch
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, //skickar med token
          },
        });
        const data = await response.json();
        if (!response.ok) { //om ej ok
          throw new Error(data.error);
        }
        
        setReviews(data) 
        setSearchedReviews(data);


        document.title = `${username} - ${role}`; //title
        console.log(data)
      }
      } catch (error: any) {
        console.log(error)
      }
      setLoading(false); //slutar ladda
    };

    fetchReviews();
  }, [userId, username, token, navigate, role]); //uppdaterar när 

//-------------------------------------Sök, efter titel eller användare endast--------------------------------------//
const searchForm = (e: React.ChangeEvent<HTMLInputElement>) => {
  const searchTerm = e.target.value.toLowerCase(); //små bokstäver
  setSearchBox(searchTerm) //uppdatera baserat på de man söker

  const filtered = reviews.filter((review) => { //filterar på sökning
    return (
      review.title.toLowerCase().includes(searchTerm) || //titel
      review.username.toLowerCase().includes(searchTerm) //användare
    );
  });
  setSearchedReviews(filtered);
}

//---------------------------------------Return---------------------------------------------//
  return (
    <div className="container" id="fullDivProfile">

      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Laddar...</span>
        </div>
      )}
      {/* Titel, olika admin och user*/}
      <h3 className="mb-4 d-flex justify-content-center">{role === "admin" ? "Alla recensioner" : "Dina recensioner"}</h3>

      {/* Sökruta för admin */}
      {role === "admin" && (
        <div className="container">
          
        <form className="mb-4 d-flex justify-content-center">
        <input
          type="text"
          placeholder="Sök efter bokens titel eller användare"
          value={searchBox}
          onChange={searchForm}
          className="form-control w-50"
        />
        <button type="submit" className="btn btn-primary ms-2">Sök</button>
      </form>
      </div>
      )}


      <div className="reviews">
        {searchedReviews.length < 1 ?(
          <p className="container d-flex justify-content-center">{role === "admin" ? "Inga recensioner finns." : "Du har inte lämnat några recensioner ännu."}</p>
        ) : (

          searchedReviews.map((review, index) => (
            
            <div key={index} className="review-card">
              <h4>{review.title}</h4>
              <p>{review.content}</p>
              <p className="d-flex align-items-center"><strong>Betyg: </strong>
              <span className="ms-2">
              <RateBook grade={review.grade} setGrade={() => {}} />
              </span>
              </p>

              {role === "admin" && (
                <p><strong>Användare: </strong>{review.username}</p>
              )}

              {/*Redigera*/}
              
                <button
                onClick={() => navigate(`/edit/${review._id}`)}
                className="btn btn-warning"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              
              
              
              
              
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
