import { useEffect, useState } from "react";
import "../css/Start.css";
import ReactPaginate from "react-paginate";
import { Book } from "../models/book";
import { useNavigate } from "react-router-dom";
import RateBook from "../components/Grade";
import { Review } from "../models/review";
//import { useAllCookies } from "../components/AllCookie";
import {useAllBooks} from "../components/Allbooks";


interface CategoryHeader {
  category: string; //prop från header
}


const startPage = ({category}: CategoryHeader) => { 
  
  const { setBooks, setAvgGrades } = useAllBooks();
//--------------------states----------------------------------------------------------------//
    const [books, setBooksLocal] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pageCurrent, setPageCurrent] = useState<number>(1); 
    const [allBooks, setAllBooks] = useState<number>(0);
    const [avgGrades, setAvgGradesLocal] = useState<Map<string, number>>(new Map());
    
    const booksPerPage = 20; //antal böcker per sida
    const numberPages = Math.ceil(allBooks/booksPerPage); //antalet sidor, ?? ger olika??

    const [searchBox, setSearchBox] = useState<string>(""); 
    const [searchAuto, setSearchAuto] = useState<string>(""); //måste ha en sökterm för google api, stadard term :)

  useEffect(() => {
    document.title = `Startsida - ${pageCurrent}`; //title

    if(!searchAuto){
      setSearchAuto("a");//får ej avra tom
    }
    if (searchAuto) {
      fetchBooks();
    }
  }, [pageCurrent, searchAuto]);

  useEffect(() => {
    setSearchAuto((category)|| "a");//får ej vara tom
  }, [category]);//vid ändrign av kategori

  const fetchBooks = async () => {
    setLoading(true);
  try {
    const startPage = (pageCurrent - 1) * 20; //startsida
    console.log(startPage);

  //----------------------------------Google api, visas på sökterm och hur många per sida------------------------------------------------------//
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchAuto}&orderBy=newest&maxResults=${booksPerPage}&startIndex=${startPage}`);
    
    if (!response.ok) { //om ej ok
        throw new Error("fel vid hämtning");
      }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      setBooksLocal(data.items); //sätt böcker
      setAllBooks(data.totalItems); //totala antalet böcker
      setBooks(data.items)

    console.log(data.totalItems);

    }else{ //om inget hittas
      setBooks([]);
      setAllBooks(0);
      setError("Inga böcker hittades");
    }

    //--------------------------------------fetch recensioner (avg)----------------------------------------------------//
      
    const allAvgGrades: Map<string, number> = new Map(); //ny för alla avgGrades, 

    // Hämta recensioner och beräkna genomsnittligt betyg repsektive bok
    //promise väntar på samtliga
    await Promise.all(data.items.map(async (book: Book) => { 
      
      setLoading(true); 
      const reviews = await fetch(`https://projektreactbackend.onrender.com/review/${book.id}`);

      if (reviews.ok) {   //om ok 
        //console.error(reviews)
        const reviewsData = await reviews.json();

      
      if (reviewsData.length > 0) { //om recensioner finns¨
        //räkna ut medelvärde
        const total = reviewsData.reduce((x: number, review: Review) => x + review.grade, 0);
        const gradeAvg = (total / reviewsData.length);

        allAvgGrades.set(book.id, gradeAvg);  //sätt betyg baserat på bookId

      } 
      else if(reviewsData.length === 0){ //om inga recensioner

        allAvgGrades.set(book.id, 0); //betyg 0.
        
      }}
      
      else{ //om ej ok respones, sätter vi till 0, alltså inga recensioner.
        allAvgGrades.set(book.id, 0); 
      }
    }));

    setAvgGradesLocal(allAvgGrades)
    setAvgGrades(allAvgGrades);
  
    setLoading(false); //slutar ladda

  } catch (error) {
    //console.error("Error vid hämtning:", error);
    setError("fel vid hämtning av böcker");
    setLoading(false);
  }
};

//-------------------------PAGINATION-------------------------------------------------------------//
const changePage = ({ selected } : { selected : number }) => {
  setPageCurrent(selected  + 1); // nästa sida, +1 på sidan
  window.scrollTo(0, 0); //till toppen
};

//-------------------------openBook-------------------------------------------------------------//

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
        <div className="col-xl-3 col-lg-4 col-md-6 col-12" key={`${book.id}-${index}`}>
        <div className="card oneCard">
            <img src={book.volumeInfo.imageLinks?.smallThumbnail} className="card-img-top" alt={book.volumeInfo.title} />
        <div className="card-body">
            <h5 className="card-title">{book.volumeInfo.title}</h5>
            <p className="card-text">{book.volumeInfo.authors?.join(", ")}</p>
              <br />
              {/*avg betyg, skickas in i ratebook*/}
            <p>{<RateBook grade={avgGrades.get(book.id) ?? 0} setGrade={() => {}} />}</p> 
            </div>
            <br />
                      
            
            <button onClick={() => openBook(book.id)} id="buttonInfo" className="btn btn-primary">Läs mer</button>
            </div>
            
        </div>
        
        
        ))}
        
        
      </div>
      <div id="pageManage">
    {/*pagnering, react paganate och bootstrap*/}
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
    </div>
    
    </>
  )
}

export default startPage;



