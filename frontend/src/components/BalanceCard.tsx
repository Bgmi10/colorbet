import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function BalanceCard (){
    //@ts-ignore
    const { user } = useContext(AuthContext);
    return(
        <>
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dark:bg-gray-800 bg-slate-100 rounded-lg p-6 mb-8"
            >
               <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-white">Available Balance</h2>
               <p className="text-2xl font-bold dark:text-white text-gray-700">₹ {(user?.balance / 100).toFixed(2)}</p>
            </motion.div>
        </>
    )
}