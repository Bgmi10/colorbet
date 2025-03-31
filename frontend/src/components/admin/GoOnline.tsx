import { doc, onSnapshot, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { motion } from "framer-motion";

export default function AgentStatusToggle() {
    const [agentStatus, setAgentStatus] = useState<boolean | null>(null);    

    useEffect(() => {
        const agentStatusRef = doc(db, "settings", "agentStatus");

        const unsubscribe = onSnapshot(agentStatusRef, (doc) => {
            if (doc.exists()) {
                setAgentStatus(doc.data()?.status);
            } else {
                console.warn("agentStatus document does not exist.");
                setAgentStatus(false); // Default to offline
            }
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const updateAgentStatus = async (newStatus: boolean) => {
        const agentStatusRef = doc(db, "settings", "agentStatus");

        try {
            const docSnap = await getDoc(agentStatusRef);

            if (!docSnap.exists()) {
                console.log("Document does not exist, creating...");
                await setDoc(agentStatusRef, { status: newStatus });
            } else {
                await updateDoc(agentStatusRef, { status: newStatus });
            }
        } catch (error) {
            console.error("Error updating agent status: ", error);
        }
    };

    const toggleSwitch = () => {
        if (agentStatus === null) return; // Prevent toggling if status is not loaded
        const newStatus = !agentStatus;
        setAgentStatus(newStatus);
        updateAgentStatus(newStatus);
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div
                className="w-20 h-10 bg-gray-300 rounded-full p-1 cursor-pointer"
                onClick={toggleSwitch}
            >
                <motion.div
                    className={`w-8 h-8 rounded-full shadow-md ${agentStatus ? "bg-green-400" : "bg-red-400"}`}
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 700,
                        damping: 30
                    }}
                    style={{ x: agentStatus ? 40 : 0 }}
                />
            </div>
            <span className="ml-3 text-lg font-medium">
                {agentStatus === null ? "Loading..." : agentStatus ? "Online" : "Offline"}
            </span>
        </div>
    );
}
