import React, { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircle, faUserCircle, faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import { FaMinus } from "react-icons/fa";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import HomeIcon from '@mui/icons-material/Home';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import SendIcon from '@mui/icons-material/Send';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { format } from "date-fns";
import { AuthContext } from "../../context/AuthContext";
import { appName } from "../../utils/constants";
import PoweredBy from "../recharge/PoweredBy";
import { uploadToS3 } from "../../utils/uploadToS3";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import "./custom-scroll.css"
import LiveChatMenuBar from "./LiveChatMenuBar";
import ImagePreview from "./ImagePreview";
import ButtonLoader from "../bindbank/ButtonLoader";

interface Time {
  seconds: number;
  nanoseconds: number;
}

interface Message {
  id: string;
  role: string;
  message: string;
  playerId: string;
  seen: boolean;
  email: string;
  timeStamp: Time;
  imageUrl?: any;
}

export default function LiveChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ischattabopen, setChatTabOpen] = useState(false);
  const [usermessage, setUserMessage] = useState('');
  //@ts-ignore
  const { user } = useContext(AuthContext);
  const [isactivechat, setIsActiveChat] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [agentStatus, setAgentStatus] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef(null);
  const { scrollY } = useScroll({ container: chatContentRef });
  const logoY = useTransform(scrollY, [0, 50], [0, -70]); // Move to center (50vw - half of the image width)
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.7]);


  const handlFilesClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg") {
      setImage(file);
    } else {
      setError('only .png, .jpeg, .jpg files are allowed');
    }
  }

  const handleSubmit = async () => {
    if (!usermessage && !image) {
      return;
    }

    try {

      let imageUrl: any = '';
      setLoader(true);
      if (image) {
        imageUrl = await uploadToS3(image, 'live-chat');
      }
      const ref = doc(db, 'chats', `${user?.memberId}`);
      const messageId = `${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
      const messageData: any = {
        id: messageId,
        playerId: user?.memberId,
        message: usermessage,
        timeStamp: serverTimestamp(),
        role: 'user',
        seen: false,
        email: user?.email
      };

      if (imageUrl) {
        messageData.imageUrl = imageUrl;
      }
 
      await setDoc(doc(ref, 'messages', messageId), messageData);
      setImage(null);
      setUserMessage('');
      setLoader(false);
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    const fetch_messages = async () => {
      try {
        const chatRef = doc(db, 'chats', `${user?.memberId}`);
        const query1 = query(collection(chatRef, 'messages'), orderBy('timeStamp'));
        onSnapshot(query1, (snapshort) => {
          const fetchmessages = snapshort.docs.map((i) => ({
            id: i.id,
            ...i.data()
          }));
          setMessages(fetchmessages as Message[]);

          const agentStatus = doc(db, 'settings', 'agentStatus');
          onSnapshot(agentStatus, (doc) => {
            const status = doc.data()?.status;
            setAgentStatus(status);
          });
        });
      } catch (e) {
        console.log(e);
      }
    }

    fetch_messages();
  }, [user]);

  useEffect(() => {
    if (lastMessageRef.current) {
      //@ts-ignore
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const cal = (second: number, nanoSec: number) => {
    return second * 1000 + nanoSec / 1000;
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <>
      <LiveChatMenuBar isChatOpen={ischattabopen} setIsChatOpen={setIsChatOpen}/>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isExpanded ? '100vh' : '470px',
              width: isExpanded ? '100vw' : '360px',
            }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className={`fixed ${isExpanded ? 'inset-0' : 'right-2 bottom-24 sm:right-2 sm:bottom-2'} z-50 from-white via-yellow-50 to-yellow-200 bg-transparent bg-gradient-to-t rounded-2xl border-none outline-none overflow-hidden shadow-lg`}
          >
            {!ischattabopen ? (
              <>
                <div className="flex justify-between items-center p-4">
                  <FontAwesomeIcon
                    icon={isExpanded ? faCompress : faExpand}
                    className="text-2xl text-gray-700 hover:bg-white rounded-md p-1 cursor-pointer"
                    onClick={toggleExpand}
                  />
                  <FaMinus onClick={() => setIsChatOpen(false)} className="text-3xl text-gray-700 hover:bg-white rounded-md p-1 cursor-pointer" />
                </div>
                <div className={`h-[400px] flex flex-col`}>
                  <motion.div
                    className="flex p-4 mt-[-15px]"
                    style={{ y: logoY, scale: logoScale }}
                  >
                    <img
                      src="/assets/colorbet.png"
                      alt="live-chat-image"
                      width={56}
                      height={56}
                      className="cursor-pointer rounded-full"
                    />
                  </motion.div>
                    <div
                      ref={chatContentRef}
                      className="flex-grow overflow-y-auto px-6 custom-scrollbar" 
                      style={{ scrollBehavior: 'smooth' }}
                    >
                    <motion.div
                      className="flex flex-col gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <span className="text-4xl font-bold">Welcome to</span>
                      <span className="text-4xl font-bold">{appName} Club!</span>
                    </motion.div>
                    <motion.div
                      className="bg-gray-100 p-4 rounded-2xl mb-[3px] mt-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <div className="flex gap-2 mb-4">
                        <SupportAgentOutlinedIcon fontSize="large" className={agentStatus ? "text-green-500" : "text-red-500"} />
                        <span className="text-sm">
                          {agentStatus ? "Our agents are available to solve your problems" : "Our agents are not available right now, but you can still send messages..."}
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
                </div>
              </>
            ) : (
              <>
                <div className="bg-yellow-500 text-white p-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="text-[22px] mr-3 cursor-pointer"
                      onClick={() => setChatTabOpen(false)}
                    />
                    <div className="flex items-center">
                      <img src="/assets/colorbet.png" alt="company_image" className="h-10 w-10 rounded-full mr-3" />
                      <div className="flex flex-col">
                        <span className="font-medium">{appName}</span>
                        <div className="flex items-center text-sm">
                          <FontAwesomeIcon
                            icon={faCircle}
                            className={`${agentStatus ? "text-green-500" : "text-red-500"} text-[8px] mr-2`}
                          />
                          {agentStatus ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={isExpanded ? faCompress : faExpand}
                      className="text-2xl mr-3 cursor-pointer"
                      onClick={toggleExpand}
                    />
                    <FaMinus onClick={() => setIsChatOpen(false)} className="text-2xl cursor-pointer" />
                  </div>
                </div>
                <div className={`overflow-y-auto ${isExpanded ? 'h-[calc(100vh-120px)]' : 'h-[calc(100%-120px)]'} bg-gray-100`}>
                  {!isactivechat && (
                    <motion.div 
                      className="flex justify-center mt-10 mb-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-white w-full max-w-md rounded-2xl flex justify-start flex-col shadow-md mx-4">
                        <FontAwesomeIcon icon={faUserCircle} className="text-yellow-500 text-4xl mt-[-20px] relative" />
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
                            <button className="bg-yellow-500 p-3 text-white font-semibold rounded-md w-full flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors duration-300" onClick={() => {
                              setChatTabOpen(true);
                              setIsActiveChat(true);
                            }}>
                              Start chat now <SendOutlinedIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div className="m-4 mb-2" ref={chatContentRef}>
                    {isactivechat && (
                      <>
                        <div>
                          {messages?.map((i: Message) => (
                            <motion.div 
                              key={i.id} 
                              className={`flex ${i.role === "user" ? "justify-end" : "justify-start"} m-2`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className={`p-3 rounded-lg max-w-[70%] ${i.role === "user" ? "bg-yellow-100 text-black" : "bg-white text-black"}`}>
                                {i.imageUrl && (
                                  <div className="mb-2">
                                    <img 
                                      src={i.imageUrl} 
                                      alt="" 
                                      className="max-w-full h-auto rounded-md cursor-pointer" 
                                      onClick={() => setPreviewImage(i.imageUrl)}
                                    />
                                  </div>
                                )}
                                <p className="mb-1">{i.message}</p>
                                <div className="flex justify-end items-center text-xs text-gray-500">
                                  <span>{i.timeStamp && format(cal(i?.timeStamp?.seconds, i?.timeStamp?.nanoseconds), 'HH:mm')}</span>
                                  {i.role === "user" && (
                                    <span className="ml-1">
                                      {!i.seen ? <DoneIcon className="text-gray-500" fontSize="small" /> : <DoneAllIcon fontSize="small" className="text-blue-500" />}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}
                    <div ref={lastMessageRef}/>
                  </div>
                </div>
                <motion.div 
                  className={`${isExpanded ? 'fixed bottom-0 left-0 right-0' : 'absolute bottom-0 left-0 right-0'} bg-white p-2 shadow-md`}
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                {isactivechat &&  <div className="flex items-center" >
                  <div className="flex flex-col w-full">
                       <input
                         type="text" 
                         className="flex-grow bg-gray-100 rounded-full py-2 px-4 mr-2 focus:outline-none"
                         placeholder="Type a message"
                         value={usermessage}
                         onChange={(e) => setUserMessage(e.target.value)}
                       />
                       { error && <span className="text-red-500 text-xs ml-2">{error}</span> }
                       { image && <span className="text-xs ml-2">{image.name}</span> }
                    </div>
                    <label htmlFor="file-upload" className="cursor-pointer mr-2">
                      <AttachFileIcon className="text-gray-600" /> 
                    </label>
                    <input type="file" id="file-upload" onChange={handlFilesClick} className="hidden" />
                    <button 
                      className={`${usermessage.length === 0 ? "bg-gray-500 hover:bg-grau" : "bg-yellow-500 hover:bg-yellow-600 " } text-white rounded-full p-2 transition-colors duration-300`}
                      onClick={handleSubmit}
                      disabled={usermessage.length === 0 }
                    >
                      <ButtonLoader loader={loader} value={<SendIcon />} /> 
                    </button>
                  </div>}
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ImagePreview previewImage={previewImage} setPreviewImage={setPreviewImage} />
    </>
  );
}

