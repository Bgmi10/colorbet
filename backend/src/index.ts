import express from 'express';
import WebSocket from 'ws';
import { prisma } from '../prisma/prisma';
import { generateRandomCard, checkWinner } from '../game/GameLogic';
import { WebSocketWithId, GameState } from '../types/types';

const app = express();
const port = 3005;

const wss = new WebSocket.Server({ port: 5050 });
let clients: WebSocketWithId[] = [];
let currentGameState: GameState | null = null;
let currentPeriod = 0;
let countdownInterval: any = null;
let timeLeft = 15; // The countdown timer (in seconds)
let isGameInProgress = false; // Track if a game is in progress
let isBettingOpen = true; // Manage betting phase

console.log(timeLeft)

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

  // Send current game state to the newly connected client
  if (currentGameState) {
    ws.send(JSON.stringify({
      type: 'currentgame',
      gameState: currentGameState,
      period: currentPeriod,
      timeleft: timeLeft,
      bettingOpen: isBettingOpen,
    }));
  }

  // Fetch the last 30 games and send to the client
  try {
    const games = await prisma.game.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 30
    });
    ws.send(JSON.stringify({ type: 'findgame', success: true, message: games }));
  } catch (e) {
    console.log(e);
    ws.send(JSON.stringify({ type: 'findgame', success: false, message: 'Error while finding games' }));
  }

  ws.on('message', async (data: WebSocket.Data) => {
    // receiving data from the client 
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

  // Broadcast the result of the game
  broadcast({ type: 'gameResult', gameState: currentGameState, period: currentPeriod, timeleft: 0 });

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
