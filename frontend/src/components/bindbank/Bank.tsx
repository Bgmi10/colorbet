import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faExclamationCircle, faAngleDown, faBank, faEdit, faTrash, faPlus, faCheckCircle, faTimesCircle, faInfoCircle, faClose } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import Fuse from "fuse.js";
import BankList from "./BankList";
import { bankDatas, baseurl } from "../../utils/constants";
import axios from "axios";
import DeletePanel from "./DeletePanel";
import EditPanel from "./EditPanel";
import { toast } from "react-hot-toast";
import Header from "../Header";

interface Bank {
  id: string;
  bankName: string;
  imageUrl: string;
}

interface Form {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
  bankImage: string;
}
export default function Bank() {
  //@ts-ignore
  const { user, setUser } = useContext(AuthContext);
  const [isForm, setIsForm] = useState(false);
  const [isShowBankSearch, setIsShowBankSearch] = useState(false);
  const [searchedBankName, setSearchedBankName] = useState('');
  const [bankResults, setBankResults] = useState<Bank[] | null>(null);
  const [form, setForm] = useState<Form>({ accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "Select Bank Account*", upiId: "", bankImage: ""})
  const [error, setError] = useState('');
  const [deletepanel, setDeletePanel] = useState(false);
  const [selectiondelete, setSelectionDelete] = useState(null);
  const [iseditpanel, setIsEditPanel] = useState(false);
  const [selectionEdit, setSelectionEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fuseOptions = {
    includeScore: true,
    threshold: 0.2,
    keys: ['bankName'],
  };    

  useEffect(() => {
    const fuse = new Fuse(bankDatas, fuseOptions);
    const timeOut = setTimeout(() => {
      if (searchedBankName.trim() !== "") {
        const res = fuse.search(searchedBankName.trim());
        const a: any = res?.map((i) => i.item);
        setBankResults(a);
      } else {
        setBankResults([]);
      }
    }, 500);

    return () => clearTimeout(timeOut);
  }, [searchedBankName]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
    setError('');
  }

  const handleDeleteBankAccount = (i: any) => {
    setDeletePanel(true);
    setSelectionDelete(i);
  }

  const handleSubmitToBankBindApi = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!form.accountHolderName || !form.accountNumber || !form.bankName || !form.ifscCode){
        setError('Fill all the required fields');
        return;
    }
    
    try {
        setIsLoading(true);
        const res = await axios.post(`${baseurl}/api/add-bankaccount`, form, {
            withCredentials: true
        });
       
        if(res.status === 200){
           setForm({ accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "Select Bank Account*", upiId: "", bankImage: ""});
           setUser((prev: any) => ({
              ...prev, bankAccounts: [...prev.bankAccounts, res.data.bankAccount]
           }));
           setBankResults([]);
           setSearchedBankName('');
           setIsForm(false);
           toast.success("Bank account added successfully!");
        }
    } catch(e: any) {
        console.error(e);
        toast.error(e.response?.data?.message || "An error occurred");
        setError(e.response?.data?.message || "An error occurred");
    } finally {
        setIsLoading(false);
    }
  };

  return ( 
    <div className="min-h-screen dark:bg-gray-900 mb-20">
     <Header title="Bank Account Setup" link="/profile" />
      <AnimatePresence>
        {deletepanel && (
          <DeletePanel
            setUser={setUser}
            setDeletePanel={setDeletePanel}
            selectiondelete={selectiondelete}
            deleteIcon={<FontAwesomeIcon icon={faTrash} />}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto mt-8 px-4 lg:px-0 ">
        <BankList
          setBankResults={setBankResults}
          setIsShowBankSearch={setIsShowBankSearch}
          setSearchedBankName={setSearchedBankName}
          bankResults={bankResults}
          setForm={setForm}
          isShowBankSearch={isShowBankSearch}
        />

        {user?.bankAccounts?.length === 0 ? (
          <div className="rounded-lg p-6 lg:p-8">
            {!isForm ? (
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-700 text-4xl" />
                  <span className="dark:text-white text-gray-700 font-serif text-xl">No Bank Accounts Linked Yet!</span>
                </div>
                <motion.button
                  onClick={() => setIsForm(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md font-serif text-lg transition-colors duration-300 ease-in-out shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Bind Account
                </motion.button>
              </motion.div>
            ) : (
              <BankForm
                form={form}
                handleFormChange={handleFormChange}
                handleSubmit={handleSubmitToBankBindApi}
                error={error}
                setIsShowBankSearch={setIsShowBankSearch}
                isLoading={isLoading}
              />
            )}
          </div>
        ) : (
          <>
            <AnimatePresence>
                {iseditpanel && (
                <EditPanel
                  setUser={setUser}
                  setForm={setForm}
                  selectionEdit={selectionEdit}
                  setIsEditPanel={setIsEditPanel}
                  setError={setError}
                  form={form}
                  handleFormChange={handleFormChange}
                  error={error}
                  setIsShowBankSearch={setIsShowBankSearch}
                />
              )}
            </AnimatePresence>
            
            <div className="flex justify-end mb-4">
              <motion.button
                onClick={() => {
                  setIsForm(true);
                  setIsEditPanel(false);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-serif text-sm sm:text-base transition-colors duration-300 ease-in-out flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span className="hidden sm:inline">Add Another</span>
                <FontAwesomeIcon icon={faBank} className="sm:ml-2" />
              </motion.button>    
            </div>
            
            <AnimatePresence>
              {isForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-8"
                >
                  <BankForm
                    form={form}
                    handleFormChange={handleFormChange}
                    handleSubmit={handleSubmitToBankBindApi}
                    error={error}
                    setIsShowBankSearch={setIsShowBankSearch}
                    isLoading={isLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isForm && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {user?.bankAccounts?.map((account: any) => (
                  <BankCard
                    key={account?.id}
                    account={account}
                    onEdit={() => {
                      setIsEditPanel(true);
                      setSelectionEdit(account);
                      setIsForm(false);
                      setForm({
                        accountNumber: account?.accountNumber,
                        accountHolderName: account?.accountHolderName,
                        bankName: account?.bankName,
                        upiId: account?.upiId,
                        ifscCode: account?.ifscCode,
                        bankImage: account?.bankImage
                      });
                    }}
                    onDelete={() => handleDeleteBankAccount(account)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BankForm({ form, handleFormChange, handleSubmit, error, setIsShowBankSearch, isLoading }: {
  form: Form,
  handleFormChange: any,
  handleSubmit: any,
  error: string,
  setIsShowBankSearch: any,
  isLoading: boolean
}) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
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
        onKeyDown={(e) => {
          if(e.key === "e" || e.key === "-" || e.key === "+"){
            e.preventDefault();
          }
        }}
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
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md font-serif text-lg transition-colors duration-300 ease-in-out disabled:opacity-50 shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? "Submitting..." : "Submit For Verification"}
      </motion.button>
    </motion.form>
  );
}

function BankCard({ account, onEdit, onDelete }: { account: any, onEdit: any, onDelete: any}) {
  const isVerified = account?.accountStatus?.[0]?.verified ?? false;  
  const [isshowrules, setIshShowRules] = useState(false);
  const handleShowRules = () => {
    setIshShowRules(p => !p);
  }
  return  (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className={`p-2 text-center text-white flex justify-between ${isVerified ? 'bg-green-500' : 'bg-red-500'}`}>
        <div className="justify-center flex items-center gap-2">
          {isVerified ? (
            <><FontAwesomeIcon icon={faCheckCircle} />Verified</>
          ) : (
            <><FontAwesomeIcon icon={faTimesCircle} /> Not Verified yet</>
          )}
        </div>
        <AnimatePresence>
      {isshowrules && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl m-4"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Verification Status</h2>
                <button
                  onClick={() => setIshShowRules(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faClose} className="text-2xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl mt-1" />
                  <div>
                    <p className="text-green-600 dark:text-green-200">Account is verified. You can now withdraw money.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-red-100 dark:bg-red-900 p-4 rounded-lg">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-xl mt-1" />
                  <div>
                    <p className="text-red-600 dark:text-red-200">Your account is undergoing verification. We will notify you upon completion.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-gray-500 text-xl mt-1" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-200">
                      Once your account is verified, you'll be able to edit your bank details. However, any changes made will require re-verification to ensure security and accuracy.
                    </p>
                  </div>
                </div>
              </div>

             
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
        <div>
          <FontAwesomeIcon icon={faInfoCircle} onClick={handleShowRules} className="cursor-pointer"/>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-3 items-center mb-2">
        <img src={account?.bankImage} alt="" className="rounded-full h-6 w-6" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{account?.bankName}</h3>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p>Account Holder: {account?.accountHolderName}</p>
          <p>Account Number: {account?.accountNumber.replace(/\d(?=\d{4})/g, "*")}</p>
          <p>IFSC Code: {account?.ifscCode}</p>
          {account?.upiId && <p>UPI ID: {account?.upiId}</p>}
        </div>
      </div>
      <div className="flex justify-end p-4 bg-gray-100 dark:bg-gray-700">
        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={isVerified ? "text-blue-500 hover:text-blue-600 mr-4" : "text-gray-500 hover:text-gray-600 mr-4"}
          disabled={!isVerified}
        >
          <FontAwesomeIcon icon={faEdit} />
        </motion.button>
        <motion.button
          onClick={onDelete}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={isVerified ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600"}
          disabled={!isVerified}
        >
          <FontAwesomeIcon icon={faTrash} />
        </motion.button>
      </div>
    </motion.div>
    </>
  )
}
  ;

