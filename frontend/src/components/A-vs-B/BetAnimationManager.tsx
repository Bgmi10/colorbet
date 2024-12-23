import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import chip10 from "../../assets/chips/10_0.png";
import chip20 from "../../assets/chips/20_0.png";
import chip50 from "../../assets/chips/50_0.png";
import chip100 from "../../assets/chips/100_0.png";
import chip200 from "../../assets/chips/200_0.png";
import chip500 from "../../assets/chips/500_0.png";
import chip1k from "../../assets/chips/1000_0.png";
import chip5k from "../../assets/chips/5000_0.png";
import chip10k from "../../assets/chips/10000_0.png";
import chip20k from "../../assets/chips/20000_0.png";
import chip50k from "../../assets/chips/50000_0.png";
import chip100k from "../../assets/chips/100000_0.png";
import chaalSound from "../../assets/chaal.mp3"

// todo: align the chips in to certian path inside a card and also on refresh state should persist && include a chip sound when happen to give a better control for user like a mute/sound 

const chipImages = {
  10: chip10,
  20: chip20,
  50: chip50,
  100: chip100,
  200: chip200,
  500: chip500,
  1000: chip1k,
  5000: chip5k,
  10000: chip10k,
  20000: chip20k,
  50000: chip50k,
  100000: chip100k,
};

const bettingAreas = {
  A: {
    minX: -180,
    maxX: -250,
    minY: -200,
    maxY: -40,
  },
  B: {
    minX: 180,
    maxX: 250,
    minY: -200,
    maxY: -40,
  },
};

const getRandomPosition = (side: string) => {
  const area = bettingAreas[side];
  return {
    x: Math.random() * (area?.maxX - area?.minX) + area?.minX,
    y: Math.random() * (area?.maxY - area?.minY) + area?.minY,
  };
};

const getClosestChipImage = (amount: number) => {
  const amounts = Object.keys(chipImages).map(Number);
  const closest = amounts.reduce((prev, curr) => {
    return Math.abs(curr - amount) < Math.abs(prev - amount) ? curr : prev;
  });
  return chipImages[closest];
};

const BetAnimationManager = ({ newBet, gameEnded }: { newBet: any, gameEnded: boolean}) => {
  const [activeBets, setActiveBets] = useState<any>([]);
  const [positions, setPositions] = useState({});

  const audio = new Audio(chaalSound);

  useEffect(() => {
    if (newBet) {
      const betId = Date.now();
      const position = getRandomPosition(newBet.bet.chosenSide);

     audio.play();
      
      setPositions(prev => ({
        ...prev,
        [betId]: position
      }));

      setActiveBets((prev: any) => [...prev, {
        id: betId,
        amount: newBet.bet.amount / 100,
        userId: newBet.bet.userId,
        chosenSide: newBet.bet.chosenSide,
        isAnimating: true
      }]);
    }
  }, [newBet]);

  useEffect(() => {
    if (gameEnded) {
      setActiveBets([]);
      setPositions({});
    }
  }, [gameEnded]);

  const handleAnimationComplete = (betId: string) => {
    setActiveBets((prev: any) => 
      prev.map((bet: any) => 
        bet.id === betId ? { ...bet, isAnimating: false } : bet
      )
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {activeBets.map((bet: any) => {
          const position = positions[bet.id] || getRandomPosition(bet.chosenSide);
          
          return (
            <motion.div
              key={bet.id}
              className="absolute left-1/2 top-1/2"
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              animate={bet.isAnimating ? {
                scale: 1,
                opacity: 1,
                x: position.x,
                y: position.y,
                rotate: Math.random() * 360, // Random rotation for more natural look
              } : {
                scale: 1,
                opacity: 1,
                x: position.x,
                y: position.y,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeInOut",
                opacity: { duration: 0.2 },
                scale: { duration: 0.3 }
              }}
              onAnimationComplete={() => handleAnimationComplete(bet.id)}
            >
              <div className="relative">
                <img
                  src={getClosestChipImage(bet.amount)}
                  alt={`${bet.amount} chip`}
                  className="w-8 h-8 drop-shadow-lg"
                />
                {/* <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                  ₹{bet.amount}
                </div> */}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default BetAnimationManager;