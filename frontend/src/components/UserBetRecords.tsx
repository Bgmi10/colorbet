import { motion } from 'framer-motion';

interface BetRecord {
  id: number;
  amount: number;
  side: 'Red' | 'Black';
  result: 'Win' | 'Loss';
  timestamp: string;
}

interface UserBetRecordsProps {
  records: BetRecord[];
}

export const UserBetRecords: React.FC<UserBetRecordsProps> = ({ records }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl p-6 mt-4 mb-40 border border-yellow-500/30 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">Your Recent Bets</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-tl-lg">Amount</th>
              <th scope="col" className="px-6 py-3">Side</th>
              <th scope="col" className="px-6 py-3">Result</th>
              <th scope="col" className="px-6 py-3 rounded-tr-lg">Time</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <motion.tr
                key={record.id}
                className="bg-gray-800 border-b border-gray-700 last:border-b-0"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="px-6 py-4">{record.amount}</td>
                <td className="px-6 py-4">
                  <span className={record.side === 'Red' ? 'text-red-500' : 'text-blue-500'}>
                    {record.side}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={record.result === 'Win' ? 'text-green-500' : 'text-red-500'}>
                    {record.result}
                  </span>
                </td>
                <td className="px-6 py-4">{record.timestamp}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

