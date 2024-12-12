'use client'

import { motion } from 'framer-motion';

interface GameRecordData {
  id: string;
  winner: 'A' | 'B';
}

interface GameRecordProps {
  data: GameRecordData[];
}

export const GameRecord: React.FC<GameRecordProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl  justify-center items-center flex p-4 mb-4 shadow-lg border border-yellow-500/30 gap-3"
    >
      <h2 className="text-xl font-bold text-yellow-500 mb-2">History</h2>
      <div className="flex flex-wrap gap-2">
        {data.map((game) => (
          <img
            key={game.id}
            src={game.winner === 'A' 
              ? 'https://colorwiz.cyou/images/luckyhit_red_dot.png'
              : 'https://colorwiz.cyou/images/luckyhit_black_dot.png'}
            alt={game.winner === 'A' ? 'Red win' : 'Black win'}
            className="w-6 h-6"
          />
        ))}
      </div>
    </motion.div>
  );
};

