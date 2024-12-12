import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Lottie from 'react-lottie'; 
import fireAnimation from './Animation.json'; 

interface GameCardProps {
  frontImage: string;
  backImage: string;
  isWinner: boolean;
  isRevealed: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ frontImage, backImage, isWinner, isRevealed }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(isRevealed);
  }, [isRevealed]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: fireAnimation,
  };

  return (
    <div className="relative w-64 h-96 perspective-1000">
      <AnimatePresence initial={false}>
        <motion.div
          key={isFlipped ? 'front' : 'back'}
          initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: isFlipped ? 0 : 180, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute w-full h-full rounded-xl shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src={isFlipped ? frontImage : backImage || 'https://colorwiz.cyou/images/poker/poker_back.png'}
            alt={isFlipped ? "Card Front" : "Card Back"}
            className="w-full h-full object-cover rounded-xl"
          />
        </motion.div>
      </AnimatePresence>

      {!isWinner && !isFlipped && (
        <motion.div
          className="absolute inset-0 ml-[-70px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Lottie
            options={defaultOptions}
            height={400}
            width={400}
          />
        </motion.div>
      )}
    </div>
  );
};
