import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import {  validEmail } from "../../utils/constants";

export default function SignIn() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("user-form", JSON.stringify(form));
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required to sign up.");
    }

    if (!validEmail(form.email)) {
      return setError("Please enter a valid email address.");
    }

    navigate('/otp-signin-verify');
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dark:bg-gray-800  bg-slate-100 p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-semibold text-yellow-500 text-center">
          Create an Account
        </h2>
        <p className="text-gray-300 text-center mt-2">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <input
              type="text"
              ref={nameInputRef}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-700 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-700 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-700 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
              role="alert"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white rounded-lg font-serif transition-all ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 font-serif hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

