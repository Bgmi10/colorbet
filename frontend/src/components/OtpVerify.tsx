import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { baseurl } from "../utils/constants";

export default function OtpVerify() {
  const [userInput, setUserInput] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canEnterOtp, setCanEnterOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [redirectCounter, setRedirectCounter] = useState(15);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const controls = useAnimation();

  const user = JSON.parse(localStorage.getItem("user-form") || "{}");

//   useEffect(() => {
//     // Check if the user came from the sign-up page
//     if (!user.email || !location.state?.fromSignUp) {
//       navigate('/login', { replace: true });
//       return;
//     }

//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus();
//     }
//     checkTimerStatus();

//     // Cleanup function
//     return () => {
//       localStorage.removeItem("otpTimestamp");
//     };
//   }, [navigate, location.state, user.email]);

  useEffect(() => {
    const storedTimestamp = localStorage.getItem("otpTimestamp");
    const currentTime = Date.now();

    if (storedTimestamp) {
      const elapsedTime = currentTime - parseInt(storedTimestamp);
      if (elapsedTime < 60000) {
        setTimer(60 - Math.floor(elapsedTime / 1000));
        setCanEnterOtp(true);
        setCanResend(false);
      } else {
        setCanResend(true);
        setCanEnterOtp(false);
      }
    } else {
      setCanResend(true);
      setCanEnterOtp(false);
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          setCanEnterOtp(false);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const checkTimerStatus = () => {
    const storedTimestamp = localStorage.getItem("otpTimestamp");
    if (storedTimestamp) {
      const elapsedSeconds = Math.floor(
        (Date.now() - parseInt(storedTimestamp)) / 1000
      );
      if (elapsedSeconds < 60) {
        setTimer(60 - elapsedSeconds);
        setCanEnterOtp(true);
        setCanResend(false);
      } else {
        setCanResend(true);
        setCanEnterOtp(false);
      }
    } else {
      setCanResend(true);
      setCanEnterOtp(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (isNaN(Number(value))) return;

    const newUserInput = [...userInput];
    newUserInput[index] = value.slice(0, 1);
    setUserInput(newUserInput);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newUserInput.every((digit) => digit !== "")) {
      handleSubmit(newUserInput.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (index > 0 && !userInput[index]) {
        inputRefs.current[index - 1]?.focus();
      }
      const newUserInput = [...userInput];
      newUserInput[index] = "";
      setUserInput(newUserInput);
      e.preventDefault();
    }
  };

  const handleSubmit = async (otp: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(baseurl + "/api/auth/signin", {
        name: user.name,
        email: user.email,
        password: user.password,
        otp,
      });

      if (res.status === 200) {
        navigate("/game", { replace: true });
      } else {
        throw new Error(res.data?.message || "Invalid OTP");
      }
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "An error occurred");
      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 },
      });
    } finally {
      setLoading(false);
      setUserInput(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseurl}/api/auth/generate-signin-otp`, {
        email: user?.email,
      });
      setError(res.data?.message || "OTP resent successfully");
      setTimer(60);
      setCanResend(false);
      setCanEnterOtp(true);
      localStorage.setItem("otpTimestamp", Date.now().toString());
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error === "user with this email is already exist try to login") {
      const redirectInterval = setInterval(() => {
        setRedirectCounter((prev) => {
          if (prev <= 1) {
            clearInterval(redirectInterval);
            navigate('/login', { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(redirectInterval);
    }
  }, [error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-yellow-500 text-center mb-6">
          Verify your OTP
        </h2>
        <motion.div animate={controls} className="flex justify-center space-x-2 mb-6">
          {userInput.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-2xl bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              aria-label={`Digit ${index + 1}`}
              disabled={!canEnterOtp}
            />
          ))}
        </motion.div>
        {error && error !== "otp sent to your email. please verify it" && (
          <p className="text-red-500 text-sm text-center mb-4" role="alert">
            {error}
          </p>
        )}
        {error === "otp sent to your email. please verify it" && (
          <p className="text-green-500 text-sm text-center mb-4" role="alert">
            {error}
          </p>
        )}
        {error === "user with this email is already exist try to login" && (
          <p className="text-yellow-500 text-sm text-center mb-4" role="alert">
            Redirecting to login page in {redirectCounter} seconds
          </p>
        )}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResendOtp}
              className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white transition-colors duration-200"
              disabled={loading}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Send OTP"}
            </button>
          ) : (
            <p className="text-gray-400">
              Resend OTP in {timer} seconds
            </p>
          )}
        </div>
        {loading && !canResend && (
          <div className="text-center mt-4">
            <FontAwesomeIcon icon={faSpinner} spin className="text-yellow-500 text-2xl" />
          </div>
        )}
      </div>
    </div>
  );
}

