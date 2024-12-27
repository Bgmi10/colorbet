import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from './Confetti';
import verifiedImg from "../../../public/assets/verified.png";

interface PaymentSuccessProps {
  amount: string;
  onComplete: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ data, onComplete }: { data: any, onComplete: () => {}}) => {
  const [redirectCountdown, setRedirectCountdown] = useState(1000);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setRedirectCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           onComplete();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [onComplete]);

  return (
    <AnimatePresence>
        <div className='justify-center flex '>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative overflow-hidden mb-4 p-6 bg-green-800 text-green-100 rounded-lg text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360, 360],
          }}
          transition={{ 
            duration: 1.5,
            times: [0, 0.5, 1],
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="text-6xl mb-4 inline-block"
        >
          <img src={verifiedImg} alt="verified img" className='h-6 w-6' />
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-3"
        >
          Payment Successful!
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl mb-4"
        >
          Amount: ₹{data?.amount / 100}
        </motion.p>
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
          }}
          className="mt-4 text-lg font-semibold"
        >
          Redirecting in {redirectCountdown} seconds...
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-green-700 opacity-30"
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
};
