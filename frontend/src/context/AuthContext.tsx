import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { baseurl } from "../utils/constants";

interface User{
  email: string;
  name: string;
  memberId: string;
  balance: number
}

export const AuthContext = createContext<{
  user: User | null,
  isAuthenticated: boolean | null,
  setUser: any,
  Logout: () => Promise<void>
} | null>(null);


export const AuthProvider = ({ children } : {children : any}) => {

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);

    useEffect(() => {
       
      const getUser = async () => {
        try{
        const res = await axios.get(`${baseurl}/api/auth/userprofile`, {
          withCredentials: true
        });
        const json = await res.data;
        if(json){
        setUser(json?.user);
        setIsAuthenticated(true);
      }      
    }
    catch(e){
      console.log(e);
    }
   }

   getUser();
    
    },[])


    const Logout = async() => {
      try{
       await axios.post(`${baseurl}/api/auth/logout`, {}, {
         withCredentials: true
       });
 
       localStorage.clear();
       window.location.href = "/login";
      }
      catch(e){
        console.log(e);
      }
    
    }


    return(
        <>
          <AuthContext.Provider value={{ user,isAuthenticated, setUser, Logout}}>
            {children}
          </AuthContext.Provider>
        </>
    )
}