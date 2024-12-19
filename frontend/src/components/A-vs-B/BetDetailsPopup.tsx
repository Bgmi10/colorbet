import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface BetRecord {
    id: number;
    gameId: string;
    amount: number;
    chosenSide: 'A' | 'B';
    result: 'WIN' | 'LOSE';
    createdAt: string;
    commission: number;
}

interface BetDetailsPopupProps {
  bet: BetRecord;
  onClose: () => void;
}

export const BetDetailsPopup: React.FC<BetDetailsPopupProps> = ({ bet, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3 className="text-xl font-bold text-yellow-500 mb-4">Bet Details</h3>
        <div className="space-y-2 text-gray-300">
          <p><span className="font-semibold">Game ID:</span> {bet.gameId}</p>
          <p><span className="font-semibold">Bet Amount:</span> {bet.amount}</p>
          <p><span className="font-semibold">Chosen Side:</span> {bet.chosenSide}</p>
          <p><span className="font-semibold">Result: </span>  
          <span className={bet.result === 'WIN' ? 'text-green-500 font-serif text-sm' : 'text-red-500 font-serif text-sm'}>{bet.result === "WIN" ? "Won" : "Lost"}
          </span></p>
          <p><span className="font-semibold">Profit:</span> <span className={bet.result === 'WIN' ? 'text-green-500' : 'text-red-500'}>{bet.result === 'WIN' ? `+${bet.amount}` : '0'}</span></p>
          <p><span className="font-semibold">Commission:</span> <span className={bet.commission === 0 ? 'text-green-500' : 'text-red-500'}>{bet.commission === 0 ? '0' : `-${bet.commission}`}</span></p>
          <p><span className="font-semibold">Time:</span> {new Date(bet.createdAt).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          })}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
