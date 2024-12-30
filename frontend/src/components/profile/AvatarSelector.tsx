import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface AvatarSelectorProps {
    avatars: string[];
    onSelect: (avatar: string) => void;
    onClose: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ avatars, onSelect, onClose }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="dark:bg-gray-900 bg-white p-6 rounded-md max-w-md w-full shadow-lg"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-yellow-500 text-2xl font-serif">Select Your Avatar</h2>
                        <button onClick={onClose} className="text-yellow-500 hover:text-yellow-600">
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {avatars.map((avatar, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect(avatar)}
                                className="focus:outline-none"
                            >
                                <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-auto rounded-full border-2 border-yellow-500 hover:border-yellow-600 transition-colors duration-200" />
                            </motion.button>
                        ))}
                    </div>
                    <motion.button
                        onClick={onClose}
                        className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-serif py-2 px-4 rounded-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Cancel
                    </motion.button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AvatarSelector;

