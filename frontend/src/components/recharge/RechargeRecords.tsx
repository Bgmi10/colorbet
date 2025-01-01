import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext";
import Header from "../Header";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export default function RechargeRecords() {

    interface Payment {
        id: string;
        upiRef: string;
        amount: number;
        createdAt: string;
        senderMobile: string;
        remarks: string;
        senderName: string;
        status: string;
    }
    //@ts-ignore
    const { user } = useContext(AuthContext);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="dark:bg-gray-900 min-h-screen">
            <Header title="Withdrawal Records" link="/profile"/>
            <div className="container mx-auto py-8 px-4 lg:px-0">
                {user?.payments.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center items-center gap-2 h-[calc(100vh-100px)]"
                    >
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-700 text-4xl" />
                        <span className="text-white font-serif text-xl">No Records Found</span>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-400 ">
                                <thead className="text-xs uppercase dark:bg-gray-700 bg-slate-200 dark:text-white rounded-md text-gray-700">
                                    <tr>
                                        <th scope="col" className="px-4 lg:px-6 py-3 sm:table-cell ">Upi Reference</th>
                                        <th scope="col" className="px-4 lg:px-6 py-3">Amount</th>
                                        <th scope="col" className="px-4 lg:px-6 py-3">Status</th>
                                        <th scope="col" className="px-4 lg:px-6 py-3">Date</th>
                                        <th scope="col" className="px-4 lg:px-6 py-3 lg:table-cell">Sender name</th>
                                        <th scope="col" className="px-4 lg:px-8 py-3 lg:table-cell">sender mobile</th>
                                        <th scope="col" className="px-4 lg:px-6 py-3 lg:table-cell">remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user?.payments.map((payment: Payment) => (
                                        <motion.tr 
                                            key={payment.id} 
                                            className="border-b dark:bg-gray-800 bg-slate-100 dark:border-gray-700 border-gray-300"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td className="px-4 lg:px-6 py-4 sm:table-cell whitespace-nowrap">{payment?.upiRef}</td>
                                            <td className="px-4 lg:px-6 py-4">₹{(payment?.amount / 100).toFixed(2)}</td>
                                            <td className="px-4 lg:px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    payment?.status !== "COMPLETED" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                                                }`}>
                                                    {payment?.status !== "COMPLETED" ? "Pending" : "Completed"}
                                                </span>
                                            </td>
                                            <td className="px-4 lg:px-6 py-4">{formatDate(payment.createdAt)}</td>
                                            <td className="px-4 lg:px-6 py-4 lg:table-cell">{payment?.senderName}</td>
                                            <td className="px-4 lg:px-12 py-4 lg:table-cell">{payment?.senderMobile}xxxx</td>
                                            <td className="px-4 lg:px-6 py-4 lg:table-cell">{payment?.remarks}</td>
                                            
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
