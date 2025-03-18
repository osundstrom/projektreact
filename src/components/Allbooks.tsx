import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book } from '../models/book';

// interface 
interface AllbooksInterface {
  books: Book[];
  avgGrades: Map<string, number>;
  setBooks: (books: Book[]) => void;
  setAvgGrades: (avgGrades: Map<string, number>) => void;
}

//skapar context för böcker fårn start
const AllBooks = createContext<AllbooksInterface | null>(null);

export const BooksList: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [avgGrades, setAvgGrades] = useState<Map<string, number>>(new Map());

  return (
    <AllBooks.Provider value={{ books, avgGrades, setBooks, setAvgGrades }}>
      {children}
    </AllBooks.Provider>
  );
};

//hook for useAllbooks
export const useAllBooks = (): AllbooksInterface => {
  const context = useContext(AllBooks);
  if (!context) {
    throw new Error("Error, AllBooks");
  }
  return context;
};