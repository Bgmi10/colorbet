import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { baseurl } from '../../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faRefresh } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';

interface BetRecord {
  id: number;
  amount: number;
  chosenSide: 'A' | 'B';
  result: 'WIN' | 'LOSE';
  createdAt: string;
  commission: any
}

export const UserBetRecords = () => {
  const [records, setRecords] = useState<any>(null);
  const [isbetnotfound, setIsBetNotFound] = useState(false);
  const [isshowcommissionnorm, setIsShowCommissionNorm] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const totalPages = records?.totalPages;
  console.log(totalPages, records)
 
  const handleShowCommissionNorms = () => {
    setIsShowCommissionNorm(p => !p)
  }

  const fetchBetRecords = async () => {
    try{
      setIsLoading(true);
      const res = await axios.get(`${baseurl}/api/game/A-vs-B/betrecords?page=${page}&limit=${limit}`, {
        withCredentials: true
      });
      const json = await res.data
      if(json?.message === "no bets found for A-vs-B"){
        setIsBetNotFound(true);
        return;
      }
      if(json?.message === "bets"){
        setRecords(json);
        setIsLoading(false);
      }
    
    }
    catch(e){
      console.log(e);
      setIsLoading(false);
    }
  }

  const handleRefreshRecords = () => {
    fetchBetRecords();
  }

  useEffect(() => {
    fetchBetRecords();
  },[page]);
 
  const handleNext = () => {
    setPage(p => p + 1);
  }

  const handlePrev = () => {
    setPage(p => p -  1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl p-6 mt-4 mb-40 border border-yellow-500/30 shadow-lg"
    >
    <h2 className="text-2xl font-bold text-yellow-500 mb-4">Your Recent Bets</h2>
     {isbetnotfound ?  <div className='justify-center  flex text-center'>
      <span className='text-red-500 text-md font-serif'>No bets placed yet!</span></div> : <> 
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
        { isshowcommissionnorm && <span className='text-xs font-normal absolute bg-slate-900 transition-transform  rounded-md p-1 ml-[750px] mt-[-50px] border border-gray-500'>0.02% commission is applied on winnings; 0% commission on losses.</span> }
          <thead className="text-xs uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-tl-lg">Bet Amount</th>
              <th scope="col" className="px-6 py-3">Side</th>
              <th scope="col" className="px-6 py-3">Result</th>
              <th scope="col" className='px-6 py-3'>Profit</th>
              <th scope="col" className='px-6 py-3'>commisson <FontAwesomeIcon icon={faInfoCircle} className='cursor-pointer text-gray-400' onClick={handleShowCommissionNorms}/></th> 
              <th scope="col" className="px-6 py-3">Time</th>
              <th><FontAwesomeIcon icon={faRefresh} spin className={`hover:text-gray-400 cursor-pointer border border-gray-500 p-1 mt-2 rounded-md ${isloading && "animate-spin 1s spin-liner"}`} onClick={handleRefreshRecords}/> 
              </th>
            </tr>
          </thead>
          <tbody>
            
          {//@ts-ignore 
           records?.bets?.map((record : BetRecord, index: number) => (
              <motion.tr
                key={record.id}
                className="bg-gray-800 border-b border-gray-700 last:border-b-0"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="px-6 py-4">{record.amount}</td>
                <td className="px-6 py-4">
                  <img src={record?.chosenSide === "A" ? "https://colorwiz.cyou/images/luckyhit_red_dot.png" : "https://colorwiz.cyou/images/luckyhit_black_dot.png"}  className='h-4 w-4'/>
                </td>
                <td className="px-6 py-4">
                  <span className={record.result === 'WIN' ? 'text-green-500 font-serif text-sm' : 'text-red-500 font-serif text-sm'}>
                    {record.result === "WIN" ? "Won": "Lost"}
                  </span>
                </td>
                <td className="text-green-500">{record.result === "LOSE" ? <span>0</span> : <span>+{record.amount}</span>}</td>
                <td className={record?.commission === 0 ? "text-green-500" : "text-red-500"}>{record?.commission === 0 ? <span>{record.commission}</span> : <span>-{record.commission}</span>}</td>
                <td className="px-6 py-4">{new Date(record.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <div className='flex gap-3 justify-end'> 
           <Button variant='contained' style={{backgroundColor: "#0f172a"}} onClick={handlePrev} disabled={ page === 1 }>Prev</Button>
           <Button variant='contained' style={{backgroundColor: "#0f172a"}} onClick={handleNext} disabled={page === totalPages}>Next</Button>
          </div>
      </div></>}
    </motion.div>
  );
};

