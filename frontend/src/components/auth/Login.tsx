import React, { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import axios from "axios";
import { baseurl, validEmail } from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  const handlechange = (e : React.EventHandler) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErr('');
  };

  useEffect(() => {
      ref?.current?.focus();
  },[ref])

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      return setErr("All fields are required to login.");
    }

    if (!validEmail(form?.email)) {
      return setErr("Please enter a valid email address.");
    }

    try {
      setLoading(true);

      const res = await axios.post(baseurl + "/api/auth/login", {
        email: form?.email,
        password: form?.password,
      });

      if(res.status === 200){
         navigate('/game');
      }

      setLoading(false);

    } catch (e){
      console.error(e);
      setLoading(false);
      setErr(e.response.data.message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div 
       initial = {{ opacity : 0, y: -20}}
       animate = {{opacity : 10, y : 0 }}
       transition = {{ duration : 0.5 }}
       className="bg-gray-800 m-20 rounded-xl w-full max-w-md p-10"
      >
        <h1 id="login-heading" className="text-3xl font-semibold text-yellow-500 text-center">Welcome to Colorwiz</h1>
        <p className="text-gray-300 text-center mt-2">Please log in to continue</p>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} aria-labelledby="login-heading">
          <div className="mt-6">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              ref={ref}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={handlechange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              aria-label="Email"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handlechange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              aria-label="Password"
              required
            />
          </div>

          {err && <p className="text-red-500 text-sm mt-2" role="alert">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 p-3 text-white rounded-lg bg-amber-500 font-serif transition-all ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-yellow-600"}`}
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin aria-hidden="true" /> 
            ) : (
              "Login"
            )}
          </button>
        </form>
      
        <p className="text-center text-gray-500 text-sm mt-5">
          Don’t have an account ? <Link to="/signin" className="text-yellow-400 font-serif hover:underline">Sign up</Link>
        </p>
      <p className="text-center text-gray-500 text-sm mt-3">
       <Link to={'/forget-password'}> <span className="font-normal cursor-pointer text-gray-500">forget password ?</span> </Link>
      </p>
      </motion.div>
    </div>
  );
}
