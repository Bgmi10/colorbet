import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import colobet from "../../../public/assets/colorbet.png";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { FaMinus } from "react-icons/fa";
import { appName } from "../../utils/constants";
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import HomeIcon from '@mui/icons-material/Home';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import PoweredBy from "../recharge/PoweredBy";

export default function LiveChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: chatContentRef });
  
  const logoX = useTransform(scrollY, [0, 50], [0, 120]);
  const logoY = useTransform(scrollY, [0, 50], [0, -28]);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.8]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = 0;
    }
  }, [isChatOpen]);

  return (
    <>
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-20 right-2 z-50"
          >
            <img
              src={colobet}
              alt="live-chat-image"
              width={64}
              height={64}
              className="cursor-pointer rounded-full"
              onClick={() => setIsChatOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100, rotateY: 90 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="border h-[470px] w-[360px] fixed right-6 bottom-24 z-50 from-white via-yellow-50 to-yellow-200 bg-transparent bg-gradient-to-t rounded-2xl border-none outline-none overflow-hidden shadow-lg"
          >
            <div>
              <FaMinus onClick={() => setIsChatOpen(false)} className="text-3xl text-gray-700 hover:bg-white rounded-md p-1 cursor-pointer absolute right-4 top-4 z-10" />
            </div>
            <div className="h-full flex flex-col">
              <motion.div 
                className="flex justify-between items-center p-4 relative mt-5"
              >
                <motion.div 
                  style={{ x: logoX, y: logoY, scale: logoScale }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <img
                    src={colobet}
                    alt="live-chat-image"
                    width={56}
                    height={56}
                    className="cursor-pointer rounded-full z-50"
                  />
                </motion.div>
               
              </motion.div>
              <div
                ref={chatContentRef}
                className="flex-grow overflow-y-auto px-6 py-4"
                style={{ scrollBehavior: 'smooth' }}
              >
                <motion.div 
                  className="flex flex-col gap-2 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span className="text-4xl font-bold">Welcome to</span>
                  <span className="text-4xl font-bold">{appName} Club!</span>
                </motion.div>
                <motion.div 
                  className="bg-gray-100 p-4 rounded-2xl mb-[-6px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="flex gap-2 mb-4">
                    <SupportAgentOutlinedIcon fontSize="large" />
                    <span className="text-sm">
                      Our agents are not available right now, but you can still send messages...
                    </span>
                  </div>
                  <button className="bg-yellow-500 p-3 text-white font-semibold rounded-md w-full flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors duration-300">
                    Chat now <SendOutlinedIcon />
                  </button>
                </motion.div>
              </div>
              <motion.div 
                className="mt-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white shadow-lg flex justify-between gap-3 px-16 py-4 w-[330px] rounded-full">
                    <div className="flex flex-col items-center cursor-pointer hover:text-blue-500 transition-colors duration-300">
                      <HomeIcon fontSize="medium" />
                      <span>Home</span>
                    </div>
                    <div className="text-gray-500 flex flex-col items-center cursor-pointer hover:text-blue-500 transition-colors duration-300">
                      <ForumOutlinedIcon fontSize="medium" />
                      Chat
                    </div>
                  </div>
                </div>
                <PoweredBy />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

