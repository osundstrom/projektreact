import { useEffect, useState } from "react";
import "../css/Start.css";
import ReactPaginate from "react-paginate";
import { Book } from "../models/book";
 
const startPage = () => { 

    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pageCurrent, setPageCurrent] = useState<number>(1); 
    const [allBooks, setAllBooks] = useState<number>(0);
    
    const booksPerPage = 20;
    const numberPages = Math.ceil(allBooks/booksPerPage);


  useEffect(() => {
    fetchBooks();
  }, [pageCurrent]);

  const fetchBooks = async () => {
    setLoading(true);
  try {
    const startPage = (pageCurrent - 1) * 20;
    console.log(startPage);
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=MIUN&maxResults=${booksPerPage}&startIndex=${startPage}`);
    
    if (!response.ok) {
        throw new Error("fel vid hämtning");
      }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      setBooks(data.items);
      setAllBooks(data.totalItems);
    console.log(data.totalItems);
    
    }else{
      setBooks([]);
      setAllBooks(0);
      setError("Inga böcker hittades");
    }
    
    setLoading(false);

  } catch (error) {
    console.error("Error vid hämtning:", error);
    setError("fel vid hämtning av böcker");
    setLoading(false);
  }
};

//-------------------------PAGINATION-------------------------------------------------------------//
const changePage = ({ selected } : { selected : number }) => {
  setPageCurrent(selected  + 1);
};


//-------------------------RETURN-------------------------------------------------------------//
  return (
    <>
    
    <div className="container text-center">
      {loading && <div className="spinner-border" role="status">
     <span className="visually-hidden">Loading...</span>
    </div>}

      {error && <p>{error}</p>}
      <div className="row" >
        
        {books.map((book: Book, index) => (
        <div className="col-12 col-md-3 mb-4" key={`${book.id}-${index}`}>
        <div className="card oneCard">
            <img src={book.volumeInfo.imageLinks?.thumbnail} className="card-img-top" alt={book.volumeInfo.title} />
        <div className="card-body">
            <h5 className="card-title">{book.volumeInfo.title}</h5>
            <p className="card-text">{book.volumeInfo.authors?.join(", ")}</p>
            <a href="#" className="btn btn-primary">Länk bok</a>
        </div>
        </div>
        </div>
        ))}
      </div>

    {/*pagnering*/}
    {allBooks > 0 &&(
    <ReactPaginate
        previousLabel={"Tidigare"}
        nextLabel={"Nästa"}
        breakLabel={"..."}
        pageCount={numberPages}
        marginPagesDisplayed={0}
        pageRangeDisplayed={6}
        onPageChange={changePage}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item disabled"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
        renderOnZeroPageCount={null}
      />
    )}
    </div>
    
    </>
  )
}

export default startPage;



