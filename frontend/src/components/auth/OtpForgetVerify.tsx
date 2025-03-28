import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { baseurl } from "../../utils/constants";

export default function OtpSigninverify() {
  const [userInput, setUserInput] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canEnterOtp, setCanEnterOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const controls = useAnimation();
  const timerIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const user = JSON.parse(localStorage.getItem("user-forget-password-form") || "{}");

  const startTimer = () => {
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    setTimer(60);
    setCanEnterOtp(true);
    setCanResend(false);

    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          setCanResend(true);
          setCanEnterOtp(false);
          localStorage.removeItem('otpTimestamp');
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const storedTimestamp = localStorage.getItem("otpTimestamp");
    const currentTime = Date.now();

    if (storedTimestamp) {
      const elapsedTime = currentTime - parseInt(storedTimestamp);
      if (elapsedTime < 60000) {
        setTimer(60 - Math.floor(elapsedTime / 1000));
        setCanEnterOtp(true);   
        setCanResend(false);
        startTimer();
      } else {
        setCanResend(true);
        localStorage.removeItem('otpTimestamp');
        setCanEnterOtp(false);
      }
    } else {
      setCanResend(true);
      setCanEnterOtp(false);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

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
      const res = await axios.post(baseurl + "/api/auth/forgetpassword", {
        email: user.email,
        newpassword: user.newpassword,
        otp,
      });

      if (res.status === 200) {
        navigate("/login", { replace: true });
        localStorage.removeItem('user-forget-password-form');
        localStorage.removeItem('otpTimestamp');
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
      const res = await axios.post(`${baseurl}/api/auth/generate-forget-otp`, {
        email: user?.email,
      });
      setError(res.data?.message || "OTP resent successfully");
      startTimer();
      localStorage.setItem("otpTimestamp", Date.now().toString());
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 px-4">
      <div className="dark:bg-gray-800 bg-slate-100 p-8 rounded-lg shadow-lg max-w-md w-full">
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
              className="w-12 h-12 text-center text-2xl dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-700 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              aria-label={`Digit ${index + 1}`}
              disabled={!canEnterOtp}
            />
          ))}
        </motion.div>
        {error && error !== "otp sent sucessfully check your email" && (
          <p className="text-red-500 text-sm text-center mb-4" role="alert">
            {error}
          </p>
        )}
        {error === "otp sent sucessfully check your email" && (
          <p className="text-green-500 text-sm text-center mb-4" role="alert">
            {error}
          </p>
        )}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResendOtp}
              className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-200"
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
            <FontAwesomeIcon icon={faSpinner} spin className="text-amber-500 text-2xl" />
          </div>
        )}
      </div>
    </div>
  );
}

