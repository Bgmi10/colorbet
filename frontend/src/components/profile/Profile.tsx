import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCoins, faCreditCard, faEdit, faEllipsisV, faUser, faIdCard, faTrophy, faClose, faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import vip1Frame from "../../assets/headFrame/vip1.png";
import { baseurl, profileAvatar } from "../../utils/constants";
import AvatarSelector from './AvatarSelector';
import { ProfileSetttingsData } from "../../utils/constants"
import TopNavDropdown from './TopNavDropdown';
import axios from 'axios';

export default function Profile() {
    const { user, Logout, setUser } = useContext(AuthContext);
    const [isShowAvatar, setIsShowAvatar] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(profileAvatar[0]);
    const [openMenus, setOpenMenus] = useState<number[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditUserName, setIsEditName] = useState(false);
    const [userName, setUserName] = useState("");
    const [isLoad, setIsLoad] = useState(false);

    const handleToggleTheme = () => {
        console.log("Toggle theme clicked");
        // Implement theme toggle functionality here
    };

    
    const handleEditName = async () => {
        
        try{
            setIsLoad(true);
           const res = await axios.put(`${baseurl}/api/auth/userprofile`,{
                userName: userName
            }, { withCredentials: true });
            setUser((p: any) => ({...p, userName: res?.userName}));
            setIsEditName(false);
            setIsLoad(false);
        }
        catch(e){
            console.log(e);
            setIsLoad(false);
        }
    }
   
    const handleShowAvatar = () => {
        setIsShowAvatar(true);
    }

    const handleAvatarSelect = (avatar: string) => {
        setSelectedAvatar(avatar);
        setIsShowAvatar(false);
    }

    const toggleMenu = (id: number) => {
        setOpenMenus(prev => 
            prev.includes(id) ? prev.filter(menuId => menuId !== id) : [...prev, id]
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between bg-gray-800 p-4 shadow-md relative"
            >
                <span className="text-yellow-500 text-2xl font-bold ">Profile</span>
                <div className="flex items-center space-x-4">
                    <Link to="/recharge-chip">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md font-serif"
                        >
                            <FontAwesomeIcon icon={faCreditCard} className="mr-2"/>
                            Recharge
                        </motion.button>
                    </Link>
                    <div className="relative">
                        <FontAwesomeIcon 
                            icon={faEllipsisV} 
                            className="text-yellow-500 cursor-pointer text-xl"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        />
                        <TopNavDropdown 
                            isOpen={isDropdownOpen}
                            onClose={() => setIsDropdownOpen(false)}
                            onLogout={Logout}
                            onToggleTheme={handleToggleTheme}
                        />
                    </div>
                </div>
            </motion.div>
            <div className="flex flex-col items-center mt-8 relative">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                    <img src={selectedAvatar} alt="avatar" className="rounded-full border-4 border-yellow-500"/>
                    <img src={vip1Frame} alt="frame" className="absolute mt-[-150px] ml-[-10px]"/>
                </motion.div>
                <motion.button
                    onClick={handleShowAvatar}
                    className="mt-4 bg-yellow-500 font-serif hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FontAwesomeIcon icon={faEdit} className="mr-2 "/>
                    Edit Avatar
                </motion.button>
            </div>
            <motion.div 
                className="mt-8 px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div className="bg-gray-800 rounded-md p-6 shadow-lg">
                 <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                            className="bg-gray-700 p-4 rounded-md"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <FontAwesomeIcon icon={faIdCard} className="text-yellow-500 text-2xl mb-2" />
                            <p className="text-gray-400 text-sm">Player ID</p>
                            <p className="text-white font-bold text-lg">{user?.memberId}</p>
                        </motion.div>
                        <motion.div 
                            className="bg-gray-700 p-4 rounded-md flex justify-between"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        > 
                             <div> 
                                  <FontAwesomeIcon icon={faUser} className="text-yellow-500 text-2xl mb-2" />
                                 
                                  <p className="text-gray-400 text-sm">Username</p>
                                  <div className='flex gap-3 items-center'>
                                  <input className={`placeholder:text-white font-bold outline-none border-none text-lg ${ !isEditUserName ? "bg-gray-700" : "bg-gray-200 p-1 rounded-md text-gray-400 font-serif placeholder:text-gray-400"} `} value={userName} disabled={!isEditUserName} onChange={(e) => setUserName(e.target.value)} placeholder={!isEditUserName ?  user?.userName : "enter a name"}/>
                                  {
                                    isEditUserName &&
                                     <div className='flex gap-4'>
                                        <FontAwesomeIcon icon={faClose} className='text-red-500 cursor-pointer' onClick={() => setIsEditName(false)}/>
                                         <FontAwesomeIcon icon={isLoad ? faSpinner : faCheck}className={`text-yellow-500 cursor-pointer ${isLoad ? 'animate-spin' : ''}`}  onClick={handleEditName} />
                                     </div>
                                  }
                                  </div>
                             </div>
                             <div><FontAwesomeIcon icon={faEdit}  onClick={()=> setIsEditName(p => !p)} className='cursor-pointer hover:text-gray-500 text-gray-400'/></div>
                        </motion.div>
                        <motion.div 
                            className="bg-gray-700 p-4 rounded-md"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <FontAwesomeIcon icon={faCoins} className="text-yellow-500 text-2xl mb-2" />
                            <p className="text-gray-400 text-sm">Balance</p>
                            <p className="text-white font-bold text-lg">₹ {(user?.balance / 100).toFixed(2)}</p>
                        </motion.div>
                        <motion.div 
                            className="bg-gray-700 p-4 rounded-md"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-2xl mb-2" />
                            <p className="text-gray-400 text-sm">Vip-1</p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            <motion.div 
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {ProfileSetttingsData.map((item) => (
                    <motion.div 
                        key={item.id} 
                        className="px-6 py-4 hover:bg-gray-800 transition-colors duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: item.id * 0.1 }}
                    >
                        <div 
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => item.options && toggleMenu(item.id)}
                        >
                            <div className="flex items-center space-x-4 text-yellow-500">
                                {item.icon}
                                <span className="font-bold">{item.title}</span>
                            </div>
                            {item.options && (
                                <motion.div
                                    animate={{ rotate: openMenus.includes(item.id) ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FontAwesomeIcon icon={faAngleDown} className="text-yellow-500 text-xl"/>
                                </motion.div>
                            )}
                        </div>
                        <AnimatePresence>
                            {item.options && openMenus.includes(item.id) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-2 ml-8 space-y-2"
                                >
                                    {item.options.map((option) => (
                                        <Link key={option.id} to={option.link} className="flex items-center space-x-2 text-gray-300 hover:text-yellow-500">
                                            {option.icon}
                                            <span className="font-bold">{option.title}</span>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </motion.div>
            {isShowAvatar && (
                <AvatarSelector 
                    avatars={profileAvatar} 
                    onSelect={handleAvatarSelect} 
                    onClose={() => setIsShowAvatar(false)}
                />
            )}
        </div>
    );
}

