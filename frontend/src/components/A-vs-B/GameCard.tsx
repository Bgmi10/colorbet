import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
//@ts-ignore
import pokerBack from  "../../../public/assets/poker_back.png";

interface GameCardProps {
  frontImage: string;
  backImage: string;
  isWinner: boolean;
  isRevealed: boolean;
  outlineShade: string
}

export const GameCard: React.FC<GameCardProps> = ({ frontImage, backImage, isRevealed, isWinner, outlineShade }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  useEffect(() => {
    setIsFlipped(isRevealed);
  }, [isRevealed]);

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
          <motion.img
            src={isFlipped ? frontImage : backImage || pokerBack}
            alt={isFlipped ? "Card Front" : "Card Back"}
            className="w-52 rounded-xl"
            style={{ zIndex: 10, filter: `drop-shadow(0 0 12px ${isWinner &&  isFlipped && outlineShade}` }}
          />
        </motion.div>
      </AnimatePresence>

      
    </div>
  );
};
