import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../utils/firebase";
import { motion } from "framer-motion";

export default function (){

    const [agentstatus, setlocalAgentStatus] = useState<any>(false);    

    useEffect(() => {
        const agentStatus = doc(db, 'settings', 'agentStatus');
          onSnapshot(agentStatus, (doc) => {
            const status = doc.data()?.status;
            setlocalAgentStatus(status);
          })
    },[]);

    const updateAgentStatus = async (newStatus: boolean) => {
        try {
          const agentStatusRef = doc(db, "settings", "agentStatus");
          await updateDoc(agentStatusRef, {
            status: newStatus,
          });
        } catch (error) {
          console.error("Error updating agent status: ", error);
        }
      };
      const toggleSwitch = () => {
        setlocalAgentStatus((p: any)=> {
            const status = !p;
            updateAgentStatus(status);
        });
      }
    return(
        <>
          <div className="h-screen flex items-center justify-center">
             <div 
               className="w-20 h-10 bg-gray-300 rounded-full p-1 cursor-pointer"
               onClick={toggleSwitch}
             >
               <motion.div
                 className={ agentstatus ? "w-8 h-8 bg-green-400 rounded-full shadow-md" : "w-8 h-8 bg-red-400 rounded-full shadow-md"}
                 layout
                 transition={{
                   type: "spring",
                   stiffness: 700,
                   damping: 30
                 }}
                 style={{
                   x: agentstatus ? 40 : 0
                 }}
               />
             </div>
             <span className="ml-3 text-lg font-medium">
               {agentstatus ? "Online" : "Offline"}
             </span>
          </div>
        </>
    )
}