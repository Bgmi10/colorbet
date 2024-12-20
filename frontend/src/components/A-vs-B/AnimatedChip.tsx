import React from 'react';
import { motion } from 'framer-motion';
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

interface AnimatedChipProps {
  amount: number;
  chosenSide: 'A' | 'B';
  onAnimationComplete: () => void;
}

// Create a mapping of amount to corresponding chip image
const chipImages: Record<number, string> = {
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

const AnimatedChip: React.FC<AnimatedChipProps> = ({ amount, chosenSide, onAnimationComplete }) => {
  const chipImage = React.useMemo(() => {
    // Return the image based on the amount or a default value if not found
    return chipImages[amount] || chip10;
  }, [amount]);

  const targetPosition = chosenSide === 'A' ? { x: -200, y: -100 } : { x: 200, y: -100 };

  return (
    <motion.img
      src={chipImage}
      alt={`${amount} chip`}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{ ...targetPosition, opacity: 1, scale: 1, zIndex: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={onAnimationComplete}
      style={{ 
        position: 'fixed', 
        bottom: '50%', 
        left: '50%', 
        width: '50px', 
        height: '50px',
        zIndex: 20,
      }}
    />
  );
};

export default AnimatedChip;
