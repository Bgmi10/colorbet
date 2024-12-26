import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faClock, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { baseurl } from "../../utils/constants";
import { useNavigate, useLocation } from "react-router-dom";

const TIMER_DURATION = 5 * 60; // 5 minutes in seconds
const STORAGE_KEY = 'payment_session';

interface PaymentSession {
  amount: string;
  endTime: number;
  started: boolean;
}

export default function PaymentVerification() {
  const [refNumber, setRefNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [amount, setAmount] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlAmount = searchParams.get('amount');
    
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (storedSession) {
      const session: PaymentSession = JSON.parse(storedSession);
      const remaining = Math.floor((session.endTime - Date.now()) / 1000);
      
      if (remaining > 0 && session.started) {
        setAmount(session.amount);
        setTimeLeft(remaining);
      } else {
        clearSession();
        if (!urlAmount) {
          navigate('/recharge-chip');
          return;
        }
      }
    } else if (urlAmount) {
      // Start new session
      const session: PaymentSession = {
        amount: urlAmount,
        endTime: Date.now() + TIMER_DURATION * 1000,
        started: true
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setAmount(urlAmount);
    } else {
      navigate('/recharge-chip');
    }
  }, [location, navigate]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      clearSession();
      navigate('/recharge-chip');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTimeLeft(0);
    setAmount("");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeLeft <= 0) {
        clearSession();
      }
    };
  }, [timeLeft]);

  const handleSubmit = async () => {
    if (!refNumber) {
      return setErr("Please enter the reference number.");
    }

    try {
      setLoading(true);
      setErr("");

      const res = await axios.post(
        `${baseurl}/api/payment/imps`,
        { 
          referenceNumber: refNumber,
          amount: amount 
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setSuccess(true);
        clearSession();
        setTimeout(() => {
          navigate('/recharge-chip');
        }, 2000);
      }
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      setLoading(false);
      setErr(e.response?.data?.message || "Verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dark:bg-gray-800 bg-slate-100 m-20 rounded-xl w-full max-w-md p-10"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-yellow-500">
            Complete Payment
          </h1>
          <div className="flex items-center gap-2 text-red-500">
            <FontAwesomeIcon icon={faClock} />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="dark:bg-gray-700 bg-gray-400 p-6 rounded-lg mb-6">
          <div className="text-center">
            <span className="text-lg text-gray-100">Amount to Pay</span>
            <div className="text-3xl font-bold text-white mt-2 flex items-center justify-center">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-2" />
              {amount}
            </div>
          </div>
        </div>

        <div className="dark:bg-gray-700 bg-gray-100 p-4 rounded-lg border border-gray-600 mb-6">
          <h3 className="font-medium text-yellow-500 mb-4">
            Bank Transfer Details
          </h3>
          <div className="space-y-3 text-sm dark:text-gray-300 text-gray-700">
            <div className="flex justify-between">
              <span>Bank Name:</span>
              <div className="flex gap-2 items-center">
                 <img src="https://netbanking.kotak.com/knb2/favicon.ico" alt="kotak" className="rounded-full w-5 h-5" /> 
                 <span className="font-medium">
                   Kotak Mahindra Bank</span>
               </div>
            </div>
            <div className="flex justify-between">
              <span>Account Name:</span>
              <div className="flex gap-2 items-center">
                 <img src="https://lh3.googleusercontent.com/ogw/AF2bZyiXtcpbiTPAc9nDs-LGyYCzKLtHKUG85VTA1GqCcb7MNaw=s32-c-mo" alt="subash-profile" className="h-5 w-5"/>
                 <span className="font-medium">Subash Chandra Bose R</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Account Number:</span>
              <div className="flex gap-2 items-center">
                 <img src="https://www.f-cdn.com/assets/main/en/assets/badges/verified/verified-v2.svg" alt="subash-profile" className="h-4 w-4"/>
                 <span className="font-medium">8947360713</span>
              </div>
             
            </div>
            <div className="flex justify-between">
              <span>IFSC Code:</span>
              <span className="font-medium">KKBK0008486</span>
            </div>
          </div>
        </div>

        <div className="dark:bg-gray-700  p-4 rounded-lg mb-6">
          <p className="text-yellow-500 font-medium mb-2">Important Steps:</p>
          <ol className="list-decimal ml-4 text-sm dark:text-gray-300  text-gray-500 space-y-1">
            <li>Transfer exactly ₹{amount} using IMPS</li>
            <li>Copy the reference number after payment</li>
            <li>Enter the reference number below</li>
            <li>Click verify to complete the process</li>
          </ol>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter IMPS Reference Number"
              value={refNumber}
              onChange={(e) => {
                setRefNumber(e.target.value);
                setErr("");
              }}
              className="w-full p-3 dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-700 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          {err && (
            <p className="text-red-500 text-sm mb-4" role="alert">
              {err}
            </p>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-800 text-green-100 rounded-lg">
              Payment verified successfully! Redirecting...
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white rounded-lg bg-amber-500 font-serif transition-all ${
              loading ? "cursor-not-allowed opacity-50" : "hover:bg-yellow-600"
            }`}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin /> 
            ) : (
              "Verify Payment"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}