import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { Book } from "../models/book"; 

const OneBook = () => {
  const { bookId } = useParams<{ bookId: string }>(); 
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        if (!response.ok) {
          throw new Error("Kunde ej hämta boken");
        }
        const data = await response.json();
        console.log("loggar data:", data);
        setBook(data);
      } catch (error) {
        setError("Kunde ej hämta boken");
      }
      setLoading(false);
    };

    fetchBook();
  }, [bookId]); 
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
  
      {book && book.volumeInfo ? (
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
        
      ) : (
        <p>Boken hittas ej</p>
      )}
  
     
    </div>
  );
}
export default OneBook;