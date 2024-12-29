import express from 'express';
import WebSocket from 'ws';
import { prisma } from '../prisma/prisma';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { generateRandomCard, checkWinner, resolveBets } from './games/A-vs-B/GameLogic';
import { WebSocketWithId, GameState } from './types/types';
import AuthRouter from './routes/Auth';
import cors from 'cors';
import User from './routes/User';
import jwt from "jsonwebtoken";
import GameUserBetRecord from './games/A-vs-B/GameUserBetRecord';
import Authmiddleware from './middlewares/Authmiddleware';
import razorPayment from './routes/razorPayment';
import impsRouter from './routes/imps';
import BankAccountRoute from './routes/BankAccountRoute';

const app = express();
const port = 3005;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 250,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: "Too many requests, better luck next time..."
});

const wss = new WebSocket.Server({ port: 5050 });
let clients: WebSocketWithId[] = [];
let currentGameState: GameState | null = null;
let currentPeriod = 0;
let countdownInterval: any = null;
let timeLeft = 15;
let isGameInProgress = false;
let isBettingOpen = true;
let currentGameId: number | null = null;

app.use('/api/auth', limiter, AuthRouter);
app.use('/api/auth', limiter, Authmiddleware, User);
app.use('/api/game', limiter, GameUserBetRecord);
app.use('/api/payment', limiter, razorPayment);
app.use('/api/payment', limiter, Authmiddleware, impsRouter);
app.use('/api', limiter, Authmiddleware, BankAccountRoute)

const broadcast = (message: any) => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

const sendToUser = (userId: string, message: any) =>{
  const client = clients.find((o) => o.userId === userId)
  if(client && client.readyState === WebSocket.OPEN){
    client.send(JSON.stringify(message));
  }
}


let totalAAmount = 0;
let totalBAmount = 0;

wss.on('connection', async (ws: WebSocketWithId, req) => {

  const params: any = new URLSearchParams(req.url?.split('?')[1]);
  const token = params.get('token');
  if(token === "undefined"){
     ws.close(4000, 'No Token Provided');
     return;
  }
  try{
    if(token){
   const isVerified = jwt.verify(token, process.env.JWT_SECRET as string);
   //@ts-ignore
   ws.userId = isVerified?.userId
   clients.push(ws);
  }  

  
  if (currentGameState) {
    ws.send(JSON.stringify({
      type: 'currentgame',
      gameState: currentGameState,
      period: currentPeriod,
      timeleft: timeLeft,
      bettingOpen: isBettingOpen,
    }));
  }

  // Send the last 30 games on connection
  const last30Games = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
    take: 30
  });

  ws.send(JSON.stringify({
    type: "findgame",
    findgame: last30Games
  }));
  
}
  catch(e){
    console.log(e);
  }
  

  ws.on('close', () => {
    clients = clients.filter((c) => c !== ws);
    console.log('Client disconnected');
  });
  ws.on('message', async (data: WebSocket.Data) => {
    const message = JSON.parse(data.toString());
    
    if (message.type === 'placeBet' && isBettingOpen && currentGameId) {
      const { email, amount, chosenSide } = message;
      const user = await prisma.user.findUnique({ where: { email } });

      if (user && user.balance >= amount) {
        try {
          await prisma.$transaction([
            prisma.user.update({
              where: { email },
              data: { balance: user.balance - amount }
            }),
            prisma.bet.create({
              data: {
                amount,
                chosenSide,
                game: { connect: { id: currentGameId } },
                user: { connect: { id: user.id } },
                result: "PENDING"
              }
            })
          ]);
         

          if(chosenSide === "A"){
            totalAAmount+=amount;
          }
          else if(chosenSide === "B"){
            totalBAmount+=amount;
          }
          broadcast({ 
            type: "newBet",
            bet: {
              userId: user.id,
              amount: amount,
              chosenSide: chosenSide,
              totalAAmount,
              totalBAmount
            }
          });
          const updatedUser = await prisma.user.findUnique({ where: { email } });
          
          if(updatedUser){
          sendToUser(ws.userId!, {
            type: "updatedBalance",
            updatedBalance: updatedUser?.balance  
          })

        }
          ws.send(JSON.stringify({ type: 'betPlaced', success: true }));
          return;
        } catch (e) {
          console.error('Error placing bet:', e);
          ws.send(JSON.stringify({ type: 'betPlaced', success: false, message: 'Bet placement failed' }));
          return;
        }
      } else {
        ws.send(JSON.stringify({ type: 'betPlaced', success: false, message: 'Insufficient balance' }));
        return;
      }
    }
    ws.send(JSON.stringify({
      type: "bet",
      message: "Bet cannot be placed"
    }));
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
    console.log('Client disconnected');
  });
});


// Start a new game
const startGame = async () => {
  if (isGameInProgress) return;

  isGameInProgress = true;
  isBettingOpen = true;
  currentPeriod += 1;
  timeLeft = 15; // Reset countdown for betting phase

  // Create a new game in the database and get its ID
  const newGame = await prisma.game.create({
    data: {
      cardA: "",
      cardB: "",
      winner: ""
    }
  });
  currentGameId = newGame.id;
  // Broadcast game start
  broadcast({ type: 'gameStarted', period: currentPeriod, timeleft: timeLeft, bettingOpen: isBettingOpen });
  // Countdown for the betting phase
  countdownInterval = setInterval(() => {
    if (timeLeft > 0 && isBettingOpen) {
      timeLeft -= 1;
      broadcast({ type: 'timer', timeleft: timeLeft });
    } else if (timeLeft === 0 && isBettingOpen) {
      // End betting phase
      isBettingOpen = false;
      broadcast({ type: 'bettingClosed' });
      clearInterval(countdownInterval);
      startGamePhase();
    }
  }, 1000);

  totalAAmount = 0;
  totalBAmount = 0;

  broadcast({
    type: "newBet",
    bet: {
      totalAAmount,
      totalBAmount
    }
  })
};

// Start the game phase
const startGamePhase = async () => {
  const cardAData = generateRandomCard();
  const cardBData = generateRandomCard();
  const winner = checkWinner(cardAData, cardBData);

  // Update the current game with the drawn cards and winner
  await prisma.game.update({
    where: { id: currentGameId! },
    data: {
      cardA: `${cardAData.rank}_${cardAData.suit}`,
      cardB: `${cardBData.rank}_${cardBData.suit}`,
      winner: winner
    }
  });

  currentGameState = {
    id: currentGameId!,
    cardA: cardAData.rank,
    cardAImg: cardAData.img,
    cardB: cardBData.rank,
    cardBImg: cardBData.img,
    winner: winner,
  };

  const reSolvedBets = await resolveBets(currentGameId!, winner);

  await Promise.all(
    reSolvedBets?.bets?.map(async(i: any) => {
         const user = await prisma.user.findUnique({ where: { id: i.userId } });
        
         if(user){
          //@ts-ignore
          sendToUser(i.userId, {
            type: "updatedBalance",
            updatedBalance: user.balance
          })
         }
    })
  )

  const last30Games = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
    take: 30
  });
  
  
  broadcast({
    type: 'gameResult',
    gameState: currentGameState,
    period: currentPeriod,
    timeleft: 0,
    findgame: last30Games
  });

  setTimeout(() => {
    isGameInProgress = false;
    startGame(); // Start the next game after cooldown
  }, 15000); // 15 seconds cooldown before the next game
};

// Start the first game cycle
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
