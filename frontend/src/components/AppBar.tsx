import { FaUser, FaGamepad, FaPlaceOfWorship } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import { GiWineGlass } from "react-icons/gi";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { useState } from 'react';

export default function AppBar() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const iconClass = "text-3xl transition-all duration-300";

  const data = [
    {
      id: "1",
      icon: <FaUser className={iconClass} />,
      link: "/profile",
      label: "Profile"
    },
    {
      id: "2",
      icon: <FaStarHalfStroke className={iconClass} />,
      link: "/A-vs-B",
      label: "AvsB"
    },
    {
      id: "3",
      icon:  <GiWineGlass className={iconClass} />,
      link: "/color",
      label: "Color"
    },
    {
      id: "4",
      icon: <FaGamepad className={iconClass} />,
      link: "/blog",
      label: "Blog"
    },
    {
      id: "5",
      icon: <FaPlaceOfWorship className={iconClass} />,
      link: "/avaitor",
      label: "Aviator"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 p-2 shadow-lg border-t-2 border-yellow-500"
    >
      <div className="sm:mx-10 flex justify-between">
        {data.map((item) => (
          <Link 
            to={item.link} 
            key={item.id}
            className="group relative"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <motion.button
              className="focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full p-3 bg-gray-800 relative z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  color: hoveredId === item.id ? "#FCD34D" : "#9CA3AF"
                }}
              >
                {item.icon}
              </motion.div>
            </motion.button>
            <motion.div
              className="absolute -top-8 flex left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-bold opacity-0 transition-opacity duration-200"
              animate={{
                opacity: hoveredId === item.id ? 1 : 0
              }}
            >
              {item.label}
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

