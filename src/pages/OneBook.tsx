import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
//import { Book } from "../models/book";
import { Review } from "../models/review";
//import Cookies from "js-cookie";
import "../css/OneBook.css"
import RateBook from "../components/Grade";
import { useAllCookies } from "../components/AllCookie";
import { useAllBooks } from "../components/Allbooks";

const OneBook = () => {

  const { bookId } = useParams(); //id från url
  console.log(bookId)
  
//-------------------States-------------------------------------------------------------//
  //const [book, setBook] = useState<Book | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReviewed, setUserReviewed] = useState<boolean>(false);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [userGrade, setUserGrade] = useState<number | null>(null);
  //const [avgGrade, setAvgGrade] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); //navigate

  const { token, userId, } = useAllCookies();//från context

  const {avgGrades, books} = useAllBooks();
  const avgGrade = avgGrades.get(bookId || "");
  const book = books.find((b) => b.id === bookId) || null; 
  useEffect(() => {
//--------------------------------------fetch bok----------------------------------------------------//
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
        //--------------------------------------fetch recensioner----------------------------------------------------//
        try {

        const reviewsResponse = await fetch(`https://projektreactbackend.onrender.com/review/${bookId}`);
        if (reviewsResponse.ok) { //om hittas 
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);

          //om user redan recenserat boken
          const haveReviewd = reviewsData.find((review: Review) => review.userId === userId); 
          if (haveReviewd) {
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
  }, [bookId]); //kör om bookId ändras

  //--------------------------------------Review button----------------------------------------------------//

  const ReviewButton = () => {
    const title = book?.volumeInfo.title; //boken titel

    navigate(`/review/${bookId}`, { //navigering
      state: {title}, //skickar med titel som state
    });
  };

  //--------------------------------------return----------------------------------------------------//
  return (
    <div className="container text-center" id="fullOneBook">

 <div id="btnReturn" className="container d-flex">
  <Link className="btn btn-secondary"  to="/">Tillbaka</Link>
 </div>
      
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
              <h5 id="h5Title" className="card-title"><u>{book.volumeInfo.title}</u></h5>
              <div className="card-text">
              <p>{book.volumeInfo.description}</p>
              <hr />
              <p><b>Författare:</b> {book.volumeInfo.authors?.length > 0 ? book.volumeInfo.authors.join(", ") : "Ej angiven"}</p>
                </div>
                
              <br />
              {/*avg grade*/}
              <div className="d-flex justify-content-center">

                {reviews.length > 0 ? (
                  <>
                    <RateBook grade={avgGrade ?? 0} setGrade={() => { }} />
                  </>
                ) : (
                  <RateBook grade={0} setGrade={() => { }} />
                )}

              </div>
              <br />


              <div className="card-text">
                <p><b>Publicerad:</b> {book.volumeInfo.publishedDate}</p>
              </div>

              <div className="card-text">
                <p><b>Antal sidor:</b>  {book.volumeInfo.pageCount}</p>
              </div>

              <div className="card-text">
                <p><b>Språk:</b>  {book.volumeInfo.language}</p> 
              </div>

              <div className="card-text">
                <p><b>Typ:</b>  {book.volumeInfo.printType}</p>
              </div>

              {/* lämna recension, om token*/}
              {token && !userReviewed && (
                <button className="btn btn-success mt-3" onClick={ReviewButton}>
                  Lämna en recension
                </button>
              )}
              {userReviewed && (
                <button onClick={() => navigate(`/edit/${reviewId}`)} className="btn btn-secondary"> Redan recenserad, ditt betyg:  <RateBook grade={Number(userGrade)} setGrade={() => { }} /></button>)}
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
                    <RateBook grade={review.grade} setGrade={() => { }} />
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