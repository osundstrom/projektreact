import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book } from '../models/book';

// interface för context
interface AllbooksInterface {
  books: Book[];
  avgGrades: Map<string, number>;
  setBooks: (books: Book[]) => void;
  setAvgGrades: (avgGrades: Map<string, number>) => void;
}

//skapar context för böcker fårn start
const AllBooks = createContext<AllbooksInterface | null>(null);

//
export const BooksList: React.FC<{ children: ReactNode }> = ({ children }) => {
  //skapar states
  const [books, setBooks] = useState<Book[]>([]); 
  const [avgGrades, setAvgGrades] = useState<Map<string, number>>(new Map());

  //provider för att dela context till  komponenter. 
  return (
    <AllBooks.Provider value={{ books, avgGrades, setBooks, setAvgGrades }}>
      {children}
    </AllBooks.Provider>
  );
};

//hook för useAllbooks
export const useAllBooks = (): AllbooksInterface => {
  const context = useContext(AllBooks);
  if (!context) {
    throw new Error("Error, AllBooks");
  }
  return context;
};