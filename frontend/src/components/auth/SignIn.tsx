import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseurl, validEmail } from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function SignIn() {
    
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const nameInputRef = useRef(null); 

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!form.name || !form.email || !form.password) {
      return setErr("All fields are required to sign up.");
    }

    if (!validEmail(form?.email)) {
      return setErr("Please enter a valid email address.");
    }

    try {
      setLoading(true);
      const res = await axios.post(baseurl + "/api/auth/signin", {
        name: form?.name,
        email: form?.email,
        password: form?.password,
      });

      if (res.status === 200) {
        navigate('/game');
      }

      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setErr(e.response?.data?.message || "Sign up failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-yellow-500 text-center">
          Create an Account
        </h2>
        <p className="text-gray-300 text-center mt-2">Sign up to get started</p>

        <form onSubmit={handleSubmit} aria-labelledby="signup-form" className="mt-6">
          <div className="mt-6">
            <input
              type="text"
              ref={nameInputRef}
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              aria-label="Name"
              required
            />
          </div>

          <div className="mt-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              aria-label="Email"
              required
            />
          </div>

          <div className="mt-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              aria-label="Password"
              required
            />
          </div>

          {err && (
            <p className="text-red-500 text-sm mt-2" role="alert" aria-live="assertive">
              {err}
            </p>
          )}

          <button
            type="submit" 
            disabled={loading}
            className={`w-full mt-6 p-3 text-white rounded-lg bg-amber-500 font-serif transition-all ${
              loading ? "cursor-not-allowed opacity-50" : "hover:bg-yellow-600"
            }`}
            aria-busy={loading} 
            aria-live="polite"
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin aria-hidden="true" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account? <Link to="/login" className="text-yellow-400">Log in</Link>
        </p>
      </div>
    </div>
  );
}
