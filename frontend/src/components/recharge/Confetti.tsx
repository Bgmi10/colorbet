import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ConfettiPiece = ({ color }: { color: string }) => (
  <motion.div
    className={`absolute w-2 h-2 ${color}`}
    initial={{ 
      top: '50%', 
      left: '50%', 
      scale: 0,
      opacity: 1 
    }}
    animate={{ 
      top: ['50%', `${Math.random() * 100}%`],
      left: ['50%', `${Math.random() * 100}%`],
      scale: [0, 1],
      opacity: [1, 0]
    }}
    transition={{ 
      duration: 1.5, 
      ease: "easeOut" 
    }}
  />
);

export const Confetti = () => {
  const [pieces, setPieces] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const colors = ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-red-400', 'bg-purple-400'];
    const newPieces = Array.from({ length: 50 }).map((_, i) => (
      <ConfettiPiece key={i} color={colors[Math.floor(Math.random() * colors.length)]} />
    ));
    setPieces(newPieces);
  }, []);

  return <>{pieces}</>;
};
