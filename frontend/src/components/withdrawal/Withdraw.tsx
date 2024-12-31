import { useContext, useEffect, useState } from "react";
import Header from "../Header";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faBank, faCheck, faClose, faCreditCard, faIndianRupee, faKey, faPlus, faWallet } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { baseurl } from "../../utils/constants";

export default function Withdraw (){

    interface BankAccount { 
        accountHolderName: string;
        accountNumber: string;
        bankName: string;
        ifscCode: string;
        upiId: string;
        bankImage: string;
        id: string
        
    }
        //@ts-ignore
    const { user, setUser } = useContext(AuthContext);
    const [useramount, setUserAmount] = useState(0);
    const [bankpayoutmethod, setBankPayOutMethod] = useState('Imps Transfer');
    const commission: any =( useramount * 0.02).toFixed(2);
    const [isbankopen, setIsBankOpen] = useState(false);
    const totalAmount = (useramount - commission).toFixed(2);
    const [selectedbankaccount, setSelectedBankAccount] = useState<null | BankAccount>(null);
    const [userpassword, setUserPassword] = useState('');
    const navigate = useNavigate();   
    const [error, setError] = useState('');

    const payoutMethods = [
        {
            id: '1',
            name: 'Upi Transfer',
            logo: <FontAwesomeIcon icon={faWallet} className="text-yellow-500" />
        },
        {
            id: '2',
            name: 'Imps Transfer',
            logo: <FontAwesomeIcon icon={faBank} className="text-yellow-500" />
        }
    ]

    const checkPassword = async () => {
        try{
            const res = await axios.post(`${baseurl}/api/auth/checkpassword?password=${userpassword}`, {}, { withCredentials: true });
            if(res.status === 200){
                setError('password valid');
            }
        }
        catch(e){
            console.log(e);
            setError('not matched')
        }

    }

    useEffect(() => {
        const timer = setTimeout(() => {
            checkPassword();
        }, 1000);

        return () => clearTimeout(timer);
    },[userpassword]);

    const handleSubmit = async() => {
        if(!useramount || !selectedbankaccount){
            return;
        }

        try{
            const res = await axios.post(`${baseurl}/api/withdrawal`, { amount: parseInt(useramount), bankAccountId: selectedbankaccount?.id, payoutMethod: bankpayoutmethod }, { withCredentials: true });
            if(res.status === 200){
               setUser((prev) => ({ ...prev, balance: res.data.updatedBalance }))
            }
        }
        catch(e){
            console.log(e);
        }

        
    }


    return(
        <>
           <div className="dark:bg-gray-900 bg-white">
               <Header title="Withdrawal" link="/profile"/>
               <div className="justify-center flex gap-3 text-white lg:text-2xl mt-10">
                 <span>Available Balance</span>
                 <span><FontAwesomeIcon icon={faIndianRupee} /> {(user?.balance / 100).toFixed(2)}</span>
               </div>
               <div className="justify-center flex p-10 items-center">
                  <input type="number" onChange={(e: any) => setUserAmount(e.target.value)} onKeyDown={(e) => {
                    if(e.key === "e" || e.key === "-"  ||  e.key === "+"){
                        e.preventDefault();
                    }
                  }} placeholder="Enter Withdrawal Amount" className="p-3 pl-6 rounded-md dark:bg-gray-800 font-serif bg-slate-200 outline-none dark:text-white text-gray-700 w-full" />
                  <FontAwesomeIcon icon={faIndianRupee} className=" left-2 ml-10 absolute text-yellow-500" />
               </div>
               <div className="justify-start p-10 dark:text-white text-gray-700">
                  <span>Fee: {commission}</span> to <span>Account: {totalAmount}</span>
               </div>
               <div className="p-10  text-lg font-bold flex-col flex gap-2">
                   <span className="text-yellow-500">Pay Out Methods</span>
                   {payoutMethods.map((method) => (
                        <div 
                            key={method.id}
                            className="dark:bg-gray-800 bg-gray-600 p-4 rounded-md flex justify-between items-center cursor-pointer mb-2 hover:bg-gray-700 transition-colors"
                            onClick={() => setBankPayOutMethod(method.name)}
                        >  
                            
                            <div className='flex gap-2 items-center'>
                                <span>{method.logo}</span>
                                <span className='text-lg font-normal dark:text-white  text-gray-700'>{method.name}</span>
                            </div>
                            <div>
                                {bankpayoutmethod === method.name && (
                                    <FontAwesomeIcon icon={faCheck} className="text-yellow-500" />
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="">
                      
                      <div className="justify-between flex cursor-pointer bg-gray-800 p-4 rounded-md items-center" onClick={() => setIsBankOpen(p => !p)}>
                        <div className="flex items-center gap-2">
                           <FontAwesomeIcon icon={faCreditCard} className={isbankopen ? "text-yellow-500" : "text-gray-500"} />
                           <span className="dark:text-white text-gray-700 font-normal">Select Bank Account</span>
                        </div>
                        <FontAwesomeIcon icon={!isbankopen ? faAngleDown : faAngleUp} className="text-gray-500 text-lg" />
                      </div>
                      <div className="mb-20">
                       {
                        isbankopen && (
                            <>
                            {user.bankAccounts.map((i: any) => (
                            <div key={i.id} className="bg-gray-800 border-b rounded-md border-gray-700 p-3 flex gap-2 items-center justify-between cursor-pointer hover:bg-gray-700" onClick={() => setSelectedBankAccount(i)}>
                                 <div className="flex gap-1">
                                     <img src={i.bankImage} className="rounded-full h-6 w-6" />
                                      <span className="text-white font-normal">{i.bankName}</span>
                                      <span className="text-white font-normal">({i.accountHolderName})</span>
                                  </div>
                                   <div>
                                       {selectedbankaccount?.accountHolderName === i.accountHolderName && (
                                           <FontAwesomeIcon icon={faCheck} className="text-yellow-500" />
                                      )}
                                   </div>
                            </div>
                           ))}
                           <div className="bg-gray-800 dark:text-white text-gray-700 rounded-b-md p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-700" onClick={() => navigate('/bank-account')}>
                             <FontAwesomeIcon icon={faPlus} />
                             <span className="font-normal">Add Bank Account</span>
                         </div></> )
                         }
                       <div className="justify-center flex mt-10 items-center">
                           <input type="password" onChange={(e: any) => setUserPassword(e.target.value)}  placeholder="Enter Login Password" className={ "p-4 pl-8 rounded-md dark:bg-gray-800  bg-slate-200 font-serif outline-none dark:text-white text-gray-700 w-full"} />
                           <FontAwesomeIcon icon={faKey} className=" left-2 ml-10 absolute text-yellow-500" />
                           { error && <FontAwesomeIcon icon={error === "password valid" ? faCheck : faClose} className={error === "password valid" ? "absolute right-12 text-green-500" : "text-red-500 absolute right-12"}/> }
                           
                        </div>
                        <div className="flex justify-center mt-10">
                        <motion.button
                          onClick={handleSubmit}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md font-serif text-lg transition-colors duration-300 ease-in-out shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                         >
                           Withdraw {totalAmount === "0.00" ? "" : totalAmount}
                         </motion.button>
                        </div>
                    </div>
                    </div>
               </div>
                
               <div>
                  
               </div>
           </div>
        </>
    )
}