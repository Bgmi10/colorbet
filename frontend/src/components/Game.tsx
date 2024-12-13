import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GameCard } from './GameCard';
import { UserBetRecords } from './UserBetRecords';
import { baseurl } from '../utils/constants';
import { GameRecord } from './GameRecord';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';


const GameComponent = () => {
  const [game, setGame] = useState(null);
  const [amount, setAmount] = useState(10);
  const [chosenSide, setChosenSide] = useState('Red');
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState(null);
  const [isbetting, setIsbetting] = useState(true);
  const [revealCards, setRevealCards] = useState(false);
  const [timer, setTimer] = useState(0);
  const [pockerbackimageurl, setPockerBackImageUrl] = useState('');
  const [gamerecord, setGamerecord] = useState(null);
  const navigate = useNavigate();

  const [userBetRecords, setUserBetRecords] = useState([
    { id: 1, amount: 50, side: 'Red', result: 'Win', timestamp: '2023-05-10 14:30:00' },
    { id: 2, amount: 30, side: 'Black', result: 'Loss', timestamp: '2023-05-10 14:25:00' },
    { id: 3, amount: 100, side: 'Red', result: 'Win', timestamp: '2023-05-10 14:20:00' },
  ]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5050' || 'wss://localhost:5050');

    ws.onopen = () => {
      console.log("Connected to the WebSocket server");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data?.type === "bettingClosed"){
        setIsbetting(false);
      }
      if (data?.type === "timer" || data?.type === "gameStarted") {
        setTimer(data?.timeleft);
        if(data?.bettingOpen){
          setIsbetting(true);
        }
        if (data?.type === "gameStarted") {
          setRevealCards(false);
        }
      }

      if (data?.type === "pokerback") {
        setPockerBackImageUrl(data?.imageurl)
      }

     
      if (data?.type === "currentgame" ||  data?.type === "gameResult" || data?.type === "findgame") {

        setGame(data);

        if(data?.type === "gameResult"){
          setTimeout(() => {
            setGame(data);
            setRevealCards(true);
          }, 0);
       }
       setGamerecord(data?.findgame);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const placeBet = async () => {

    if(amount <= 0){
      window.alert("insufficient balance");
      return
    }
    const res = await fetch('/api/bet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, gameId: game?.gameId, amount, chosenSide }),
    });

    const data = await res.json();
    setResult(data.message);

    setUserBetRecords(prevRecords => [
      {
        id: prevRecords.length + 1,
        amount: amount,
        side: chosenSide,
        result: 'Pending',
        timestamp: new Date().toLocaleString()
      },
      ...prevRecords
    ]);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(baseurl + '/api/auth/logout');
      if (res.status === 200) {
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className=" bg-gradient-to-b from-gray-900 to-gray-800 text-white">
         <div className="flex justify-center gap-8 md:gap-12 items-center">    
            <div className="flex items-center">   
            <div className='flex flex-col text-center'>
              <span className="text-red-500 font-serif mb-1 text-xl mt-3">RED</span>   
                <GameCard
                  frontImage={game?.gameState?.cardAImg}
                  backImage={pockerbackimageurl}
                  isWinner={game?.gameState?.winner === 'A'}
                  isRevealed={revealCards}
                />
            </div>
            </div>
             <div className="justify-center flex">
              <img src="https://colorwiz.cyou/images/luckyhit_vs.png" className="h-20" alt="VS" />
             </div>
            <div className="flex items-center">
              <div className='flex flex-col text-center'>
               <span className="text-blue-500 font-serif mb-1 text-xl mt-3">BLUE</span>
                <GameCard
                 frontImage={game?.gameState?.cardBImg}
                 backImage={pockerbackimageurl}
                 isWinner={game?.gameState?.winner === 'B'}
                 isRevealed={revealCards}
               />
              </div>
            </div>
          </div>
      
            <motion.div
              className="text-xl font-bold justify-center flex gap-2 mt-5"
              key={timer}
            >
             <span className='text-md font-serif'>Next Round Starts In </span>
             <motion.span 
              initial={{ scale:1.2 , opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.1 }}
              className={timer <= 5 ? "text-red-500 font-serif" :  "text-yellow-500 font-serif"}
              >
                {timer < 10 ? `0${timer}` : timer}
              </motion.span>
            </motion.div>

          <GameRecord data={gamerecord} />

          <div className="flex flex-col md:flex-row justify-center items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Bet Amount"
              className="w-full md:w-auto bg-gray-700 text-white border border-yellow-500/50 rounded-lg outline-none p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <select
              value={chosenSide}
              onChange={(e) => setChosenSide(e.target.value)}
              className="w-full md:w-auto bg-gray-700 text-white border outline-none border-yellow-500/50 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-serif"
              disabled={!isbetting}
            >
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
            </select>
            <button
              onClick={placeBet}
              className={`w-full md:w-auto px-5 py-2 rounded-lg font-serif flex justify-center items-center gap-2 transition duration-300 ${
                isbetting
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`} 
              disabled={!isbetting}
            >
              Place Bet <FontAwesomeIcon icon={faMoneyBill} />
            </button>
          </div>

          {result && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4 text-yellow-500 font-bold text-xl"
            >
              {result}
            </motion.p>
          )}
        
        <UserBetRecords records={userBetRecords} />
    </div>
  );
};

export default GameComponent;

