import express from 'express';
import WebSocket from 'ws';
import { prisma } from '../prisma/prisma';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { generateRandomCard, checkWinner, resolveBets } from './game/GameLogic';
import { WebSocketWithId, GameState } from './types/types';
import AuthRouter from './routes/Auth';
import cors from 'cors';
import User from './routes/User';

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
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: "Too many requests, try again after 10 minutes"
});

const wss = new WebSocket.Server({ port: 5050 });
let clients: WebSocketWithId[] = [];
let currentGameState: GameState | null = null;
let currentPeriod = 0;
let countdownInterval: any = null;
let timeLeft = 15;
let isGameInProgress = false;
let isBettingOpen = true;

app.use('/api/auth', limiter, AuthRouter);

app.use('/api/auth', limiter, User)

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

  const last30Games = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
    take: 30
  });

  ws.send(JSON.stringify({
    type: "findgame",
    findgame: last30Games
  }));
  
  ws.on('message', async (data: WebSocket.Data) => {
    const message = JSON.parse(data.toString());

    if (message.type === 'placeBet' && isBettingOpen) {
      const { email, amount, chosenSide, gameId } = message;
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
                game: { connect: { id: gameId } },
                user: { connect: { id: user.id } },
                result: "PENDING"
              }
            })
          ]);
         const updatedUser = await prisma.user.findUnique({ where: { email } });
          broadcast({
            type: "updatedBalance",
            updatedBalance: updatedUser?.balance
            
          })
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

const startGame = () => {
  if (isGameInProgress) return;

  isGameInProgress = true;
  isBettingOpen = true;
  currentPeriod += 1;
  timeLeft = 15; 

 broadcast({ type: 'gameStarted', period: currentPeriod, timeleft: timeLeft, bettingOpen: isBettingOpen });

  countdownInterval = setInterval(() => {
    if (timeLeft > 0 && isBettingOpen) {
      timeLeft -= 1;
      broadcast({ type: 'timer', timeleft: timeLeft });
    } else if (timeLeft === 0 && isBettingOpen) {
      isBettingOpen = false;
      broadcast({ type: 'bettingClosed' });
      clearInterval(countdownInterval);
      startGamePhase();
    }
  }, 1000);
};

const startGamePhase = async () => {
  const cardAData = generateRandomCard();
  const cardBData = generateRandomCard();
  const winner = checkWinner(cardAData, cardBData);

  const game = await prisma.game.create({
    data: { cardA: `${cardAData.rank}_${cardAData.suit}`, cardB: `${cardBData.rank}_${cardBData.suit}`, winner: winner },
  });

  currentGameState = {
    id: game.id,
    cardA: cardAData.rank,
    cardAImg: cardAData.img,
    cardB: cardBData.rank,
    cardBImg: cardBData.img,
    winner: winner,
  };

  await resolveBets(game.id, winner);
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

  // Wait for the cooldown before starting the next game
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
