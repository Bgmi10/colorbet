import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faPalette } from "@fortawesome/free-solid-svg-icons";

interface TopNavDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    onToggleTheme: () => void;
}

const TopNavDropdown: React.FC<TopNavDropdownProps> = ({ isOpen, onLogout, onToggleTheme }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 dark:bg-gray-800  bg-slate-100 rounded-md shadow-lg py-1 z-10"
                >
                    <button
                        onClick={onToggleTheme}
                        className="block px-4 py-2 text-sm hover:bg-slate-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700   dark:hover:text-white w-full text-left"
                    >
                        <FontAwesomeIcon icon={faPalette} className="mr-2" />
                        Toggle Theme
                    </button>
                    <button
                        onClick={onLogout}
                        className="block px-4 py-2 text-sm dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white w-full text-left"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                        Logout
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TopNavDropdown;

