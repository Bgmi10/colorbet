import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCreditCard, faIndianRupee, faKey, faAngleDown, faAngleUp, faPlus, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { baseurl, payoutMethods } from "../../utils/constants";
import axios from "axios";
import Header from '../Header';

interface Bank{
    id: string;
    accountNumber: string;
    bankName: string;
    bankImage: string;
    accountHolderName: string;
}

export default function Withdraw() {
    //@ts-ignore
    const { user, setUser } = useContext(AuthContext);
    const [amount, setAmount] = useState(0);
    const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
    const [selectedBankAccount, setSelectedBankAccount] = useState<Bank | null>(null);
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isBankOpen, setIsBankOpen] = useState(false);
    const navigate = useNavigate();

    const commission = amount ? Number(amount) * 0.02 : 0;
    const totalAmount = amount ? Number(amount) - commission : 0;

    const handleInitiateWithdrawal = async () => {
        if (!amount || Number(amount) < 10) {
            setError("Minimum withdrawal amount is ₹10");
            return;
        }
        if (Number(amount) > 50000) {
            setError("Maximum withdrawal amount is ₹50,000");
            return;
        }
        if (!selectedBankAccount) {
            setError("Please select a bank account");
            return;
        }
        if (!selectedPayoutMethod) {
            setError("Please select a payout method");
            return;
        }
        if (error !== "password valid") {
            setError("Please enter valid password");
            return;
        }

        try {
            const res = await axios.post(`${baseurl}/api/withdrawal`, {
                amount: Number(amount) * 100,
                bankAccountId: selectedBankAccount?.id,
                payoutMethod: payoutMethods.find(method => method.id === selectedPayoutMethod)?.name,
                withdrawalFee: commission * 100
            }, { withCredentials: true });

            if (res.status === 200) {
                setUser((prev: Bank) => ({ ...prev, balance: res.data.updatedBalance }));
                setSuccess("Withdrawal request submitted successfully!");
                setIsBankOpen(false);
            }
        } catch (e: any) {
            setError(e.response?.data?.message || "Withdrawal failed");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setUserPassword(password);
        if (!password) {
            setError("");
            return;
        }
        try {
            const res = await axios.post(
                `${baseurl}/api/auth/checkpassword?password=${password}`, 
                {}, 
                { withCredentials: true }
            );
            setError(res.status === 200 ? "password valid" : "Invalid password");
        } catch {
            setError("Invalid password");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white mb-14">
            <Header title='Withdraw' link='/profile'/> 
            <main className="container mx-auto px-4 py-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-100 dark:bg-gray-800 rounded-lg p-6 mb-8"
                >
                    <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-white">Available Balance</h2>
                    <p className="text-2xl font-bold text-gray-700 dark:text-white">₹ {(user?.balance / 100).toFixed(2)}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                >
                    <label htmlFor="amount" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Withdrawal Amount</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faIndianRupee} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500" />
                        <input 
                            type="number" 
                            id="amount"
                            className="bg-white dark:bg-gray-800 w-full p-3 pl-10 rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            placeholder="Enter amount (Min ₹100, Max ₹50,000)"
                        />
                    </div>
                    <div className='flex justify-between'>
                        <div>
                           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                               Fee: ₹{commission.toFixed(2)} (2%)
                           </p>
                           <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                               Total amount: ₹{totalAmount.toFixed(2)}
                           </p>
                       </div>

                       <div className='mt-2'>
                           <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                               Min withdrawal: ₹10
                           </p>
                       </div>

                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                >
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Select</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[100, 500, 1000, 2000, 5000, 10000].map((value) => (
                            <button
                                key={value}
                                className={`p-2 rounded-md transition-colors ${
                                    amount === value 
                                        ? 'bg-yellow-500 text-gray-900' 
                                        : ' dark:bg-gray-800 bg-slate-100 text-gray-700 dark:text-white hover:bg-slate-200 dark:hover:bg-gray-700'
                                }`}
                                onClick={() => setAmount(value)}
                            >
                                ₹ {value}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-8"
                >
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Bank Account</h3>
                    <div 
                        className="bg-white dark:bg-gray-800 p-4 rounded-md flex justify-between items-center cursor-pointer mb-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-700"
                        onClick={() => setIsBankOpen(!isBankOpen)}
                    >
                        <div className='flex gap-2 items-center'>
                            <FontAwesomeIcon icon={faCreditCard} className='text-xl text-yellow-500' />
                            <span className='text-lg font-normal'>
                                {selectedBankAccount ? selectedBankAccount.bankName : 'Select Bank Account'}
                            </span>
                        </div>
                        <FontAwesomeIcon icon={isBankOpen ? faAngleUp : faAngleDown} className="text-gray-400" />
                    </div>
                    <AnimatePresence>
                        {isBankOpen && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 space-y-2 overflow-hidden"
                            >
                                {user.bankAccounts.map((bank: Bank) => (
                                    <motion.div 
                                        key={bank.id}
                                        className={`p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                                            selectedBankAccount?.id === bank.id 
                                                ? 'dark:bg-gray-800 border border-gray-300' 
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-yellow-500'
                                        }`}
                                        onClick={() => setSelectedBankAccount(bank)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                    <img 
                                                        src={bank.bankImage} 
                                                        alt={bank.bankName}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 dark:text-white">{bank.bankName}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {bank.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                                                    </span>
                                                </div>
                                            </div>
                                            {selectedBankAccount?.id === bank.id && (
                                                <FontAwesomeIcon icon={faCheck} className="text-yellow-500" />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                <motion.div
                                    className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => navigate('/bank-account')}
                                >
                                    <FontAwesomeIcon icon={faPlus} className="text-yellow-500" />
                                    <span className="text-gray-900 dark:text-white">Add Bank Account</span>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8"
                >
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Payout Method</h3>
                    {payoutMethods.map((method) => (
                        <div 
                            key={method.id}
                            className="bg-white dark:bg-gray-800 p-4 rounded-md flex justify-between items-center cursor-pointer mb-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-700"
                            onClick={() => setSelectedPayoutMethod(method.id)}
                        >  
                            <div className='flex gap-2 items-center'>
                                <span>{method.logo()}</span>
                                <span className='text-lg font-normal text-gray-900 dark:text-white'>{method.name}</span>
                            </div>
                            <div>
                                {selectedPayoutMethod === method.id && (
                                    <FontAwesomeIcon icon={faCheck} className="text-yellow-500" />
                                )}
                            </div>
                        </div>
                
                    ))}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mb-8"
                >
                    <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Login Password</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500" />
                        <input 
                            type="password" 
                            id="password"
                            className="bg-white dark:bg-gray-800 w-full p-3 pl-10 rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            value={userPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter login password"
                        />
                    </div>
                    {error && (
                        <p className={`mt-2 text-sm ${
                            error === "password valid" 
                                ? "text-green-500" 
                                : "text-red-500"
                        }`}>
                            {error === "password valid" ? "Password is valid" : error}
                        </p>
                    )}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <button 
                        className="w-full bg-yellow-500 text-gray-900 p-3 rounded-md font-bold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleInitiateWithdrawal}
                        disabled={!amount || !selectedBankAccount || !selectedPayoutMethod || error !== "password valid"}
                    >
                        Withdraw ₹{totalAmount.toFixed(2)}
                    </button>
                </motion.div>

                {success && (
                   <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                   >
                  <div className="dark:bg-gray-900 bg-slate-200 p-6 sm:p-6 rounded-xl shadow-xl w-full max-w-lg sm:max-w-md space-y-4 sm:space-y-2">
                    <div className="text-center mb-4 sm:mb-6">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-4xl sm:text-5xl text-green-500 mb-2" />
                      <h2 className="text-2xl sm:text-3xl font-semibold dark:text-white text-gray-700">Withdrawal Successful</h2>
                    </div>
                   <hr className="border-gray-700" />
                    <div className="space-y-3 sm:space-y-2">
                      <div className="flex justify-between items-center dark:bg-gray-800 bg-slate-300 p-3 sm:p-4 rounded-lg">
                        <span className="dark:text-gray-300 text-gray-700 text-sm sm:text-base">Amount</span>
                        <span className="text-green-500 text-lg font-medium">{amount}</span>
                      </div>
                      <div className="flex justify-between items-center dark:bg-gray-800 bg-slate-300 p-3 sm:p-4 rounded-lg">
                        <span className="dark:text-gray-300 text-gray-700 text-sm sm:text-base">Withdrawal Fee</span>
                        <span className="text-red-500 text-lg font-medium">-{commission.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center dark:bg-gray-800 bg-slate-300 p-3 sm:p-4 rounded-lg">
                        <span className="dark:text-gray-300 text-gray-700 text-sm sm:text-base">To Account</span>
                        <span className="text-green-500 text-lg font-medium">{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
              
                    {/* Bank Details */}
                    <div className="space-y-3 sm:space-y-2">
                      <div className="flex justify-between items-center dark:bg-gray-800 bg-slate-300 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <span className="dark:text-gray-300 text-gray-700 text-sm sm:text-base">Bank</span>
                          <img
                            src={selectedBankAccount?.bankImage}
                            alt="bankimage"
                            className="h-5 sm:h-6 w-5 sm:w-6 rounded-full"
                          />
                        </div>
                        <span className="dark:text-gray-300 text-gray-700 font-medium text-sm sm:text-base">{selectedBankAccount?.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center dark:bg-gray-800 bg-slate-300 p-3 sm:p-4 rounded-lg">
                        <span className="dark:text-gray-300 text-gray-700 text-sm sm:text-base">Account Number</span>
                        <span className="text-white font-medium text-sm sm:text-base">{selectedBankAccount?.accountNumber}</span>
                      </div>
                    </div>
              
                    {/* Divider */}
                    <hr className="border-gray-700" />
              
                    {/* Status */}
                    <div className="flex justify-between items-center dark:bg-gray-800 bg-slate-300 p-3 sm:p-4 rounded-lg">
                      <span className="dark:text-gray-300 text-gray-700 text-sm sm:text-base">Status</span>
                      <span className="text-red-500 text-lg font-medium">Pending</span>
                    </div>
              
                    {/* View Records Button */}
                    <div className="flex justify-center">
                      <Link
                        to="/withdrawal-records"
                        className="sm:mt-4 px-6 py-2 sm:py-3 w-full sm:w-auto text-center bg-yellow-500 text-gray-900 rounded-md font-serif hover:bg-yellow-600 transition duration-200"
                      >
                        View Records
                      </Link>
                    </div>
                  </div>
                </motion.div>
            )}              
            </main>
        </div>
    );
}

