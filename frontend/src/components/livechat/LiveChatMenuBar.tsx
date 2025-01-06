import { motion, AnimatePresence } from "framer-motion";

export default function LiveChatMenuBar ({ isChatOpen, setIsChatOpen }: { isChatOpen: boolean, setIsChatOpen: any }){
    return(
        <>
           <AnimatePresence>
              {!isChatOpen && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                className="fixed bottom-20 right-2 z-50 sm:bottom-20 sm:right-2"
              >
                <img
                  src="/assets/colorbet.png"
                  alt="live-chat-image"
                  width={64}
                  height={64}
                  className="cursor-pointer rounded-full"
                  onClick={() => setIsChatOpen(true)}
                />
              </motion.div>
              )}
           </AnimatePresence>
        </>
    )
}