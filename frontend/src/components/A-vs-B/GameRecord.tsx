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
   <div className='justify-center flex'> 
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dark:bg-gray-800 rounded-lg mt-3 justify-center items-center flex p-1 border border-yellow-500/30"
    >
      <div className="flex flex-wrap gap-1">
        {data.map((game) => (
          <img
            key={game.id}
            src={game.winner === 'A' 
              ? 'https://colorwiz.cyou/images/luckyhit_red_dot.png'
              : 'https://colorwiz.cyou/images/luckyhit_black_dot.png'}
            alt={game.winner === 'A' ? 'Red win' : 'Black win'}
            className="w-4 h-4"
          />
        ))}
      </div>
    </motion.div>
    </div>
  );
};

