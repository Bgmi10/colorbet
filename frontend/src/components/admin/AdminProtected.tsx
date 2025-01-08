import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Loader";

export default function AdminProtected() {
  const auth = useContext(AuthContext);
  
  if (auth?.isLoading) {
    return <Loader />;
  }

  if (!auth?.user) {
    return <Navigate to="/" replace />;
  }

  return auth.user.role === "ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}