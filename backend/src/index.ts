import express from 'express';
import WebSocket from 'ws';
import { prisma } from '../prisma/prisma';  // Ensure prisma is configured correctly
import { generateRandomCard, checkWinner, resolveBets } from '../game/GameLogic';
import { WebSocketWithId, GameState } from '../types/types';  // Assume proper types are defined

const app = express();
const port = 3005;

const wss = new WebSocket.Server({ port: 5050 });
let clients: WebSocketWithId[] = [];
let currentGameState: GameState | null = null;
let currentPeriod = 0;
let interval: NodeJS.Timeout | null = null;

const broadcast = (message: any) => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// WebSocket connection
wss.on('connection', async (ws: WebSocketWithId) => {
  clients.push(ws);
  console.log('New client connected');

  // Retrieve the latest ongoing game from the database if no game state exists in memory
  if (!currentGameState) {
    const latestGame = await prisma.game.findFirst({
      orderBy: { createdAt: 'desc' }  // Find the most recent game
    });

    if (latestGame) {
      currentGameState = {
        id: latestGame.id,
        cardA: latestGame.cardA.split('_')[0],  // Assume cardA is stored as "rank_suit"
        cardAImg: `https://colorwiz.cyou/images/poker/poker_${latestGame.cardA.split('_')[1]}.png`,
        cardB: latestGame.cardB.split('_')[0],
        cardBImg: `https://colorwiz.cyou/images/poker/poker_${latestGame.cardB.split('_')[1]}.png`,
        winner: latestGame.winner,
      };
    }
  }

  // Send current game state to the newly connected client
  if (currentGameState) {
    ws.send(
      JSON.stringify({
        type: 'currentgame',
        gamestate: currentGameState,
        period: currentPeriod,
      })
    );
  }

  // Handle messages (e.g., placing bets)
  ws.on('message', async (data: WebSocket.Data) => {
    const message = JSON.parse(data.toString());
    
    if (message.type === 'placeBet') {
      const { userId, amount, chosenSide } = message;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (user && user.balance >= amount) {
        try {
          // Place the bet in the database
        //   await prisma.bet.create({
        //     data: {
        //       amount,
        //       chosenSide,
        //       user: { connect: { id: userId } },
        //       game: currentGameState ? { connect: { id: currentGameState.id } } : undefined
        //     }
        //   });

          // Deduct the user's balance
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

  // Handle client disconnection
  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
    console.log('Client disconnected');
  });
});

// Game start logic
const startGame = () => {
  interval = setInterval(async () => {
    currentPeriod += 1;

    // Generate new cards and determine the winner
    const cardAData = generateRandomCard();
    const cardBData = generateRandomCard();
    const winner = checkWinner(cardAData, cardBData);

    // Store the game result in the database
    const game = await prisma.game.create({
      data: { cardA: `${cardAData.rank}_${cardAData.suit}`, cardB: `${cardBData.rank}_${cardBData.suit}`, winner },
    });

    // Store the current game state in memory
    currentGameState = {
      id: game.id,
      cardA: cardAData.rank,
      cardAImg: cardAData.img,
      cardB: cardBData.rank,
      cardBImg: cardBData.img,
      winner,
    };

    // Resolve bets for the current game
    await resolveBets(game.id, winner);

    // Broadcast the game result to all clients
    broadcast({
      type: 'gameResult',
      gameState: currentGameState,
      period: currentPeriod,
      timeleft: 15,  // Assuming a 15-second countdown for the next game round
    });
  }, 15000);  // Set the interval for each game round
};

// Start the game
startGame();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Handle clean shutdown
process.on('SIGINT', () => {
  if (interval) clearInterval(interval);
  console.log('Shutting down gracefully...');
  process.exit();
});
