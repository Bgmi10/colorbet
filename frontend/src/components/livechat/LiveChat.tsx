import { useState, useRef, useEffect, useContext } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
//@ts-ignore
import colobet from "../../../public/assets/colorbet.png";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { FaMinus } from "react-icons/fa";
import { appName } from "../../utils/constants";
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import HomeIcon from '@mui/icons-material/Home';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import PoweredBy from "../recharge/PoweredBy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircle, faSignOut, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import SendIcon from '@mui/icons-material/Send';
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { format } from "date-fns";
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Time {
  seconds: number;
  nanoseconds: number;
}
interface Message{
  id: string;
  role: string;
  message: string;
  playerId: string;
  seen: boolean;
  email: string;
  timeStamp: Time
}
export default function LiveChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: chatContentRef });
  const [ischattabopen, setChatTabOpen] = useState(false);
  const logoX = useTransform(scrollY, [0, 50], [0, 120]);
  const logoY = useTransform(scrollY, [0, 50], [0, -28]);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.8]);
  const [usermessage, setUserMessage] = useState('');
  //@ts-ignore
  const { user } = useContext(AuthContext);
  const [isactivechat, setIsActiveChat] = useState(false);
  const [messages, setMessages] = useState<null | Message>(null); 

  console.log(messages)

  const handleSubmit = async () => {
    try{
     setUserMessage('');
     const ref = doc(db, 'chats', `${user?.memberId}`);
     const messageId = `${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
     await setDoc(doc(ref, 'messages', messageId), {
       id: messageId,
       playerId: user?.memberId,
       message: usermessage,
       timeStamp: serverTimestamp(),
       role: 'user',
       seen: false,
       email: user?.email
     });
   
    }
    catch(e){
     console.log(e);
    }
  }

  useEffect(() => {

    if(!user)return;
      const fetch_messages = async () => {
          try{
            const chatRef = doc(db, 'chats', `${user?.memberId}`)
            const query1 = query(collection(chatRef, 'messages'), orderBy('timeStamp'));
             onSnapshot(query1, (snapshort) => {
              const fetchmessages = snapshort.docs.map((i) => ({
                id: i.id,
                ...i.data()
              }))
              setMessages(fetchmessages); 
            })
          }
          catch(e){
            console.log(e);
          }
      }

      fetch_messages();
  },[user])

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = 0;
    }
  }, [isChatOpen]);

  const cal = (second: number, nanoSec: number) => {
    return second * 1000 + nanoSec / 1000;
  }

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
        {isChatOpen &&  (
          <>
            {<motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100, rotateY: 90 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="border h-[470px] w-[360px] fixed right-6 bottom-24 z-50 from-white via-yellow-50 to-yellow-200 bg-transparent bg-gradient-to-t rounded-2xl border-none outline-none overflow-hidden shadow-lg"
          > 
            { !ischattabopen ?  <>
            <div>
              <FaMinus onClick={() => setIsChatOpen(false)} className="text-3xl text-gray-700 hover:bg-white rounded-md p-1 cursor-pointer absolute right-4 top-4" />
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
                  <button className="bg-yellow-500 p-3 text-white font-semibold rounded-md w-full flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors duration-300" onClick={() => setChatTabOpen(true)}>
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
            </div> </> : 
            <>
              <div className="bg-white shadow-md p-1">
                <div className="flex justify-between m-2 items-center">
                    <div>
                    <FontAwesomeIcon icon={faArrowLeft} className="text-[22px] mt-1 text-gray-700 hover:bg-white rounded-md p-1 cursor-pointer" onClick={() => setChatTabOpen(false)}/> 
                    </div>
                    <div className="flex flex-col items-center">
                       <img src={colobet} alt="company_image" className="h-10 w-10 rounded-full" />
                       <FontAwesomeIcon icon={faCircle} className="text-green-500 text-[10px] absolute ml-7 border-4 rounded-full border-white mt-6" />
                       <span className="text-xl font-medium">{appName}</span>
                    </div>
                   <div>
                      <FaMinus onClick={() => setIsChatOpen(false)} className="text-3xl text-gray-700 hover:bg-white rounded-md p-1 cursor-pointer" />
                    </div>
                </div>
              </div>
              <div className="overflow-y-auto h-96"> 
             {!isactivechat && <div className="flex justify-center mt-10 mb-5"> 
                <div className="bg-white w-72 rounded-2xl flex justify-start flex-col shadow-md">
                  <FontAwesomeIcon icon={faUserCircle} className="text-yellow-500 text-4xl mt-[-20px] relative"/>
                  <div className="m-4 text-sm flex flex-col mt-5">
                    <span className="font-semibold text-red-600">
                      *New members can get 50% of their first deposit.
                    </span>
                    <span className="font-semibold text-red-600">
                      *Please do not repeat your question to avoid covering up your previous one. Wait for the answer before asking again.
                    </span>
                    <span className="font-semibold text-red-600">
                      *There may be a delay from the payment provider in processing the transfer. We will need some time to verify it.
                    </span>
                    <span className="font-semibold text-red-600">
                      *Rest assured, we will credit the funds to your game account as soon as they are received.
                    </span>
                  </div>
                  <div className="m-4 flex-col flex gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 after:content-['*'] after:text-red-600 after:ml-0.5">
                      Player Id:
                    </label>
                    <input
                      type="text"
                      required
                      aria-required="true"
                      value={user?.memberId}
                      className="border border-gray-300 rounded-md p-2 outline-none"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-400 after:content-['*'] after:text-red-600 after:ml-0.5">
                      Email:
                    </label>
                    <input
                      type="text"
                      required
                      aria-required="true"
                      value={user?.email}
                      className="border border-gray-300 rounded-md p-2 outline-none"
                      disabled
                    />
                  </div>
                    <div className="flex justify-center mt-2">
                    <button className="bg-yellow-500 p-3 text-white font-semibold rounded-md w-full flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors duration-300" onClick={() => {setChatTabOpen(true)
                      setIsActiveChat(true)
                    }} >
                    Start chat now <SendOutlinedIcon />
                  </button>
                    </div>
                  </div>
                </div>
                
               </div>}
               <div className="m-4 overflow-y-auto mb-20">
                    {isactivechat && 
                     <> <div>
                      {
                        messages?.map((i : Message) => (
                          <div key={i.id} className={`flex ${i.role === "user" ? "justify-end" : "justify-start"} m-2`}>
                          <div className={`p-[5px] rounded-md flex gap-1 w-fit ${i.role === "user" ? "bg-yellow-400 text-white font-normal" : "bg-white shadow-sm text-black font-normal"}`}>
                            <span>{i.message}</span> 
                            <span className="text-[10px]">{ i.timeStamp && format(cal(i?.timeStamp?.seconds, i?.timeStamp?.nanoseconds), 'HH:mm a')}</span>
                          </div>
                        </div>
                        
                        ))
                      }
                      </div>  
                      <div className="flex gap-2 items-center fixed bottom-[100px] w-80">
                        <input type="text" className="border p-3 rounded-md outline-none w-full overflow-y-auto border-gray-300" placeholder="write a message" value={usermessage} onChange={(e) => setUserMessage(e.target.value)} />
                        <div className="flex gap-1 absolute text-end right-0 m-2 bg-white">
                          <AttachFileIcon className="cursor-pointer  text-gray-600"/> 
                          <button disabled={usermessage.length === 0}><SendIcon className="cursor-pointer text-gray-400" onClick={handleSubmit}  /></button>
                        </div>
                      </div>
                      </>
                     }
               </div>
              </div>             
            </>}
            </motion.div>}
          </>
        )}
      </AnimatePresence>
    </>
  );
}