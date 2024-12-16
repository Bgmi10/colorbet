import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { baseurl } from "../utils/constants";


interface User{
  email: string;
  name: string;
  memberId: string;
  balance: number
}
// bug balance return in string instead of number
export const AuthContext = createContext<{
  user: User | null,
  isAuthenticated: boolean | null,
  setUser: any
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
        console.log(json);
        if(json){
        setUser(json);
        setIsAuthenticated(true);
      }      
    }
    catch(e){
      console.log(e);
    }
   }

   getUser();
    
    },[])


    return(
        <>
          <AuthContext.Provider value={{ user,isAuthenticated, setUser}}>
            {children}
          </AuthContext.Provider>
        </>
    )
}