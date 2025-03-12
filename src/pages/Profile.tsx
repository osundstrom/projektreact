import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Review } from "../models/review";

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
  }, [userId, token, navigate]);

  return (
    <div className="container">

      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Laddar...</span>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="reviews">
        {reviews.length < 1 ? (
          <p>Du har inte skrivit några recensioner ännu</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <h2>{review.username}</h2>
              <h5>{review.bookId}</h5>
              <p>{review.content}</p>
              <p><strong>Betyg: </strong>{review.grade}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
