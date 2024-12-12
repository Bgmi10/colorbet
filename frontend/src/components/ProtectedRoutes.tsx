import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes ({ children } : { children: any }){

    const { isAuthenticated } = useContext(AuthContext); 
    return(
        <>
          { isAuthenticated ? children : <Navigate to={'/login'}/> }
        </>
    )
}