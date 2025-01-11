import { useContext } from "react";
import Header from "../Header";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
interface LoginActivity{
    id: string;
    os: string;
    loginTime: string;
    logoutTime: string;
    authMethod: string;
    isp: string;
    connectionType: string;
    location: string;
    deviceType: string;
    deviceModel: string;
}

export default function LoginActivity (){
    //@ts-ignore
    const { user } = useContext(AuthContext);
    return(
        <>
          <div className="dark:bg-gray-900 min-h-screen mb-16">
            <Header title="Login Activity" link="/profile"/>
            <div className="container mx-auto py-8 px-4 lg:px-0">
                {user?.loginActivities.length === 0 ? (
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
                                        <th scope="col" className="px-4 lg:px-6 py-3 sm:table-cell ">Os</th>
                                        <th scope="col" className="px-4 lg:px-6 py-3">Device Model</th>
                                        <th scope="col" className="px-4 lg:px-6 py-3">Device Type</th>
                                        <th scope="col" className="px-4 lg:px-6 py-3">Login Time</th>
                                        <th scope="col" className="px-4 lg:px-6 py-3 lg:table-cell">Logout time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user?.loginActivities.map((i: LoginActivity) => (
                                        <motion.tr 
                                            key={i.id} 
                                            className="border-b dark:bg-gray-800 bg-slate-100 dark:border-gray-700 border-gray-300"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td className="px-4 lg:px-6 py-4 sm:table-cell whitespace-nowrap">{i?.os}</td>
                                            <td className="px-4 lg:px-6 py-4">{i?.deviceModel === null ? "Unknown" : i.deviceModel}</td>
                                            <td className="px-4 lg:px-6 py-4">
                                                {i?.deviceType}
                                            </td>
                                            <td className="px-4 lg:px-6 py-4 lg:table-cell">{i?.loginTime}</td>
                                            <td className="px-4 lg:px-6 py-4 lg:table-cell">{i?.logoutTime === null ? <><FontAwesomeIcon icon={faCircle} className="text-green-500 text-xs"/> Active Session</> : i?.logoutTime}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
        </>
    )
}