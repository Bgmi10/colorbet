import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Loader from "./Loader";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthProtectedRoutes() {
   //@ts-ignore
    const { isAuthenticated, isLoading } = useContext(AuthContext);

    if (isLoading) {
       return <Loader />
    }

    return (
        <div>
            {
                !isAuthenticated ? <Outlet /> : <Navigate to={"/profile"} />
            }
        </div>
    )
}