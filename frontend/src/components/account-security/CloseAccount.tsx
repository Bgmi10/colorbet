import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import ButtonLoader from "../bindbank/ButtonLoader";
import axios from "axios";
import { motion } from "framer-motion";
import { baseurl } from "../../utils/constants";
import Header from "../Header";

export default function CloseAccount (){

  //@ts-ignore
  const { user, setUser } = useContext(AuthContext);
  const [isshowNewPassword, setIsShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const [userinput, setUserInput] = useState('');
  const [validpassword, setValidPassword] = useState(false);
  const [isshowconfirmcard, setIsShowConfirmCard] = useState(false);

  const checkPassword = async () => {
    try{
      const res = await axios.post(`${baseurl}/api/auth/checkpassword?password=${userinput}`, {}, { withCredentials: true });
      if(res.status === 200){
       setError('valid password');
       setValidPassword(true);
      }
    }
    catch(e: any){
      console.log(e);
      setError(e.response.data.message);
      setValidPassword(false);
    }
  }

  useEffect(() => {
       setTimeout(() => {
         checkPassword();
       }, 400);
  },[userinput]);

  const handleSubmit = () => {
    setIsShowConfirmCard(true);
  };

  const handleDeleteAccount  = async() => {
      try{
        setLoader(true)
        const res = await axios.delete(`${baseurl}/api/auth/delete-account`, { withCredentials: true });

        if(res.status === 200){
          setLoader(false);
          setIsShowConfirmCard(false);
          setUser(null);
          localStorage.clear();
          window.location.href = '/signin';
        }
      }
      catch(e){
        console.log(e);
        setLoader(false);
      }
  }

  return(
   <>
     <Header link="/profile" title="Delete Account" />
     <div className="h-screen dark:bg-gray-900 flex items-center justify-center flex-col">
      <div className="dark:bg-gray-800 bg-slate-00 shadow-md flex flex-col items-center rounded-md gap-3 p-5 w-full max-w-md">
        <div className="w-full relative">
          <input
            type={"text"}
            value={user?.email}
            name="oldPassword"
            placeholder="email"
            className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 opacity-40 p-3 rounded-md outline-none dark:text-white text-gray-700"
            disabled
          />
        </div>

        <div className="w-full relative mt-4">
          <input
            type={isshowNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Password"
            className="w-full dark:bg-gray-700  bg-gray-100 border-gray-600 border p-3 rounded-md outline-none  dark:text-white text-gray-700"
            onChange={(e) => setUserInput(e.target.value) }
          />
          <FontAwesomeIcon
            icon={isshowNewPassword ? faEye : faEyeSlash}
            className="absolute right-3 top-3 dark:text-gray-900 text-gray-700 cursor-pointer"
            onClick={() => setIsShowNewPassword(!isshowNewPassword)}
          />
        </div>

        {error === "password not matched" && <p className="text-red-500 text-sm mt-2" role="alert">{error}</p>}
        {error === "valid password" && <p className="text-green-500 text-sm mt-2" role="alert">{error}</p>}

        <button
          className={`bg-yellow-500 text-white p-3 rounded-md w-full mt-4 font-serif transition-all ${!validpassword ? "cursor-not-allowed opacity-50" : "hover:bg-yellow-600"}`}
          onClick={handleSubmit}
          disabled={!validpassword}
          aria-busy={!validpassword}
          aria-live="polite"
        >
         <ButtonLoader value="Submit" loader={loader} />
        </button>

        {
          isshowconfirmcard && <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-auto shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete your account ?
              deletion cannot be redone 
            </p>
            <div className="flex justify-end gap-3">
              <motion.button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md font-medium transition-colors duration-300 ease-in-out"
                whileHover={{ scale: 1.02, backgroundColor: "#d1d5db" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsShowConfirmCard(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-red-500 text-white rounded-md font-medium transition-colors duration-300 ease-in-out"
                whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeleteAccount}
                disabled={loader}
              >
               <ButtonLoader loader={loader} value="Delete" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
        }
      </div>
    </div>
        </>
    )
}