import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from './Confetti';
//@ts-ignore
import verifiedImg from "../../../public/assets/verified.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBank, faIndianRupee, faUser, faMobile, faFileLines, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { kotakPng } from '../../utils/constants';
import PoweredBy from './PoweredBy';

export default function PaymentSuccess({ data, onComplete }: { data: any, onComplete: any }) {
  const [redirectCountdown, setRedirectCountdown] = useState(15);

  useEffect(() => {
   const timer = setInterval(() => {
     setRedirectCountdown((prev) => {
         if (prev <= 1) {
           clearInterval(timer);
           onComplete();
           return 0;
         }
         return prev - 1;
       });
     }, 1000);
     return () => clearInterval(timer);
   }, [onComplete]);

  return (
    <AnimatePresence>
      <div className="min-h-screen dark:bg-gray-900  flex justify-center items-start pt-5 px-4 mb-16 ">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="w-full max-w-md relative overflow-hidden rounded-xl dark:bg-gray-800  shadow-lg pb-10"
        >
          {/* Success Header */}
          <div className=" bg-green-50 p-6 text-center relative overflow-hidden">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 0, 0],
              }}
              transition={{ 
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="inline-block mb-3"
            >
              <div className="bg-green-100 p-3 rounded-full inline-block">
                <img src={verifiedImg} alt="verified" className="h-8 w-8" />
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-green-700 mb-2"
            >
              Payment Successful!
            </motion.h2>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold text-gray-800"
            >
              <FontAwesomeIcon icon={faIndianRupee} className="text-2xl" />
              <span className="ml-1">{data?.payment?.amount / 100}</span>
            </motion.div>
          </div>

          {/* Transaction Details */}
          <div className="p-6 space-y-4">
            {/* From Section */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">From</span>
                <FontAwesomeIcon icon={faBank} className="text-blue-600" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400 w-5" />
                  <span className="ml-2 text-gray-600 dark:text-gray-100">{data?.payment?.senderName}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faMobile} className="text-gray-400  w-5" />
                  <span className="ml-2 text-gray-600 dark:text-gray-100">{data?.payment?.senderMobile}xxxxx</span>
                </div>
              </div>
            </div>

            {/* To Section */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">To</span>
                <img src={kotakPng} alt="kotak-bank" className="h-6 w-6 rounded-full" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400 w-5" />
                  <span className="ml-2 text-gray-600 dark:text-gray-100">Subash Chandra Bose R</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faBank} className="text-gray-400 w-5" />
                  <span className="ml-2 text-gray-600 dark:text-gray-100">Kotak Mahindra Bank</span>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-2">
              {data?.payment?.remarks && (
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFileLines} className="text-gray-400 w-5" />
                  <span className="ml-2 text-gray-600 dark:text-gray-100">{data?.payment?.remarks}</span>
                </div>
              )}
              <div className="flex items-center">
                <FontAwesomeIcon icon={faHashtag} className="text-gray-400 w-5" />
                <span className="ml-2 text-gray-600 dark:text-gray-100">IMPS Ref: {data?.payment?.upiRef}</span>
              </div>
            </div>

            {/* Redirect Message */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
              }}
              className="text-center text-sm text-red-500 mt-6"
            >
              Redirecting in {redirectCountdown} seconds...
            </motion.div>
          </div>
         <PoweredBy />
          <motion.div
            className="absolute inset-0 bg-green-500 opacity-5"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
            }}
          />
          <Confetti />
          
        </motion.div>
        
      </div>
     
    </AnimatePresence>
  );
}