import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Review } from "../models/review";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "../css/Profil.css"
import RateBook from "../components/Grade"

const Profile = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchBox, setSearchBox] = useState<string>("");
  const [searchedReviews, setSearchedReviews] = useState<Review[]>([]);
  

  const navigate = useNavigate();
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");
  const role = Cookies.get("role"); 
  const username = Cookies.get("username"); 
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return
    }else if(!userId) {
      navigate("/login")
      return;
    }

    const fetchReviews = async () => {
      setLoading(true);
      try {
        let url = ""
        if (role === "admin") {
        url = "http://localhost:3000/reviews"; 
        }
        if (role === "user") {
        url = `http://localhost:3000/reviews/user/${userId}`; 
        }
        if(url) {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        
        setReviews(data) 
        setSearchedReviews(data);


        document.title = `${username} - ${role}`;
        console.log(data)
      }
      } catch (error: any) {
        console.log(error)
      }
      setLoading(false);
    };

    fetchReviews();
  }, [userId, token, navigate, role]);

//---------------------------------------------------------------------------//
const searchForm = (e: React.ChangeEvent<HTMLInputElement>) => {
  const searchTerm = e.target.value.toLowerCase();
  setSearchBox(searchTerm)
  const filtered = reviews.filter((review) => {
    return (
      review.title.toLowerCase().includes(searchTerm) || 
      review.username.toLowerCase().includes(searchTerm)
    );
  });
  setSearchedReviews(filtered);
}

//------------------------------------------------------------------------------------//
  return (
    <div className="container" id="fullDivProfile">

      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Laddar...</span>
        </div>
      )}
      <h3 className="mb-4 d-flex justify-content-center">{role === "admin" ? "Alla recensioner" : "Dina recensioner"}</h3>

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
          <p>{role === "admin" ? "Inga recensioner finns." : "Du har inte lämnat några recensioner ännu."}</p>
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
