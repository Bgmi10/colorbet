import { createContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { secretKey } from "../utils/constants";

interface User{
  email: string;
  name: string;
}

export const AuthContext = createContext<{
  user: User | null,
  isAuthenticated: boolean | null,
  setUser: any
} | null>(null);



export const AuthProvider = ({ children } : {children : any}) => {

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
  
    useEffect(() => {
      
      const encryptedUserName: string | any = localStorage.getItem('UserName');
      const encryptedUserEmail: string | any = localStorage.getItem('UserEmail'); 

      if(encryptedUserEmail && encryptedUserName){
        const userName = CryptoJS.AES.decrypt(encryptedUserName, secretKey).toString(CryptoJS.enc.Utf8);
        const userEmail = CryptoJS.AES.decrypt(encryptedUserEmail, secretKey).toString(CryptoJS.enc.Utf8);

        if(userEmail && userName){
          setUser({ email: userEmail, name: userName });
          setIsAuthenticated(true);
         };
      }
    
    },[])


    return(
        <>
          <AuthContext.Provider value={{ user,isAuthenticated, setUser}}>
            {children}
          </AuthContext.Provider>
        </>
    )
}