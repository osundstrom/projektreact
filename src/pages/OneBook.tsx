import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Book } from "../models/book";
import { Review } from "../models/review";

const OneBook = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


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
        //--------------------------------------fetch recensioner----------------------------------------------------//
        const reviewsResponse = await fetch(`http://localhost:3000/review/${bookId}`);
        if (reviewsResponse.ok) { //om hittas 
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);
        } else {
          setReviews([]); //annars tom
          console.log("response ej ok, err 2");
        }

        //--------------------------------------errors osv----------------------------------------------------//
      } catch (error) {
        setError("Kunde ej hämta, err 3");
      }
      setLoading(false);
    };

    fetchBook();
  }, [bookId]);

  //--------------------------------------return----------------------------------------------------//
  return (
    <div className="container text-center">
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
              <p className="card-text">
                Publicerad:
                {book.volumeInfo.publishedDate}
              </p>
              <p className="card-text">
                Antal sidor: {book.volumeInfo.pageCount}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recensioner */}
      <div className="card-body text-left">

        <h3>Recensioner</h3>
      </div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div className="card" style={{ marginBottom: "2vh" }} key={review.bookId}>
            <div className="card-header">
              <p>{review.username}</p>
            </div>
            <div className="card-body">
              <p className="card-title">Betyg: {review.grade}</p>
              <p className="card-text">{review.content}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Inga recensioner ännu</p>
      )}
    </div>

  );
};
export default OneBook;