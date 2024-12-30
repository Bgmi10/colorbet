import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { baseurl } from "../../utils/constants";
import ButtonLoader from "./ButtonLoader";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function EditPanel({ form, handleFormChange, setIsShowBankSearch, error, setError, setIsEditPanel, selectionEdit, setUser, setForm}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleEditBankApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accountHolderName || !form.accountNumber || !form.bankName || !form.ifscCode) {
      setError('Fill all the required fields');
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.put(`${baseurl}/api/edit-bankaccount/${selectionEdit.id}`, form, { withCredentials: true });
      
      if (res.status === 200) {
        setForm({ accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "Select Bank Account*", upiId: "", bankImage: ""});
        setUser((prev) => ({
          ...prev,
          bankAccounts: prev.bankAccounts.map((account) =>
            account.id === selectionEdit.id ? res.data.updatedBankData : account
          ),
        }));
        setIsEditPanel(false);
        toast.success("Bank account updated successfully");
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "An error occurred");
      toast.error(e.response?.data?.message || "Failed to update bank account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 z-20 flex items-center justify-center p-4"
    >
      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-auto shadow-lg space-y-4"
        onSubmit={handleEditBankApi}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Bank Account</h2>
        <input 
          type="text"
          name="accountHolderName"
          value={form.accountHolderName}
          onChange={handleFormChange}
          placeholder="Account Holder Name*" 
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
        />
        <input 
          type="number" 
          name="accountNumber"
          value={form.accountNumber}
          onChange={handleFormChange}
          placeholder="Account Number*" 
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
        />
        <div className="relative">
          <input
            type="text"
            placeholder="Select Bank"
            value={form.bankName}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 cursor-pointer"
            onClick={() => setIsShowBankSearch(true)}
            readOnly
          />
          <FontAwesomeIcon icon={faAngleDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <input 
          type="text" 
          name="ifscCode"
          value={form.ifscCode}
          onChange={handleFormChange}
          placeholder="IFSC Code*" 
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
        />
        <input 
          type="text" 
          name="upiId"
          value={form.upiId}
          onChange={handleFormChange}
          placeholder="UPI ID (optional)" 
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <div className="flex justify-end gap-3 mt-6">
          <motion.button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md font-medium transition-colors duration-300 ease-in-out"
            whileHover={{ scale: 1.02, backgroundColor: "#d1d5db" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditPanel(false)}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="px-4 py-2 bg-yellow-500 text-white rounded-md font-medium transition-colors duration-300 ease-in-out"
            whileHover={{ scale: 1.02, backgroundColor: "#eab308" }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ButtonLoader value="Saving" loader={true} />
            ) : (
              "Save Changes"
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}

