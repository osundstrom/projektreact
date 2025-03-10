import { useEffect, useState } from "react";
import "../css/Start.css";

const startPage = () => { 

    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pageCurrent, setPageCurrent] = useState<number>(1); //första sidan
    const [allBooks, setAllBooks] = useState<number>(0);

  useEffect(() => {
    fetchBooks();
  }, [pageCurrent]);

  const fetchBooks = async () => {
    setLoading(true);
  try {
    const startPage = (pageCurrent - 1) * 20;

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=a&maxResults=20&startIndex=${startPage}`);
    
    if (!response.ok) {
        throw new Error("fel vid hämtning");
      }

    const data = await response.json();
    setBooks(data.items);
    setAllBooks(data.totalItems);
    console.log(data.totalItems);
    setLoading(false);

  } catch (error) {
    console.error("Error vid hämtning:", error);
    setError("fel vid hämtning av böcker");
    setLoading(false);
  }
};


//-------------------------PAGINATION-------------------------------------------------------------//
  const pagesExist = Math.ceil(allBooks / 20); //20 böcker per sida
  const pagnationMax = 10; //visa 10 i pagnering

  const pageChange = (x: number) => { 
    setPageCurrent(x);
  }

  const allPagesBooks = () => {
    
    const allPage = [];


    if (pagesExist < pagnationMax) {
      for (let i = 1; i <= pagesExist; i++) {
        allPage.push(i);
        };
    }

    if (pagesExist > pagnationMax) {
        for (let i = 1; i <= 10; i++) {
            allPage.push(i);
            };
        
    };

    
  return allPage;
  }

//-------------------------RETURN-------------------------------------------------------------//
  return (
    <>
    
    <div className="container text-center">
    
      <div className="row" >
        
        {books.map((book: any) => (
        <div className="col-12 col-md-3 mb-4" key={book.id}>
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
       
        <nav aria-label="pagnation">

 <ul className="pagination">
    <li className={`page-item ${pageCurrent === 1 ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => pageChange(pageCurrent - 1)}>Tidigare</button>
    </li>
    {/*------------------------array för alla sidor--------------------------------------------- */}
    {allPagesBooks().map((page, number) => (
              <li
                key={number}
                className={`page-item ${
                  pageCurrent === number + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => pageChange(number + 1)}
                >
                  {number + 1}
                </button>
              </li>
            ))}
    <li className="page-item">
      <button className="page-link">Nästa</button>
    </li>
  </ul>
</nav>

    </div>
    
    </>
  )
}

export default startPage;



