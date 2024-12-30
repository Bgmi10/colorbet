import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { baseurl } from "../../utils/constants";
import ButtonLoader from "./ButtonLoader";
import { toast } from "react-hot-toast";

export default function DeletePanel({ setDeletePanel, selectiondelete, deleteIcon, setUser }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete(`${baseurl}/api/add-bankaccount/${selectiondelete?.id}`, { withCredentials: true });
      
      if (res.status === 200) {
        setUser((prev) => ({
          ...prev,
          bankAccounts: prev.bankAccounts.filter((i) => i?.id !== res.data.restData.id),
        }));
        setDeletePanel(false);
        toast.success("Bank account deleted successfully");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete bank account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-auto shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Are you sure you want to delete the account for {selectiondelete.bankName}?
          All your transactions records belongs to this bank will be lost
        </p>
        <div className="flex justify-end gap-3">
          <motion.button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md font-medium transition-colors duration-300 ease-in-out"
            whileHover={{ scale: 1.02, backgroundColor: "#d1d5db" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDeletePanel(false)}
          >
            Cancel
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-red-500 text-white rounded-md font-medium transition-colors duration-300 ease-in-out"
            whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDeleteAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <ButtonLoader value="Deleting" loader={true} />
            ) : (
              <>
                {deleteIcon} Delete
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

