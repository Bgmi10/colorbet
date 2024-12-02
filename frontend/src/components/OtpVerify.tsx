import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { baseurl } from "../utils/constants";

export default function OtpVerify(){

    const refs = useRef([]);
    const [userinput, setUserInput] = useState('');

    console.log(userinput);

    const user  = JSON.parse(localStorage.getItem('user-form'));
    console.log(user)


    useEffect(() => {
        if(refs.current[0]){
            refs.current[0].focus()
        }
    },[])

    const handleSubmit = async () => {
        try {
            const res = await axios.post(baseurl + '/api/auth/signin', {
                user,
              
            })
        }
        catch(e){
            console.log(e);
        }
    }

    return (
        <> 
          <div className="justify-center flex h-screen font-serif text-xl items-center">
          <span >Verify your Otp</span>
             <div className="">
             {Array.from({length : 6} , (i, index) => (
                <input max={1}  type="number"  onChange={(e) => setUserInput(e.target.value)} ref={(el) => refs.current[index] = el} placeholder="0"  key={index} className=" w-12 h-12 text-2xl bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500 text-center  m-2 appearance-none" onKeyDown={(e) => { if(e.key === '.' || e.key === '-' || e.key === '+'){
                      e.preventDefault();
                } }}/>
             ))}
             </div>
          </div>
        </>
    )
}