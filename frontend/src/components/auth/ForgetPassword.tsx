import axios from "axios";
import { useEffect, useState } from "react"
import { baseurl, validEmail } from "../../utils/constants";
import { Link } from "react-router-dom";

export default function ForgetPassword () {

    const [form , setForm] = useState({ email : "" , newpassword : "" , otp  : ""});
    const [timer, setTimer] = useState(60);
    const [err, setErr] = useState('');
    
    const handlechange = (e) => {
       const {name, value} = e.target;
       setForm(prev => ({...prev, [name] : value}));
       setErr('');
    }
 
    const handletimer = async () => {
       try {
           const res = await axios.post('/generate-otp' , {email : form?.email});
           setErr(res.message);
       }
       catch(e){
           setErr(e.response.data.message);
           console.log(e);
       }
    }  
  
    const handleSubmit = async () => {

        if(!form?.email){
            return setErr('email is required field');
        }

        if(!validEmail(form?.email)){
            return setErr('please provide a valid email.');
        }

        try{ 
          const res = await axios.post(err === 'otp sent sucessfully check your email' ? baseurl + '/api/auth/forgetpassword' : baseurl +'/api/auth/generate-otp' , { email : form?.email , otp : form?.otp , newpassword : form?.newpassword});
          const json = await res.data;
          setErr(json.message);          
        }
        catch(e){
            console.log(e);
            setErr(e.response.data.message);
        }
    }


    return (
        <>
        <div className="align-middle h-screen">
          <div className="flex justify-center">
              <input type='text' placeholder="email" className="border p-3 rounded-sm" name="email" onChange={handlechange} value={form?.email} />
          </div>
          <div className="flex justify-center mt-5"> <input  type='text' name="newpassword" value={form?.newpassword} placeholder="new password" className="border p-3 rounded-sm" onChange={handlechange} /></div>
          <div className="flex justify-center mt-5 ml-14">
             <input type='number' placeholder="verify otp" value={form?.otp} name="otp" className="border p-3 rounded-sm" onChange={handlechange} /> 
             <button className="px-4 bg-gray-500 text-white" onClick={handletimer} disabled={timer < 60 }>{timer === 60 ? "otp" : `wait ${timer}s`}</button>
           </div>
           <div><span className="text-red-500 font-medium">{ err === 'User not found try to signin' ? <><p>user not found signin</p><Link className="underline text-blue-300" to={'/signin'}>Signin</Link> </> : err}</span></div>
          <div className="flex justify-center mt-3 ">
          <button className=" bg-blue-400 p-3 w-40 text-white" onClick={handleSubmit}>Continue</button>
          </div>
          </div>
             
        </>
    )
}