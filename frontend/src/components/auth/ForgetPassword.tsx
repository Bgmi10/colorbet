import React, { useState, useEffect, useRef } from "react"
import { motion } from 'framer-motion'
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { validEmail } from "../../utils/constants"


export default function ForgetPassword() {
  const [form, setForm] = useState(() => {
    const data = localStorage.getItem('user-forget-password-form');
    return data ? JSON.parse(data) : null   
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    localStorage.setItem('user-forget-password-form', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErr('');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form?.email || !form?.newpassword) {
      setErr('All fields are required');
      setLoading(false);
      return;
    }
    if (!validEmail(form?.email)) {
      setErr('Email is not valid')
      setLoading(false)
      return
    }

    // Simulating API call
    setTimeout(() => {
      setLoading(false)
      navigate('/otp-forget-verify')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 m-4 rounded-xl w-full max-w-md p-8"
      >
        <h1 id="forget-password-heading" className="text-3xl font-semibold text-yellow-500 text-center">Reset Password</h1>
        <p className="text-gray-300 text-center mt-2">Enter your email and new password</p>

        <form onSubmit={handleSubmit} aria-labelledby="forget-password-heading">
          <div className="mt-6">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={form?.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              aria-label="Email"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="newpassword" className="sr-only">New Password</label>
            <input
              type="password"
              id="newpassword"
              name="newpassword"
              placeholder="New Password"
              value={form?.newpassword}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              aria-label="New Password"
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
              "Change Password"
            )}
          </button>
        </form>
      
        <p className="text-center text-gray-500 text-sm mt-5">
          Remember your password? <Link to="/login" className="text-yellow-400">Login</Link>
        </p>
      </motion.div>
    </div>
  )
}

