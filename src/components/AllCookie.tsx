
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { Book } from '../models/book';

//interface
interface AllCookiesInterface {
  userId: string;
  token: string;
  username: string;
  role: string;
  setUser: (userId: string, token: string, username: string, role: string) => void; //funktion för säatt användare
  logout: () => void; //funktion för utlogg
  setBooks: (books: Book[]) => void;
  setAvgGrades: (avgGrades: Map<string, number>) => void;
  books: Book[]; 
  avgGrades: Map<string, number>; 
}

//skapar context och komponenet för att dela alla cookies 
const AllCookies = createContext<AllCookiesInterface | null>(null);
export const AuthCookies: React.FC<{ children: ReactNode }> = ({ children }) => {

//-----------------------------States------------------------------------------------------------------------//
const [userId, setUserId] = useState<string>(Cookies.get("userId") || "");
const [token, setToken] = useState<string>(Cookies.get("token") || "");
const [username, setUsername] = useState<string>(Cookies.get("username") || "");
const [role, setRole] = useState<string>(Cookies.get("role") || "");

const [books, setBooks] = useState<Book[]>([]); 
const [avgGrades, setAvgGrades] = useState<Map<string, number>>(new Map()); 


//------------------------------setUser---------------------------------------------------------------------//
const setUser = (userId: string , token: string, username: string, role: string) => {
  if (userId && token && username && role) { //om all finns, skapar cookies och sätter states
    Cookies.set("username", username, {expires: 1});
    Cookies.set("token", token, {expires: 1});
    Cookies.set("userId", userId, { expires: 1 });
    Cookies.set("role" , role, { expires: 1 });
  } 
    setUserId(userId);
    setToken(token);
    setUsername(username);
    setRole(role);
  };

  //tar bort vid utlogg
  const logout = () => {
    Cookies.remove("userId");
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("role");
    setUserId("");
    setToken("");
    setUsername("");
    setRole("");
   
  };

  return (
    //provider för att dela context till alla komponenter. 
    <AllCookies.Provider value={{ userId: userId, token: token, username: username, role: role, setUser, logout, setBooks, setAvgGrades, books, avgGrades  }}>
      {children}
    </AllCookies.Provider>
  );
};

//hook för att använda context.
export const useAllCookies = (): AllCookiesInterface => {
  //hämtar context
  const context = useContext(AllCookies);

  if (!context) {//om context är null, alltås ej tillgänglig. (ej i authCookie)
    throw new Error("Error, context null");
  }
  return context; //retur
};