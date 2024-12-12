import express from 'express';
import WebSocket from 'ws';
import { prisma } from '../prisma/prisma';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
//@ts-ignore
import { generateRandomCard, checkWinner } from '../game/GameLogic';
import { WebSocketWithId, GameState } from '../types/types';
import AuthRouter from './routes/Auth';
import cors from 'cors'

const app = express();
app.use(cors({
  origin : "http://localhost:5173",
  methods : ['GET','POST','PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 3005;

const limiter = rateLimit({
  windowMs : 10 * 60 * 1000,
  limit : 100,
  standardHeaders : 'draft-7',
  legacyHeaders : false,
  message : "too many request try after 10 minutes"
})

const wss = new WebSocket.Server({ port: 5050 });
let clients: WebSocketWithId[] = [];
let currentGameState: GameState | null = null;
let currentPeriod = 0;
let countdownInterval: any = null;
let timeLeft = 15; // The countdown timer (in seconds)
let isGameInProgress = false; // Track if a game is in progress
let isBettingOpen = true; // Manage betting phase

app.use('/api/auth', limiter, AuthRouter);

// Broadcast message to all clients
const broadcast = (message: any) => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

wss.on('connection', async (ws: WebSocketWithId) => {
  clients.push(ws);
  console.log('New client connected');

  if (currentGameState) {
    ws.send(JSON.stringify({
      type: 'currentgame',
      gameState: currentGameState,
      period: currentPeriod,
      timeleft: timeLeft,
      bettingOpen: isBettingOpen,
    }));
  }

  try{
    const findgame = await prisma.game.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 30
    });
    ws.send(JSON.stringify({ type: "findgame", findgame: findgame}));
  }
  catch(e){
    console.log(e);
  }

  ws.on('message', async (data: WebSocket.Data) => {
     
    const message = JSON.parse(data.toString());

    if (message.type === 'placeBet' && isBettingOpen) { // Only allow bets when betting is open
      const { userId, amount, chosenSide } = message;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (user && user.balance >= amount) {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: { balance: user.balance - amount },
          });
          ws.send(JSON.stringify({ type: 'betPlaced', success: true }));
        } catch (e) {
          console.error('Error placing bet:', e);
          ws.send(JSON.stringify({ type: 'betPlaced', success: false, message: 'Bet placement failed' }));
        }
      } else {
        ws.send(JSON.stringify({ type: 'betPlaced', success: false, message: 'Insufficient balance' }));
      }
    }
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
    console.log('Client disconnected');
  });
});

const startGame = () => {
  if (isGameInProgress) return;

  isGameInProgress = true;
  isBettingOpen = true; // Betting is open for 15 seconds
  currentPeriod += 1;
  timeLeft = 15; // Reset countdown for betting phase

  // Broadcast the start of the game with betting open
  broadcast({ type: 'gameStarted', period: currentPeriod, timeleft: timeLeft, bettingOpen: isBettingOpen });

  // Start the countdown for the betting phase
  countdownInterval = setInterval(() => {
    if (timeLeft > 0 && isBettingOpen) {
      timeLeft -= 1;
      broadcast({ type: 'timer', timeleft: timeLeft });
      broadcast({type : "pokerback" , imageurl : "https://colorwiz.cyou/images/poker/poker_back.png"});
     // broadcast({ type: 'gameResult', gameState: "", period: "", timeleft: 0 });
    } else if (timeLeft === 0 && isBettingOpen) {
      // Close betting and start the game phase
      broadcast({type : "pokerback" , imageurl : ""})
      isBettingOpen = false;
      broadcast({ type: 'bettingClosed' });
      clearInterval(countdownInterval); // Clear the betting phase countdown
      startGamePhase(); // Move to game phase after betting ends
    }
  }, 1000);
};

const startGamePhase = async () => {
  // Generate random cards and determine the winner
  const cardAData = generateRandomCard();
  const cardBData = generateRandomCard();
  const winner = checkWinner(cardAData, cardBData);

  // Create a new game in the database
  const game = await prisma.game.create({
    data: { cardA: `${cardAData.rank}_${cardAData.suit}`, cardB: `${cardBData.rank}_${cardBData.suit}`, winner },
  });

  currentGameState = {
    id: game.id,
    cardA: cardAData.rank,
    cardAImg: cardAData.img,
    cardB: cardBData.rank,
    cardBImg: cardBData.img,
    winner,
  };
   const last30Games = await prisma.game.findMany({
    orderBy: { 
      createdAt: "desc"
    },
    take: 30
   });

  // Broadcast the result of the game
  broadcast({ type: 'gameResult', gameState: currentGameState, period: currentPeriod, timeleft: 0, findgame: last30Games });

  // Countdown for the cooldown period before starting the next game
  setTimeout(() => {
    isGameInProgress = false; // Allow the next game to start after the cooldown
    startGame(); // Start the next game after cooldown
  }, 15000); // Cooldown period of 15 seconds before next game
};

// Start the game cycle
startGame();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Handle clean shutdown
process.on('SIGINT', () => {
  if (countdownInterval) clearInterval(countdownInterval);
  console.log('Shutting down gracefully...');
  process.exit();
});
