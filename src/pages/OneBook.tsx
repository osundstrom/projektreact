import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Book } from "../models/book";
import { Review } from "../models/review";
//import Cookies from "js-cookie";
import "../css/OneBook.css"
import RateBook from "../components/Grade";
import { useAllCookies } from "../components/AllCookie";

const OneBook = () => {
  
  const { bookId } = useParams();
  console.log(bookId)
  const [book, setBook] = useState<Book | null>(null);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReviewed, setUserReviewed] = useState<boolean>(false);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [userGrade, setUserGrade] = useState<number | null>(null);
  

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { token, userId } = useAllCookies();

  /*
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");
  */

  useEffect(() => {
    
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      
      try {
        //--------------------------------------fetch bok----------------------------------------------------//
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        if (!response.ok) {
          throw new Error("Kunde ej hämta boken, err 1");
        }
        const data = await response.json();
        console.log(data);
        setBook(data);
        document.title = `${data.volumeInfo.title}`; //sätter title
        
        //--------------------------------------fetch recensioner----------------------------------------------------//
       
        
        const reviewsResponse = await fetch(`http://localhost:3000/review/${bookId}`);
        if (reviewsResponse.ok) { //om hittas 
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);
        
          const haveReviewd = reviewsData.find((review: Review) => review.userId === userId);
          if(haveReviewd) {
            setUserReviewed(true);
            setReviewId(haveReviewd._id);
            setUserGrade(haveReviewd.grade);
          }
        } else {
          setReviews([])
        }

        //--------------------------------------errors osv----------------------------------------------------//
      } catch (error) {
        setError("Kunde ej hämta, err 3");
      }
      setLoading(false);
    };
    
    fetchBook();
  }, [bookId  ]);



  const ReviewButton = () => {
    const title = book?.volumeInfo.title;
    
    navigate(`/review/${bookId}`, {
      state: {title},
    });
  };


  const AvgGrade = () => {
    if (reviews.length > 0) {
      const total = reviews.reduce((x, review) => x + review.grade, 0);
      const avg = (total / reviews.length);
    return  avg
    
    } else {
      const avg = 0;
      return avg;
    }
    
  };
  //--------------------------------------return----------------------------------------------------//
  return (
    <div className="container text-center" id="fullOneBook">
      {/* Error Message */}
      {error && <p className="text-danger">{error}</p>}

      {/* laddning */}
      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      {book && book.volumeInfo && (
        <div className="row">
          <div className="col-12 col-md-4">

            <img
              src={book.volumeInfo.imageLinks.thumbnail} //problem vid hämtning xlarge, large? kolla senare
              alt={book.volumeInfo.title}
            />
          </div>
          <div className="col-12 col-md-8">
            <div className="card-body text-left">
              <h5 className="card-title">{book.volumeInfo.title}</h5>
              <p className="card-text">
                Författare:
                {book.volumeInfo.authors?.join(", ")}
              </p>
<br />
              {/*avg grade*/}
              <div className="d-flex justify-content-center">
                
                  {reviews.length > 0 ? (
                    <>
                      <RateBook grade={Number(AvgGrade())} setGrade={() => {}} />
                    </>
                  ) : (
                    "Ej recenserad"
                  )}
                
              </div>
              <br />




              <p className="card-text">
                Publicerad:
                {book.volumeInfo.publishedDate}
              </p>
              <p className="card-text">
                Antal sidor: {book.volumeInfo.pageCount}
              </p>

              {/* lämna recension, om token*/}
              {token && !userReviewed &&(
                <button className="btn btn-success mt-3" onClick={ReviewButton}>
                  Lämna en recension
                </button>
              )}
              {userReviewed &&( 
              <button onClick={() => navigate(`/edit/${reviewId}`)} className="btn btn-secondary"> Redan recenserad, ditt betyg:  <RateBook grade={Number(userGrade)} setGrade={() => {}} /></button>)}
            </div>
          </div>
        </div>
      )}

      {/* Recensioner */}
      <div id="divReviews">
      <div className="card-body text-left">
        <h3>Recensioner</h3>
      </div>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div className="card" style={{ marginBottom: "2vh" }} key={review.bookId || `${review.bookId}-${index}`}>
            <div className="card-header">
              <h4>{review.username}</h4>
            </div>
            <div className="card-body">
            <div className="container" id="recensionTextDiv">
              <p><strong> <u>Betyg</u> </strong></p>
            <p>
              <RateBook grade={review.grade} setGrade={() => {}} />
            </p>
                  <p><strong><u>Recension</u></strong></p>
              <p className="card-text">{review.content}</p>
              </div>
            </div>
          </div>
        ))
        
      ) : (
        <p>Inga recensioner ännu</p>
      )}
    </div>
    </div>

  );
};
export default OneBook;