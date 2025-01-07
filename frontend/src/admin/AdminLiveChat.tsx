import { collectionGroup, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { motion } from "framer-motion";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function AdminLiveChat() {
  const [chats, setChats] = useState<any>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  // Fetch all users with their messages
  const fetchAllUsersWithChats = async () => {
    try {
      const messagesQuery = query(collectionGroup(db, "messages"));
      const querySnapshot = await getDocs(messagesQuery);
      
      const groupedChats: any = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { email, message } = data;

        if (groupedChats[email]) {
          groupedChats[email].push({ id: doc.id, message });
        } else {
          groupedChats[email] = [{ id: doc.id, message }];
        }
      });

      setChats(groupedChats); // Grouped by user (email)
    } catch (error) {
      console.error("Error fetching chats: ", error);
    }
  };

  useEffect(() => {
    fetchAllUsersWithChats();
  }, [messages]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser && chats[selectedUser]) {
      setMessages(chats[selectedUser]);
    }
  }, [selectedUser, chats]);

  return (
    <div className="flex h-screen bg-gray-800 border-l border-gray-700 w-full">
      <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
        <div className="border-b border-gray-700">
          <h1 className="m-4 text-2xl font-bold text-yellow-500 text-center">Users</h1>
        </div>
        {Object.keys(chats).length > 0 ? (
          Object.keys(chats).map((email) => (
            <motion.div
              key={email}
              className={`p-4 cursor-pointer transition-colors duration-200 ${
                selectedUser === email ? "bg-gray-700 text-white" : "text-white hover:bg-gray-700"
              }`}
              onClick={() => setSelectedUser(email)}
            >
              {email}
            </motion.div>
          ))
        ) : (
          <p className="m-4 text-gray-500">No users with messages found.</p>
        )}
      </div>

      {/* Chat Window */}
      <div className=" p-6 flex flex-col justify-between w-full">
        {selectedUser ? (
          <>
          <div className="border-b border-gray-700">
            <h3 className="text-xl font-bold  text-center text-white"><SentimentSatisfiedAltIcon className="text-yellow-500"/> <span className="text-white">{selectedUser}</span></h3>
          </div>
            <div className="flex flex-col space-y-3 overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((chat) => (
                  <motion.div
                    key={chat.id}
                    className={`p-4 rounded-md shadow-md ${
                      selectedUser === chat.email ? "self-start bg-blue-100" : "self-end bg-green-100"
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {chat.message}
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">No messages for this user.</p>
              )}
            </div>
              
            <div className="flex items-center border-t border-gray-200 p-4">
              <input
                type="text"
                className="w-full bg-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
              />
              <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a user to view messages.</p>
        )}
      </div>
    </div>
  );
}
 