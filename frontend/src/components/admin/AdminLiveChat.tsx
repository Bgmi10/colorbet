import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { format } from "date-fns";
import { collectionGroup, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { cal } from "../../utils/constants";
import { uploadToS3 } from "../../utils/uploadToS3";
import ButtonLoader from "../bindbank/ButtonLoader";

const ImagePreview = ({ previewImage, setPreviewImage }: { previewImage: any, setPreviewImage: any }) => {
  if (!previewImage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
      <div className="max-w-3xl max-h-[90vh]">
        <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain" />
      </div>
    </div>
  );
};

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

export default function AdminLiveChat({ setIsOpen }: { setIsOpen: any }) {
  const [chats, setChats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [usermessage, setUserMessage] = useState('');
  const [image, setImage] = useState<any | null>(null);
  const [loader, setLoader] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const chatContentRef = useRef(null);
  const lastMessageRef = useRef(null);

  const fetchAllUsersWithChats = () => {
    try {
      const messagesQuery = query(collectionGroup(db, "messages"));
  
      onSnapshot(messagesQuery, (querySnapshot) => {
        const groupedChats: any = {};
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const { email, message, imageUrl, seen, role, timeStamp, playerId } = data;
          
          if (groupedChats[email]) {
            groupedChats[email].push({ id: doc.id, message, imageUrl, seen, role, timeStamp, email, playerId });
          } else {
            groupedChats[email] = [{ id: doc.id, message, imageUrl, seen, role, timeStamp, email, playerId }];
          }
        });
  
        setChats(groupedChats); 
      });
    } catch (error) {
      console.error("Error fetching chats: ", error);
    }
  };

  useEffect(() => {
    fetchAllUsersWithChats();
  }, []);
  
  useEffect(() => {
    if (selectedUser && chats[selectedUser]) {
      const sortedMessages = [...chats[selectedUser]].sort((a: Message, b: Message) => 
        (a.timeStamp?.seconds || 0) - (b.timeStamp?.seconds || 0)
      );
      setMessages(sortedMessages);

      sortedMessages.forEach(async (message: Message) => {
        if (message.role === 'user' && !message.seen) {
          const userRef = doc(db, 'chats', message.playerId, 'messages', message.id);
          await updateDoc(userRef, { seen: true });
        }
      });
    } 
  }, [selectedUser, chats]);

  useEffect(() => {
    if (lastMessageRef.current) {
      //@ts-ignore
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

const handleSubmit = async () => {
  if (!usermessage && !image) return;

  setLoader(true);
  try {
    let imageUrl: any = '';
    if (image) {
      imageUrl = await uploadToS3(image, 'live-chat');
    }

    const playerId = messages?.[0]?.playerId;

    if (!playerId) {
      console.log('error while add chat: no playerId found');
      return;
    }

    const newMessageId = generateMessageId();
    const chatRef = doc(db, 'chats', playerId);
    const messageRef = doc(chatRef, 'messages', newMessageId);
    const data: any = {
      id: newMessageId,
      playerId: playerId,
      message: usermessage,
      role: "admin",
      seen: false,
      timeStamp: serverTimestamp(),
      email: messages?.[0]?.email 
    };

    if (imageUrl) {
      data.imageUrl = imageUrl;
    }

    await setDoc(messageRef, data);
    
    setUserMessage('');
    setImage(null);
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    setLoader(false);
  }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setImage(file);
    }
  };

  return (
    <div className="flex  w-full">
      <div className=" bg-white border-r border-gray-200 overflow-y-auto w-full">
        <div className="border-b border-gray-200 p-4 flex items-center gap-3">
          <FontAwesomeIcon icon={faArrowLeft} className="text-gray-500" onClick={() => setIsOpen()}/>
          <h1 className="text-xl font-bold text-gray-800">Active Chats</h1>
        </div>
        <div className="divide-y divide-gray-200">
          {Object.entries(chats).map(([email, messages]: [any, any]) => {
            const unreadCount = messages.filter((m: any) => m.role === 'user' && !m.seen).length;
            const lastMessage = messages[messages.length - 1];
            
            return (
              <motion.div
                key={email}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedUser === email ? "bg-yellow-100" : ""
                }`}
                onClick={() => setSelectedUser(email)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{email}</span>
                  {unreadCount > 0 && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {lastMessage && (
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {lastMessage.message || (lastMessage.imageUrl ? "📎 Image" : "")}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:w-full sm: w-auto">
        {selectedUser &&(
          <>
            <div className="bg-white border-b border-gray-200 p-4 flex items-center">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-gray-600 cursor-pointer mr-4"
                onClick={() => setSelectedUser(null)}
              />
              <div className="flex items-center">
                <SentimentSatisfiedAltIcon className="text-yellow-500 mr-2" />
                <span className="font-medium text-gray-900">{selectedUser}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 mb-32 bg-gray-50" ref={chatContentRef}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.role === "admin" ? "justify-end" : "justify-start"} mb-4`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`max-w-[70%] ${
                    message.role === "admin" ? "bg-yellow-200 text-black" : "bg-white"
                  } rounded-lg p-3 shadow`}>
                    {message.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={message.imageUrl}
                          alt=""
                          className="max-w-full rounded-md cursor-pointer"
                          onClick={() => setPreviewImage(message.imageUrl)}
                        />
                      </div>
                    )}
                    <p className="mb-1">{message.message}</p>
                    <div className="flex items-center justify-end text-xs">
                      <span className={message.role === "admin" ? "text-black" : "text-gray-500"}>
                        {message.timeStamp && format(cal(message.timeStamp.seconds, message.timeStamp.nanoseconds), 'HH:mm')}
                      </span>
                      {message.role === "admin" && (
                        <span className="ml-1">
                          {message.seen ? <DoneAllIcon style={{ fontSize: 12 }} className="text-blue-500" /> : <DoneIcon style={{ fontSize: 12 }} className="text-gray-500"/>}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={lastMessageRef} />
            </div>

            <div className="bg-white border-t border-gray-200 p-[14px] z-50 fixed bottom-[70px] lg:w-[650px]">
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
                  placeholder="Type your message..."
                  value={usermessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                />
                <label htmlFor="file-upload" className="px-4 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200">
                  <AttachFileIcon className="text-gray-600" />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <button
                  className="px-6 py-2 bg-yellow-500 text-white rounded-r-lg hover:bg-yellow-600 disabled:bg-gray-300"
                  onClick={handleSubmit}
                  disabled={!usermessage && !image || loader}
                >
                  <ButtonLoader loader={loader} value="Send" />
                </button>
              </div>
              {image && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected image: {image.name}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <ImagePreview previewImage={previewImage} setPreviewImage={setPreviewImage} />
    </div>
  );
}