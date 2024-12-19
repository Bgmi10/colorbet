import { Navigate } from "react-router-dom";

export default function ProtectOtpPage ({ children }: { children: any}){
    const checkUserForm = localStorage.getItem('user-form');
    const data = checkUserForm ? JSON.parse(checkUserForm) : "{}"
    if(!data.email && !data.password && !data.name){
      return (<Navigate to={'/signin'} />)
    }
    else{
        return children
    }

}