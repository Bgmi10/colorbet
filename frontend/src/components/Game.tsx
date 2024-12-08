import { useState, useEffect } from 'react';
import { GameTimer } from './GameTimer';
import { motion } from 'framer-motion';
import { GameRecord } from './GameRecord';
import axios from 'axios';
import { baseurl } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const GameComponent = () => {
  const [game, setGame] = useState(null);
  const [userId] = useState(1);
  const [amount, setAmount] = useState(10);
  const [chosenSide, setChosenSide] = useState('A');
  const [result, setResult] = useState(null);
  const [isbetting, setIsbetting] = useState(true);
  const [revealLeftCard, setRevealLeftCard] = useState(false);
  const [revealRightCard, setRevealRightCard] = useState(false);
  const [gamerecord, setGameRecord] = useState(null);
  const [timer , setTimer] = useState(0);
  const [pockerbackimageurl , setPockerBackImageUrl] = useState('');
  const navigate = useNavigate();



  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5050' ||'wss://localhost:5050' ); // this is going to be come from prod | local
  
    ws.onopen = () => {
      console.log("Connected to the WebSocket server");
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if(data?.type === "timer" || data?.type === "gameStarted") {
           setTimer(data?.timeleft)
      }

      if(data?.type === "pokerback") {
        setPockerBackImageUrl(data?.imageurl)
      } 

      if(data?.type === "currentgame" || data?.type === "gameResult"){
        setGame(data)
    }

    if(data?.type === "findgame" ) {
      setGameRecord(data);
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
  };

 
  return (
   <> 
    <div>
       <span onClick={ async () => { await axios.post(baseurl + '/api/auth/logout').then(res => res.status=== 200 && navigate('/login')) 
       localStorage.clear()
      }} className=''>Logout</span> 
    </div>
    <div>

      <GameTimer Timer={timer} isbettingopen={isbetting} />
      <GameRecord  data={gamerecord}/>
        <div className="flex justify-center gap-20 p-6">
            <span>RED</span>
          <div className="flex  items-center">
         
            <img src="https://colorwiz.cyou/images/luckyhit_black_avatar.png" alt="User A" />
            <motion.div className='relative'>
               { pockerbackimageurl ?  <motion.img
                src={pockerbackimageurl}
                
              /> : 
              <motion.img
                src={game?.gameState?.cardAImg}
                alt="Card A Front"
              />}
             
              { !pockerbackimageurl && game?.gameState?.winner === 'A' && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-yellow-500"
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  whileHover="pulse"
                >
                </motion.div>
              )}
            </motion.div>
          </div>
          <div className="flex items-center  justify-center">
            <img src="https://colorwiz.cyou/images/luckyhit_vs.png" className="h-16" alt="VS" />
          </div>
              <span>BLACK</span>
          <div className="flex">
          
            <motion.div className="relative">
              {pockerbackimageurl ?  
               <motion.img
                src={pockerbackimageurl}
              /> : 
              <motion.img
                src={game?.gameState?.cardBImg}
                alt="Card B Front"
              />}
              { !pockerbackimageurl  && game?.gameState?.winner === 'B' && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-yellow-500"
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  whileHover="pulse"
                >
                </motion.div>
              )}
            </motion.div>
            <img src="https://colorwiz.cyou/images/luckyhit_red_avatar.png" alt="User B" />
          </div>
        </div>
    
      <div className="flex justify-center items-center mt-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Bet Amount"
          className="border border-gray-300 rounded p-2 mr-2"
        />
        <select
          value={chosenSide}
          onChange={(e) => setChosenSide(e.target.value)}
          className="border border-gray-300 rounded p-2 mr-2"
          disabled={!isbetting}
        >
          <option value="A">Side A</option>
          <option value="B">Side B</option>
        </select>
        <button
          onClick={placeBet}
          className="bg-blue-500 text-white rounded p-2"
          disabled={!isbetting}
        >
          Place Bet
        </button>
      </div>

      {result && <p className="text-center mt-4">{result}</p>}
    </div>
    </>
  );
};

export default GameComponent;
