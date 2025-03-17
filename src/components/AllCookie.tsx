
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Review } from '../models/review';



//interface
interface AllCookiesInterface {
  userId: string;
  token: string;
  username: string;
  role: string;
  reviews: Review[];
  setUser: (userId: string, token: string, username: string, role: string) => void;
  logout: () => void;
  fetchReviews: () => void;
}

const AllCookies = createContext<AllCookiesInterface | undefined>(undefined);


export const AuthCookies: React.FC<{ children: ReactNode }> = ({ children }) => {
  
const [userId, setUserId] = useState<string>(Cookies.get("userId") || "");
const [token, setToken] = useState<string>(Cookies.get("token") || "");
const [username, setUsername] = useState<string>(Cookies.get("username") || "");
const [role, setRole] = useState<string>(Cookies.get("role") || "");
const [reviews, setReviews] = useState<Review[]>([]);

   
   useEffect(() => {
    setUserId(Cookies.get("userId") || "");
    setToken(Cookies.get("token") || "");
    setUsername(Cookies.get("username") || "");
    setRole(Cookies.get("role") || "");
    fetchReviews();
  }, [reviews]); 

//-----------------------------------------------------------------------------------------------------//

const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:3000/reviews", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}`: "",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("kunde ej hämta recensioner");
      }

      setReviews(data); 
    } catch (error: any) {
      console.error(error.message);
    }
  };
  //---------------------------------------------------------------------------------------------------//

  
  const setUser = (userId: string , token: string, username: string, role: string) => {
    if (userId && token && username && role) {
        Cookies.set("username", username, {expires: 1});
        Cookies.set("token", token, {expires: 1});
        Cookies.set("userId", userId, { expires: 1 });
        Cookies.set("role" , role, { expires: 1 });
    } else {
      Cookies.remove("userId");
      Cookies.remove("token");
      Cookies.remove("username");
      Cookies.remove("role");
    }
    setUserId(userId);
    setToken(token);
    setUsername(username);
    setRole(role);
  };

  
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
    <AllCookies.Provider value={{ userId: userId, token: token, username: username, role: role, setUser, logout, reviews: reviews, fetchReviews }}>
      {children}
    </AllCookies.Provider>
  );
};


export const useAllCookies = (): AllCookiesInterface => {
  const context = useContext(AllCookies);
  if (!context) {
    throw new Error("Error, context undifined");
  }
  return context;
};