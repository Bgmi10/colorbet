import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaCrown, FaCoins } from 'react-icons/fa';
import { GameTimer } from './GameTimer';
import { GameCard } from './GameCard';
import { UserBetRecords } from './UserBetRecords';
import { baseurl } from '../utils/constants';
import { GameRecord } from './GameRecord';


const GameComponent = () => {
  const [game, setGame] = useState(null);
  const [userId] = useState(1);
  const [amount, setAmount] = useState(10);
  const [chosenSide, setChosenSide] = useState('Red');
  const [result, setResult] = useState(null);
  const [isbetting, setIsbetting] = useState(true);
  const [revealCards, setRevealCards] = useState(false);
  const [timer, setTimer] = useState(0);
  const [pockerbackimageurl, setPockerBackImageUrl] = useState('');
  const [gamerecord, setGamerecord] = useState(null);
  const navigate = useNavigate();

  // Mock data for user bet records
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

      if (data?.type === "timer" || data?.type === "gameStarted") {
        setTimer(data?.timeleft)
        if (data?.type === "gameStarted") {
          setRevealCards(false);
        }
      }

      if (data?.type === "pokerback") {
        setPockerBackImageUrl(data?.imageurl)
      }
      
      if (data?.type === "currentgame" || data?.type === "gameResult" || data?.type === "findgame") {
        setGame(data);
        setGamerecord(data?.findgame);
        if (data?.type === "gameResult") {
          setTimeout(() => setRevealCards(true), 1000);
        }
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
    
      {/* <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-yellow-500">
        <h1 className="text-3xl font-bold text-yellow-500">Colorwiz Casino</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-700 rounded-full px-4 py-2">
            <FaCoins className="text-yellow-500 mr-2" />
            <span className="font-bold">1000</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </header> */}
    

      <main className="container mx-auto px-4 py-2">
          <GameRecord data={gamerecord} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl p-4 shadow-2xl border border-yellow-500/30"
        >
          <motion.span
              className="text-5xl font-bold justify-center flex"
              key={timer}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
             {timer < 10 ? `0${timer}` : timer}
            </motion.span>
            <div className="flex justify-center gap-8 md:gap-20 mt-[-50px] items-center">
            
            <div className="flex flex-col items-center">
              <span className="text-red-500 font-bold mb-2 text-xl">RED</span>
              <img src="https://colorwiz.cyou/images/luckyhit_black_avatar.png" alt="User A" className="w-24 h-24 mb-4" />
              <GameCard
                frontImage={game?.gameState?.cardAImg}
                backImage={pockerbackimageurl}
                isWinner={game?.gameState?.winner === 'A'}
                isRevealed={revealCards}
              />
            </div>

            <div className="flex flex-col items-center justify-center">
              <img src="https://colorwiz.cyou/images/luckyhit_vs.png" className="h-24 mb-4" alt="VS" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center"
              >
                <FaCrown className="text-3xl text-white" />
              </motion.div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-blue-500 font-bold mb-2 text-xl">BLACK</span>
              <img src="https://colorwiz.cyou/images/luckyhit_red_avatar.png" alt="User B" className="w-24 h-24 mb-4" />
              <GameCard
                frontImage={game?.gameState?.cardBImg}
                backImage={pockerbackimageurl}
                isWinner={game?.gameState?.winner === 'B'}
                isRevealed={revealCards}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Bet Amount"
              className="w-full md:w-auto bg-gray-700 text-white border border-yellow-500/50 rounded-full p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <select
              value={chosenSide}
              onChange={(e) => setChosenSide(e.target.value)}
              className="w-full md:w-auto bg-gray-700 text-white border border-yellow-500/50 rounded-full p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              disabled={!isbetting}
            >
              <option value="Red">Red</option>
              <option value="Black">Black</option>
            </select>
            <button
              onClick={placeBet}
              className={`w-full md:w-auto px-6 py-2 rounded-full font-bold transition duration-300 ${
                isbetting
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isbetting}
            >
              Place Bet
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
        </motion.div>
        
        <UserBetRecords records={userBetRecords} />
      </main>
    </div>
  );
};

export default GameComponent;

