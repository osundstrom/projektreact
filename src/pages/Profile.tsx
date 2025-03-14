import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Review } from "../models/review";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "../css/Profil.css"
import RateBook from "../components/Grade"

const Profile = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");

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
        const response = await fetch(`http://localhost:3000/reviews/user/${userId}`, {
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
        document.title = `Profil: ${data[0].username}`;
        console.log(data)
  
      } catch (error: any) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [userId, token, navigate,]);

//---------------------------------------------------------------------------//


//------------------------------------------------------------------------------------//
  return (
    <div className="container">

      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Laddar...</span>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>Dina recensioner</h3>
      <div className="reviews">
        {reviews.length < 1 ?(
          <p>Du har inte lämnat några recensioner ännu</p>
        ) : (

          reviews.map((review, index) => (
            
            <div key={index} className="review-card">
              <h4>{review.title}</h4>
              <p>{review.content}</p>
              <p className="d-flex align-items-center"><strong>Betyg: </strong>
              <span className="ms-2">
              <RateBook grade={review.grade} setGrade={() => {}} />
              </span>
              </p>

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
