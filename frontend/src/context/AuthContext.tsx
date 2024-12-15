import { createContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { secretKey } from "../utils/constants";

interface User{
  email: string;
  name: string;
  memberId: string;
  balance: string
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

    console.log(user)
    useEffect(() => {
      const user = localStorage.getItem('user');
      const userData: User | any = user ? JSON.parse(user) : null;

      if(user){
        const userName = CryptoJS.AES.decrypt(userData.userName, secretKey).toString(CryptoJS.enc.Utf8);
        const userEmail = CryptoJS.AES.decrypt(userData.email, secretKey).toString(CryptoJS.enc.Utf8);
        const userBalance = CryptoJS.AES.decrypt(userData.balance, secretKey).toString(CryptoJS.enc.Utf8);
        const userMemberId = CryptoJS.AES.decrypt(userData.memberId, secretKey).toString(CryptoJS.enc.Utf8);

        setUser({ email: userEmail, name: userName, balance: userBalance, memberId: userMemberId });
        setIsAuthenticated(true);
        
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