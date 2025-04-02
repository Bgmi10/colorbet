import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameCard } from './GameCard';
import { UserBetRecords } from './UserBetRecords';
import { GameRecord } from './GameRecord';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import ChipSlider from './ChipSlider';
import BetAnimationManager from './BetAnimationManager';
import { useLocation } from 'react-router-dom';

// Define types for WebSocket messages and game state
interface User {
  email: string;
  balance: number;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface GameState {
  id: string;
  cardAImg: string;
  cardBImg: string;
  winner?: 'A' | 'B';
  [key: string]: any;
}

interface BetAmounts {
  totalAAmount: number;
  totalBAmount: number;
  [key: string]: any;
}

interface Game {
  gameState: GameState;
  [key: string]: any;
}

interface BetAmount {
  bet: BetAmounts;
  [key: string]: any;
}

interface WebSocketMessage {
  type: string;
  timeleft?: number;
  bettingOpen?: boolean;
  imageurl?: string;
  success?: boolean;
  updatedBalance?: number;
  findgame?: any;
  gameState?: GameState;
  bet?: BetAmounts;
  [key: string]: any;
}

// Create a WebSocket connection manager
const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const location = useLocation();
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Function to create and set up WebSocket
  const setupWebSocket = () => {
    const token = document.cookie.split(';').map((i) => i.trim()).find((i) => i.startsWith('token='))?.split('=')[1];
    if (!token) return;

    const wsUrl = import.meta.env.VITE_APP_NODE_ENV === "production" 
      ? `wss://api.casinobharat.space/ws/?token=${token}` 
      : `ws://localhost:5050?token=${token}`;
    
    // Close existing connection if any
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close();
    }

    // Create new connection
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      console.log("Connected to the WebSocket server");
      setIsConnected(true);
      
