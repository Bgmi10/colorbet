import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import pokerBack from  "../../assets/poker_back.png";
import border from "./border.json";
import Lottie from 'react-lottie';

interface GameCardProps {
  frontImage: string;
  backImage: string;
  isWinner: boolean;
  isRevealed: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ frontImage, backImage, isRevealed, isWinner }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  useEffect(() => {
    setIsFlipped(isRevealed);
  }, [isRevealed]);

  const config = {
    animationData: border
  }

  return (
    <div className="relative h-72 perspective-1000 w-52">
    
      <AnimatePresence initial={false}>
        <motion.div
          key={isFlipped ? 'front' : 'back'}
          initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: isFlipped ? 0 : 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute w-52 rounded-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src={isFlipped ? frontImage : backImage || pokerBack}
            alt={isFlipped ? "Card Front" : "Card Back"}
            className="w-52 rounded-xl"
          />
        </motion.div>
      </AnimatePresence>

      
    </div>
  );
};
