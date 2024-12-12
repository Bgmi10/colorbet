import { motion } from 'framer-motion';

interface GameTimerProps {
  Timer: number;
  isbettingopen: boolean;
}

export const GameTimer: React.FC<GameTimerProps> = ({ Timer, isbettingopen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl p-6 mb-8 text-center border border-yellow-500/30 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">Game Timer</h2>
     
      {/* <motion.p
        className={`text-xl font-semibold ${isbettingopen ? 'text-green-500' : 'text-red-500'}`}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        {isbettingopen ? 'Betting Open' : 'Betting Closed'}
      </motion.p> */}
    </motion.div>
  );
};

