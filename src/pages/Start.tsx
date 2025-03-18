import { useEffect, useState } from "react";
import "../css/Start.css";
import ReactPaginate from "react-paginate";
import { Book } from "../models/book";
import { useNavigate } from "react-router-dom";


interface CategoryHeader {
  category: string; 
}


const startPage = ({category}: CategoryHeader) => { 
 

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pageCurrent, setPageCurrent] = useState<number>(1); 
    const [allBooks, setAllBooks] = useState<number>(0);
    
    const booksPerPage = 20;
    const numberPages = Math.ceil(allBooks/booksPerPage);

    const [searchBox, setSearchBox] = useState<string>(""); 
    const [searchAuto, setSearchAuto] = useState<string>(""); //måste ha en sökterm för google api, stadard term :)

  useEffect(() => {
    document.title = `Startsida - ${pageCurrent}`;
    if(!searchAuto){
      setSearchAuto("a");//får ej avra tom
    }
    if (searchAuto) {
      fetchBooks();
    }
  }, [pageCurrent, searchAuto]);

  useEffect(() => {
    setSearchAuto((category)|| "a");//får ej avra tom
  }, [category]);

  const fetchBooks = async () => {
    setLoading(true);
  try {
    const startPage = (pageCurrent - 1) * 20;
    console.log(startPage);
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchAuto}&orderBy=newest&maxResults=${booksPerPage}&startIndex=${startPage}`);
    
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
  window.scrollTo(0, 0);
};

const navigate = useNavigate();
//Skicka till sida för enskild boken
const openBook = (bookId: string) => {
  navigate(`/books/${bookId}`);
}


//-------------------------Sök-------------------------------------------------------------//

const searchForm = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSearchAuto(searchBox.trim());
  setPageCurrent(1);
};

//-------------------------avg-------------------------------------------------------------//


//-------------------------RETURN-------------------------------------------------------------//
  return (
    <>
    
    <div className="container text-center" id="fullDiv">
      {loading && <div className="spinner-border" role="status">
     <span className="visually-hidden">Loading...</span>
    </div>}

      {error && <p>{error}</p>}
      <div className="row" >

   {/*Sök*/}
   <form onSubmit={searchForm} className="mb-4 d-flex justify-content-center">
          <input
            type="text"
            placeholder="Sök efter böcker..."
            value={searchBox}
            onChange={(e) => setSearchBox(e.target.value)}
            className="form-control w-50"
          />
          <button type="submit" className="btn btn-primary ms-2">Sök</button>
        </form>
        
        {/*Böcker*/}
        {books.map((book: Book, index) => (
        <div className="col-12 col-md-3 mb-4" key={`${book.id}-${index}`}>
        <div className="card oneCard">
            <img src={book.volumeInfo.imageLinks?.smallThumbnail} className="card-img-top" alt={book.volumeInfo.title} />
        <div className="card-body">
            <h5 className="card-title">{book.volumeInfo.title}</h5>
            <p className="card-text">{book.volumeInfo.authors?.join(", ")}</p>
               
            </div>
            <br />
                      
            
            <button onClick={() => openBook(book.id)} id="buttonInfo" className="btn btn-primary">Länk bok</button>
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



