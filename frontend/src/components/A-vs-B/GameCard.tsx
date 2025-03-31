import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface GameCardProps {
  frontImage: string;
  backImage: string;
  isWinner: boolean;
  isRevealed: boolean;
  outlineShade: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  frontImage,
  backImage,
  isRevealed,
  isWinner,
  outlineShade
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  useEffect(() => {
    setIsFlipped(isRevealed);
  }, [isRevealed]);
  
  return (
    <div className="relative perspective-1000 w-32 sm:w-40 md:w-48 lg:w-52 h-44 sm:h-56 md:h-64 lg:h-72">
      <AnimatePresence initial={false}>
        <motion.div
          key={isFlipped ? 'front' : 'back'}
          initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: isFlipped ? 0 : 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute w-full h-full rounded-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <motion.img
            src={isFlipped ? frontImage : backImage || "/assets/poker_back.png"}
            alt={isFlipped ? "Card Front" : "Card Back"}
            className="w-full h-full rounded-xl object-cover"
            style={{ 
              zIndex: 10, 
              filter: `drop-shadow(0 0 12px ${isWinner && isFlipped ? outlineShade : 'transparent'})`
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};