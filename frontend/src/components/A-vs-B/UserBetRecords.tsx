import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { baseurl } from '../../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faRefresh, faChevronUp, faEye } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import { BetDetailsPopup } from './BetDetailsPopup';

interface BetRecord {
  id: number;
  gameId: string;
  amount: number;
  chosenSide: 'A' | 'B';
  result: 'WIN' | 'LOSE';
  createdAt: string;
  commission: number;
}

export const UserBetRecords = () => {
  const [records, setRecords] = useState<{ bets: BetRecord[], totalPages: number } | null>(null);
  const [isBetNotFound, setIsBetNotFound] = useState(false);
  const [isShowCommissionNorm, setIsShowCommissionNorm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetRecord | null>(null);
  const limit = 10;

  const handleShowCommissionNorms = () => {
    setIsShowCommissionNorm(prev => !prev);
  }

  const fetchBetRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`${baseurl}/api/game/A-vs-B/betrecords?page=${page}&limit=${limit}`, {
        withCredentials: true
      });
      const json = res.data;
      if (json?.message === "No bets found for A-vs-B") {
        setIsBetNotFound(true);
      } else if (json?.message === "bets") {
        setRecords(json);
        setIsBetNotFound(false);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to fetch bet records. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleRefreshRecords = () => {
    fetchBetRecords();
  }

  useEffect(() => {
    fetchBetRecords();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNext = () => {
    setPage(p => Math.min(p + 1, records?.totalPages || p));
  }

  const handlePrev = () => {
    setPage(p => Math.max(p - 1, 1));
  }

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleViewDetails = (bet: BetRecord) => {
    setSelectedBet(bet);
  }

  const SkeletonRow = () => (
    <tr>
      <td colSpan={6} className="px-6 py-4">
        <Skeleton variant="text" width="100%" />
      </td>
    </tr>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl p-2 sm:p-6 mt-4 mb-40 border border-yellow-500/30 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">Your Recent Bets</h2>
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      {isBetNotFound ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex flex-col items-center justify-center text-center p-8'
        >
          <span className='text-red-500 text-lg font-serif'>No bets placed yet!</span>
          <p className='text-gray-400 mt-2'>Start betting to see your records here.</p>
        </motion.div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <AnimatePresence>
                {isShowCommissionNorm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='text-xs font-normal absolute bg-slate-900 rounded-md p-2 right-8 mt-[-50px] border border-gray-500 z-10'
                  >
                    0.02% commission is applied on winnings; 0% commission on losses.
                  </motion.div>
                )}
              </AnimatePresence>
              <thead className="text-xs uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 hidden sm:table-cell">Game ID</th>
                   <th scope="col" className="px-4 sm:px-6 py-3 ">Bet Amount</th>
                  <th scope="col" className="px-4 sm:px-6 py-3">Side</th>
                  <th scope="col" className="px-4 sm:px-6 py-3">Result</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 hidden sm:table-cell">Profit</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 hidden sm:table-cell">
                    <Tooltip title="Click for commission info" arrow>
                      <span className="cursor-pointer" onClick={handleShowCommissionNorms}>
                        Commission <FontAwesomeIcon icon={faInfoCircle} className='text-gray-400 ml-1' />
                      </span>
                    </Tooltip>
                  </th>
                  <th scope="col" className="px-24 hidden sm:table-cell">Time</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 sm:hidden">Details</th>
                  <th scope="col" className="hidden sm:table-cell">
                    <Tooltip title="Refresh records" arrow>
                      <FontAwesomeIcon
                        icon={faRefresh}
                        className={`hover:text-gray-400 cursor-pointer border border-gray-500 p-1 mt-2 rounded-md ${isLoading ? "animate-spin" : ""}`}
                        onClick={handleRefreshRecords}
                      />
                    </Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: limit }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : (
                  records?.bets?.map((record: BetRecord, index: number) => (
                    <motion.tr
                      key={record.id}
                      className="bg-gray-800 border-b border-gray-700 last:border-b-0"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">{record.gameId}</td>
                      <td className="px-4 sm:px-6 py-4">{record.amount / 100}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <img
                          src={record?.chosenSide === "A" ? "https://colorwiz.cyou/images/luckyhit_red_dot.png" : "https://colorwiz.cyou/images/luckyhit_black_dot.png"}
                          className='h-4 w-4'
                          alt={`Side ${record.chosenSide}`}
                        />
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={record.result === 'WIN' ? 'text-green-500 font-serif text-sm px-2' : 'text-red-500 font-serif text-sm px-2'}>
                          {record.result === "WIN" ? "Won" : "Lost"}
                        </span>
                      </td>
                      <td className={`px-4 py-4 hidden sm:table-cell ${record.result === "WIN" ? "text-green-500 px-7" : "text-red-500 px-[40px]"}`}>
                        {record.result === "LOSE" ? <span>0</span> : <span>+{record.amount / 100}</span>}
                      </td>
                      <td className={`py-4 hidden sm:table-cell ${record?.commission === 0 ? "text-green-500 px-16" : "text-red-500 px-14"}`}>
                        {record?.commission === 0 ? <span>{record.commission / 100}</span> : <span>-{record.commission / 100}</span>}
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        {new Date(record.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric',
                          hour12: true,
                        })}
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:hidden">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="text-gray-500 ml-3"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className='flex items-center justify-between mt-4'>
            <span className="text-sm text-gray-400">
              Page {page} of {records?.totalPages || 1}
            </span>
            <div className='flex gap-3'>
              <Button
                variant='contained'
                style={{ backgroundColor: "#0f172a" }}
                onClick={handlePrev}
                disabled={page === 1 || isLoading}
              >
                Prev
              </Button>
              <Button
                variant='contained'
                style={{ backgroundColor: "#0f172a" }}
                onClick={handleNext}
                disabled={page === records?.totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 bg-yellow-500 text-gray-900 p-2 rounded-full shadow-lg"
            onClick={handleBackToTop}
          >
            <FontAwesomeIcon icon={faChevronUp} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedBet && (
          <BetDetailsPopup bet={selectedBet} onClose={() => setSelectedBet(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

