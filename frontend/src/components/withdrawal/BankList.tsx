import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";

interface Bank {
  id: string;
  bankName: string;
  imageUrl: string;
}

interface BankListProps {
  setIsShowBankSearch: (show: boolean) => void;
  isShowBankSearch: boolean;
  bankResults: Bank[] | null;
  setBankResults: (results: Bank[] | null) => void;
  setForm: any;
  setSearchedBankName: (name: string) => void;
}

export default function BankList({
  setIsShowBankSearch,
  isShowBankSearch,
  bankResults,
  setBankResults,
  setForm,
  setSearchedBankName,
}: BankListProps) {
  return (
    <AnimatePresence>
      {isShowBankSearch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-auto shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-yellow-500 text-2xl font-serif">Search Your Bank</h2>
              <button 
                onClick={() => setIsShowBankSearch(false)} 
                className="text-yellow-500 hover:text-yellow-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter bank name"
                  className="w-full p-3 pl-10 text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                  onChange={(e) => setSearchedBankName(e.target.value)}
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="max-h-60 overflow-scroll overflow-x-hidden dark:scrollbar-track-gray-700">
                {bankResults?.length === 0 && (
                  <div className="text-red-500 dark:text-red-400 text-center py-4">No match found</div>
                )}
                {bankResults &&
                  bankResults.map((bank: Bank) => (
                    <motion.div
                      key={bank.id}
                      className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200"
                      onClick={() => {
                        setForm(prev => ({...prev, bankName: bank.bankName, bankImage: bank.imageUrl || 'https://img.freepik.com/premium-photo/bank-money-finance_557469-13537.jpg?ga=GA1.1.1168591914.1718009553&semt=ais_hybrid'}))
                        setIsShowBankSearch(false);
                        setBankResults([]);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={bank.imageUrl || 'https://img.freepik.com/premium-photo/bank-money-finance_557469-13537.jpg?ga=GA1.1.1168591914.1718009553&semt=ais_hybrid'}
                        alt={bank.bankName}
                        className="h-10 w-10 rounded-full object-cover mr-4"
                      />
                      <span className="text-gray-800 dark:text-white font-medium">{bank.bankName}</span>
                    </motion.div>
                  ))}
              </div>
            </div>
            <motion.button
              onClick={() => setIsShowBankSearch(false)}
              className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-serif px-6 py-3 rounded-md text-lg transition-colors duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

