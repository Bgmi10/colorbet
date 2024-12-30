import { useState, useEffect, useContext } from "react";
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faClock, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { baseurl, kotakPng } from "../../utils/constants";
import { useNavigate, useLocation } from "react-router-dom";
import PaymentSuccess from "./PaymentSuccess";
import PoweredBy from "./PoweredBy";
import { AuthContext } from "../../context/AuthContext";
//@ts-ignore
import profile from "../../../public/assets/profile.png";

const TIMER_DURATION = 5 * 60;
const STORAGE_KEY = 'payment_session';

interface PaymentSession {
  amount: string;
  endTime: number;
  started: boolean;
}
export default function ImpsService() {
  const [refNumber, setRefNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [amount, setAmount] = useState<string>("");
  //@ts-ignore
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  //@ts-ignore
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
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
      setInitialLoading(false);
    };

    fetchInitialData();
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
          upiRef: refNumber,
          amount: amount 
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUser((prev: any) => ({...prev, balance: prev.balance + res.data.payment.amount}));
        setData(res.data);
        setSuccess(true);
      }
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      setLoading(false);
      setErr(e.response?.data?.message || "Verification failed. Please try again.");
    }
  };

  const handleSuccessComplete = () => {
    navigate('/recharge-chip');
    clearSession();
  };

  return (
    <>
    { !success && <div className="flex justify-center dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="dark:bg-gray-800 bg-slate-100 m-4 mb-20 rounded-xl w-full max-w-md p-10"
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

          <div className="dark:bg-gray-700 bg-slate-200 p-6 rounded-lg mb-6">
            <div className="text-center">
              <span className="text-lg dark:text-gray-100 text-gray-600">Amount to Pay</span>
              <div className="text-3xl font-bold dark:text-gray-200 text-gray-700 mt-2 flex items-center justify-center">
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
                   <img src={kotakPng} alt="kotak" className="rounded-full w-5 h-5" /> 
                   <span className="font-medium">
                     Kotak Mahindra Bank</span>
                 </div>
              </div>
              <div className="flex justify-between">
                <span>Account Name:</span>
                <div className="flex gap-2 items-center">
                   <img src={profile} alt="subash-profile" className="h-5 w-5"/>
                   <span className="font-medium">Subash Chandra Bose R</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Account Number:</span>
                <div className="flex gap-2 items-center relative"> 
                 <div className="absolute left-[-25px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none"><g clip-path="url(#a)"><path fill="#50C878" d="m12 0 2.33 3.307 3.67-1.7.364 4.029L22.392 6l-1.699 3.67L24 12l-3.307 2.33 1.7 3.67-4.029.364L18 22.392l-3.67-1.699L12 24l-2.33-3.307-3.67 1.7-.364-4.029L1.608 18l1.699-3.67L0 12l3.307-2.33L1.607 6l4.029-.364L6 1.608l3.67 1.699L12 0Z" /><path stroke="#fff" stroke-width="3" d="m7 12.243 3.28 3.237L16.84 9"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z" strokeWidth={1}/></clipPath></defs></svg>
                 </div>
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
              <li>Copy the 12-digit reference number after payment</li>
              <li>Enter the 12-digit IMPS reference number below</li>
              <li>Click verify to complete the process</li>
            </ol>
          </div>
          {!success && (
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
          )}
            <PoweredBy />
        </motion.div>
      
    </div>}
    
     {success && (
      <PaymentSuccess  data={data} onComplete={handleSuccessComplete}/>
    )}
    </>
  );
}