      // Request current game state and bet records on connection
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "requestInitialData"
        }));
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      
      // Clear any existing reconnection timeout
      if (reconnectTimeoutRef.current !== null) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Attempt to reconnect after a delay only if component is still mounted
      reconnectTimeoutRef.current = window.setTimeout(() => {
        if (wsRef.current) {
          setupWebSocket();
        }
        reconnectTimeoutRef.current = null;
      }, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket Error: ", error);
      setIsConnected(false);
    };
  };

  // Effect to handle WebSocket connection
  useEffect(() => {
    setupWebSocket();

    // Clean up function
    return () => {
      if (reconnectTimeoutRef.current !== null) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (wsRef.current) {
        console.log("Cleaning up WebSocket connection");
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [location.pathname]); // Reconnect when route changes

  return {
    ws: wsRef.current,
    isConnected,
    send: (data: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(data);
      } else {
        console.warn("WebSocket is not connected, cannot send message");
      }
    }
  };
};

const GameComponent = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [amount, setAmount] = useState<number>(10);
  const [chosenSide, setChosenSide] = useState<'A' | 'B'>('A');
  const { user, setUser } = useContext(AuthContext as React.Context<AuthContextType>);
  const [result, setResult] = useState<string | null>(null);
  const [isbetting, setIsbetting] = useState<boolean>(true);
  const [revealCards, setRevealCards] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [pockerbackimageurl, setPockerBackImageUrl] = useState<string>('');
  const [gamerecord, setGamerecord] = useState<any>(null);
  const [betplaced, setBetplaced] = useState<boolean>(false);
  const [updatedBalance, setUpdatedBalance] = useState<number>(0);
  const [betamount, setBetAmount] = useState<BetAmount | null>(null);
  const [showAnimatedChip, setShowAnimatedChip] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [betRecordsFetched, setBetRecordsFetched] = useState<boolean>(false);
  const [loadingInitialData, setLoadingInitialData] = useState<boolean>(true);
  const [cardClickFeedback, setCardClickFeedback] = useState<{ side: 'A' | 'B', active: boolean }>({ side: 'A', active: false });
  const resultTimeoutRef = useRef<number | null>(null);
  const cardClickFeedbackRef = useRef<number | null>(null);
  
  // Use the WebSocket hook
  const { ws, isConnected, send } = useWebSocket();
  
  // Request user bet records when the component mounts or reconnects
  useEffect(() => {
    if (isConnected && user && !betRecordsFetched) {
      send(JSON.stringify({
        type: "fetchUserBetRecords",
        email: user.email
      }));
      
      // Also request current game state
      send(JSON.stringify({
        type: "requestCurrentGame"
      }));
      
      setBetRecordsFetched(true);
      setLoadingInitialData(false);
    }
  }, [isConnected, user, betRecordsFetched, send]);
  
  // Reset fetched flag if connection drops
  useEffect(() => {
    if (!isConnected) {
      setBetRecordsFetched(false);
    }
  }, [isConnected]);

  useEffect(() => {
    document.body.classList.add('no-select');
  
    const preventDefaultMouseDown = (e) => {
      if (
        !e.target.closest('input') && 
        !e.target.closest('select') && 
        !e.target.closest('button')
      ) {
        e.preventDefault();
      }
    };
    
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
      gameContainer.addEventListener('mousedown', preventDefaultMouseDown);
    }
    
    return () => {
      document.body.classList.remove('no-select');
      if (gameContainer) {
        gameContainer.removeEventListener('mousedown', preventDefaultMouseDown);
      }
    };
  }, []);
  
  useEffect(() => {
    return () => {
      if (resultTimeoutRef.current !== null) {
        window.clearTimeout(resultTimeoutRef.current);
      }
      if (cardClickFeedbackRef.current !== null) {
        window.clearTimeout(cardClickFeedbackRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!ws) return;
    
    const handleMessage = (event: MessageEvent) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      
      if (data.type === "bettingClosed") {
        setIsbetting(false);
      }
     
      if (data.type === "updatedBalance" && data.updatedBalance !== undefined) {
        setUpdatedBalance(data.updatedBalance / 100);
        setUser((prev) => prev ? { ...prev, balance: data.updatedBalance as number } : prev);
      }
      
      if (data.type === "timer" || data.type === "gameStarted") {
        if (data.timeleft !== undefined) {
          setTimer(data.timeleft);
        }
        
        if (data.bettingOpen) {
          setIsbetting(true);
        } 
        
        if (data.type === "gameStarted") {
          setGameEnded(false);
          setRevealCards(false);
          setResult(null);
        }
      }

      if (data.type === "pokerback" && data.imageurl) {
        setPockerBackImageUrl(data.imageurl);
      }

      if (data.type === "betPlaced") {
        if (data.success) {
          setBetplaced(true);
        }
      }
    
      if (data.type === "currentgame") {
        setGame(data as Game);
        setLoadingInitialData(false);
      }

      if (data.type === "newBet") {
        setBetAmount(data as BetAmount);

        if (data.bet?.totalAAmount === 0) {
          setShowAnimatedChip(false);
        }
      }

      if (data.type === "gameResult" || data.type === "findgame") {
        setGameEnded(true);
        
        if (data.findgame) {
          setGamerecord(data.findgame);
        }
        
        if (data.type === "gameResult") {
          // Show the result immediately
          setGame(data as Game);
          
          // Announce result
          if (data.gameState?.winner) {
            const winnerSide = data.gameState.winner === 'A' ? 'RED' : 'BLUE';
            setResult(`${winnerSide} WINS!`);
            
            // Schedule card reveal with a small delay for animation effect
            if (resultTimeoutRef.current !== null) {
              window.clearTimeout(resultTimeoutRef.current);
            }
            
            resultTimeoutRef.current = window.setTimeout(() => {
              setRevealCards(true);
              resultTimeoutRef.current = null;
            }, 800);
          }
        }
      }
      
      if (data.type === "userBetRecords") {
        // Handle user bet records if your UserBetRecords component needs this data
        // You might need to pass this down to the UserBetRecords component
        setBetRecordsFetched(true);
      }
    };

    // Add the message listener if we have a WebSocket
    ws.onmessage = handleMessage;
    
    return () => {
      if (ws) {
        // Remove the specific onmessage handler
        ws.onmessage = null;
      }
    };
  }, [ws, setUser]);

  useMemo(() => game, [game]);

  const placeBet = async (side?: 'A' | 'B') => {
    if (!user || user.balance <= 0) {
      window.alert("Insufficient balance");
      return;
    }

    if (!game || !game.gameState || !game.gameState.id) {
      window.alert("Game not available. Please wait.");
      return;
    }

    // Use the passed side parameter or fall back to the current chosenSide state
    const betSide = side || chosenSide;
    
    // Show visual feedback when betting by clicking a card
    if (side) {
      setCardClickFeedback({ side, active: true });
      
      // Clear previous timeout if exists
      if (cardClickFeedbackRef.current !== null) {
        window.clearTimeout(cardClickFeedbackRef.current);
      }
      
      // Remove feedback after a short delay
      cardClickFeedbackRef.current = window.setTimeout(() => {
        setCardClickFeedback({ side, active: false });
        cardClickFeedbackRef.current = null;
      }, 300);
      
      // Update the chosen side in the dropdown to match the clicked card
      setChosenSide(side);
    }

    setShowAnimatedChip(true);
    
    send(
      JSON.stringify({
        type: "placeBet",
        email: user.email,
        gameId: game.gameState.id,
        amount: amount * 100,
        chosenSide: betSide
      })
    );
  };
  
  // Format balance for display
  const formattedBalance = updatedBalance || (user ? user.balance / 100 : 0);

  // Handler for card clicks
  const handleCardClick = (side: 'A' | 'B') => {
    if (isbetting && isConnected) {
      placeBet(side);
    }
  };

  return (
    <div className="bg-gradient-to-b dark:from-gray-900 dark:to-gray-900 text-white min-h-screen px-2 sm:px-4 md:px-6 py-4" id="game-container">
       
       <style>{`
        .no-select {
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none;   /* Safari */
          -khtml-user-select: none;    /* Konqueror HTML */
          -moz-user-select: none;      /* Firefox */
          -ms-user-select: none;       /* Internet Explorer/Edge */
          user-select: none;           /* Non-prefixed version, currently supported by Chrome and Opera */
        }
        
        /* Allow selection in inputs and other form elements */
        input, select, textarea, button {
          -webkit-user-select: text;
          -khtml-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
      `}</style>

      {loadingInitialData && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      )}
      
      <div className='flex justify-end right-0 absolute mt-2 sm:mt-6 mr-2 sm:mr-8 text-gray-300 text-sm sm:text-base no-select'>
        Available balance: ₹ {formattedBalance.toFixed(2)}
      </div>
      
      <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-8 lg:gap-12 mt-12 sm:mt-0">    
        <div 
          className={`flex items-center relative cursor-pointer ${!isbetting || !isConnected ? 'opacity-80 cursor-not-allowed' : ''}`}
          onClick={() => isbetting && isConnected && handleCardClick('A')}
        >   
          <div className='flex flex-col text-center relative'>
            <span className="text-red-500 font-serif mb-1 text-sm sm:text-xl mt-2 sm:mt-3">RED</span> 
            <motion.div
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <GameCard
                frontImage={game?.gameState?.cardAImg || ''}
                backImage={pockerbackimageurl}
                isWinner={game?.gameState?.winner === 'A'}
                isRevealed={revealCards}
                outlineShade={"rgba(252, 78, 65, 0.9)"}
              />
              {isbetting && isConnected && (
                <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                 
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <motion.div 
                      className=" text-white px-2 py-1 rounded text-xs sm:text-sm font-bold"
                    >
                      Tap to Bet
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
            <span className="text-center mt-1 sm:mt-2 text-sm sm:text-base">
              {betamount?.bet?.totalAAmount ? (betamount.bet.totalAAmount / 100).toFixed(2) : '0'}
            </span>
          </div>
        </div>
        
        <div className="justify-center flex">
          <img src={"/assets/vs.png"} alt="VS" className="sm: w-20 md:w-full ml-1" />
        </div>
        
        <div 
          className={`flex items-center relative cursor-pointer ${!isbetting || !isConnected ? 'opacity-80 cursor-not-allowed' : ''}`}
          onClick={() => isbetting && isConnected && handleCardClick('B')}
        >
          <div className='flex flex-col text-center relative'>
            <span className="text-blue-500 font-serif mb-1 text-sm sm:text-xl mt-2 sm:mt-1">BLUE</span>
            <motion.div
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <GameCard
                frontImage={game?.gameState?.cardBImg || ''}
                backImage={pockerbackimageurl}
                isWinner={game?.gameState?.winner === 'B'}
                isRevealed={revealCards}
                outlineShade="rgba(96, 165, 250, 0.9)"
              />
              {isbetting && isConnected && (
                <div className="absolute inset-0 transition-all duration-200 rounded-lg flex items-center justify-center">
                  {/* Tap overlay */}
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <motion.div 
                      className="text-white px-2 py-1 rounded text-xs sm:text-sm font-bold"
                    >
                      Tap to Bet
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
            <span className="text-center mt-1 sm:mt-2 text-sm sm:text-base">
              {betamount?.bet?.totalBAmount ? (betamount.bet.totalBAmount / 100).toFixed(2) : '0'}
            </span>
          </div>
        </div>
        
        <AnimatePresence>
          <BetAnimationManager newBet={betamount} gameEnded={gameEnded}/> 
        </AnimatePresence>
      </div>
    
      <motion.div
        className="text-md sm:text-xl font-bold justify-center flex gap-1 sm:gap-2 mt-3 sm:-mt-2"
        key={timer}
      >
        <span className='text-sm sm:text-lg text-gray-700 dark:text-white font-serif'>Next Round Starts In </span>
        <motion.span 
          initial={{ scale:1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.1 }}
          className={timer <= 5 ? "text-red-500 font-serif" : "text-yellow-500 font-serif"}
        >
          {timer < 10 ? `0${timer}` : timer}
        </motion.span>
      </motion.div> 

      {result && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4 text-yellow-500 font-bold text-sm sm:text-xl"
        >
          {result}
        </motion.p>
      )}

      <GameRecord 
        data={gamerecord} 
      />
      
      <ChipSlider setAmount={setAmount} balance={formattedBalance}/>
      
      <div className="flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-3 space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-4 px-2 sm:px-0">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Bet Amount"
          min={1}
          max={user ? user.balance / 100 : 0}
          className="w-full sm:w-32 md:w-auto text-sm sm:text-base dark:bg-gray-700 dark:text-white text-gray-700 border border-yellow-500/50 rounded-lg outline-none p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
        <select
          value={chosenSide}
          onChange={(e) => setChosenSide(e.target.value as 'A' | 'B')}
          className="w-full sm:w-32 md:w-auto text-sm sm:text-base dark:bg-gray-700 dark:text-white text-gray-700 border outline-none border-yellow-500/50 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-serif"
          disabled={!isbetting || !isConnected}
        >
          <option value="A">Red</option>
          <option value="B">Blue</option>
        </select>
        <button
          onClick={() => placeBet()}
          className={`w-full sm:w-auto px-3 sm:px-5 py-2 rounded-lg font-serif flex justify-center items-center gap-2 transition duration-300 text-sm sm:text-base ${
            isbetting && isConnected
              ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
              : 'dark:bg-gray-600 bg-slate-200 text-gray-400 cursor-not-allowed'
          }`} 
          disabled={!isbetting || !isConnected}
        >
          Place Bet <FontAwesomeIcon icon={faMoneyBill} />
        </button>
      </div>
      
      <UserBetRecords fetchedRecords={betRecordsFetched} />
    </div>
  );
};

export default GameComponent;