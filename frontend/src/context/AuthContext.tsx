import { createContext, useState } from "react";

export const AuthProvider = createContext(null);

export const AuthContext = ({ children } : {children : any}) => {

    const [user, setUser] = useState<null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    


    return(
        <>
          <AuthProvider.Provider value={{user,isAuthenticated}}>
            {children}
          </AuthProvider.Provider>
        </>
    )
}