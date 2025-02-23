import { useState, useEffect, useContext, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameCard } from './GameCard';
import { UserBetRecords } from './UserBetRecords';
import { GameRecord } from './GameRecord';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import ChipSlider from './ChipSlider';
import BetAnimationManager from './BetAnimationManager';

const token = document.cookie.split(';').map((i) => i.trim()).find((i) => i.startsWith('token='))?.split('=')[1];
const ws = new WebSocket(`ws://localhost:5050?token=${token}`);

const GameComponent = () => {
  const [game, setGame] = useState(null);
  const [amount, setAmount] = useState(10);
  const [chosenSide, setChosenSide] = useState('A');
  //@ts-ignore
  const { user, setUser } = useContext(AuthContext);
  //@ts-ignore
  const [result, setResult] = useState(null);
  const [isbetting, setIsbetting] = useState(true);
  const [revealCards, setRevealCards] = useState(false);
  const [timer, setTimer] = useState(0);
  const [pockerbackimageurl, setPockerBackImageUrl] = useState('');
  const [gamerecord, setGamerecord] = useState(null);
  //@ts-ignore
  const [betplaced, setBetplaced] = useState(false);
  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [betamount, setBetAmount] = useState(0);
  //@ts-ignore
  const [showAnimatedChip, setShowAnimatedChip] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  
  
  useEffect(() => {
  
    ws.onopen = () => {
      console.log("Connected to the WebSocket server");
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data?.type === "bettingClosed"){
        setIsbetting(false);
      }
     
      if(data?.type === "updatedBalance"){
        setUpdatedBalance(data?.updatedBalance / 100)
        setUser((p: any) => ({ ...p, balance: data?.updatedBalance }))
      }
      if (data?.type === "timer" || data?.type === "gameStarted") {
        setTimer(data?.timeleft);
        if(data?.bettingOpen){
          setIsbetting(true);
        } 
        if (data?.type === "gameStarted") {
          setGameEnded(false)
          setRevealCards(false);
        }
      }

      if (data?.type === "pokerback") {
        setPockerBackImageUrl(data?.imageurl)
      }

      if(data?.type === "betPlaced"){
        if(data?.success){
        setBetplaced(true);
      }
      }
    
      if (data?.type === "currentgame") {
          setGame(data);
      }

      if(data?.type === "newBet"){
        setBetAmount(data);

        if(data?.bet?.totalAAmount === 0){
          setShowAnimatedChip(false)
        }
      }

      if(data?.type === "gameResult" || data?.type === "findgame"){
        setGameEnded(true)
        setGamerecord(data?.findgame);
        if(data?.type === "gameResult"){
        setTimeout(() => {
          setGame(data);
          setRevealCards(true);
        }, 0);
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
  },[]);

  useMemo(() => game, [game])

  const placeBet = async () => {

    if(user?.balance <= 0){
      window.alert("insufficient balance");
      return;
    }
    setShowAnimatedChip(true);
    ws.send(
      JSON.stringify({
        type: "placeBet",
        email: user?.email,
        //@ts-ignore
        gameId: game?.gameState.id,
        amount: amount * 100,
        chosenSide
      })
    ) 
  };


  // const handleAnimationCompelete = () => {
  //   setBetplaced(true);
  // }

  return (
    <div className=" bg-gradient-to-b dark:from-gray-900 dark:to-gray-900 text-white">
      <div className='flex justify-end right-0 absolute mt-10 mr-10 text-gray-700'>Available balance: ₹ {updatedBalance || updatedBalance === 0 && user?.balance/100}</div>
         <div className="flex justify-center sm: gap-2 lg:gap-8 md:gap-12 items-center">    
         
            <div className="flex items-center">   
            <div className='flex flex-col text-center'>
              <span className="text-red-500 font-serif mb-1 text-xl mt-3">RED</span> 
                <GameCard
                //@ts-ignore
                  frontImage={game?.gameState?.cardAImg}
                  backImage={pockerbackimageurl}
                  //@ts-ignore
                  isWinner={game?.gameState?.winner === 'A'}
                  isRevealed={revealCards}
                  outlineShade={"rgba(252, 78, 65, 0.9)"}
                />
                
                { //@ts-ignore 
                betamount?.bet?.totalAAmount / 100 | 0 }
            </div>
            </div>
             <div className="justify-center flex">
               <img src={"/assets/vs.png"} alt="VS" />
             </div>
            <div className="flex items-center">
              <div className='flex flex-col text-center'>
               <span className="text-blue-500 font-serif mb-1 text-xl mt-3">BLUE</span>
                <GameCard
                //@ts-ignore
                 frontImage={game?.gameState?.cardBImg}
                 //@ts-ignore
                 backImage={pockerbackimageurl}
                 //@ts-ignore
                 isWinner={ game?.gameState?.winner === 'B'}
                 isRevealed={revealCards}
                 outlineShade="rgba(96, 165, 250, 0.9)"
               />
                { //@ts-ignore 
                betamount?.bet?.totalBAmount / 100 | 0} 
              </div>
            </div>
            <AnimatePresence>
          <BetAnimationManager newBet={betamount} gameEnded={gameEnded}/> 
        </AnimatePresence>
          </div>
      
            <motion.div
              className="text-xl font-bold justify-center flex gap-2"
              key={timer}
            >
             <span className='text-md text-gray-700 dark:text-white font-serif'>Next Round Starts In </span>
             <motion.span 
              initial={{ scale:1.2 , opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.1 }}
              className={timer <= 5 ? "text-red-500 font-serif" :  "text-yellow-500 font-serif"}
              >
                {timer < 10 ? `0${timer}` : timer}
              </motion.span>
            </motion.div> 

          <GameRecord //@ts-ignore
          data={gamerecord} />
         <ChipSlider setAmount={setAmount} balance={updatedBalance  || user?.balance / 100}/>
          <div className="flex flex-col md:flex-row justify-center items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Bet Amount"
              className="w-full md:w-auto dark:bg-gray-700 dark:text-white text-gray-700 border border-yellow-500/50 rounded-lg outline-none p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <select
              value={chosenSide}
              onChange={(e) => setChosenSide(e.target.value)}
              className="w-full md:w-auto dark:bg-gray-700 dark:text-white text-gray-700 border outline-none border-yellow-500/50 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-serif"
              disabled={!isbetting}
            >
              <option value="A">Red</option>
              <option value="B">Blue</option>
            </select>
            <button
              onClick={placeBet}
              className={`w-full md:w-auto px-5 py-2 rounded-lg font-serif flex justify-center items-center gap-2 transition duration-300 ${
                isbetting
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                  : 'dark:bg-gray-600 bg-slate-200 text-gray-400 cursor-not-allowed'
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
        
        <UserBetRecords />
    </div>
  );
};

export default GameComponent;

