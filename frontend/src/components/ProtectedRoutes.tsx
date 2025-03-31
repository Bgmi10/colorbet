import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoutes() {
//@ts-ignore
  const { isAuthenticated, isLoading } = useContext(AuthContext); 

  if (isLoading) {
    return <Loader />
  }

  return(
    <>
      { isAuthenticated ? <Outlet /> : <Navigate to={'/login'} /> }
    </>
  )
}