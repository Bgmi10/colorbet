import { Prisma } from '@prisma/client';
import { prisma } from '../../../prisma/prisma';

const suits = ['h', 'd', 'c', 's'];
const ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];

const cardOrder: { [key: string]: number } = { 
  a: 14, k: 13, q: 12, j: 11, 
  '10': 10, '9': 9, '8': 8, '7': 7, 
  '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 
};

const suitOrder: { [key: string]: number } = { s: 4, h: 3, d: 2, c: 1 };

export const createCardImages = () => {
  const imgs: { [key: string]: string } = {};
  for (const suit of suits) {
    for (const rank of ranks) {
      imgs[`${rank}_${suit}`] = `https://colorwiz.cyou/images/poker/poker_${suit}_${rank}.png`;
    }
  }
  return imgs;
};

const cardImages = createCardImages();

export const generateRandomCard = () => {
  const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
  const randomSuit = suits[Math.floor(Math.random() * suits.length)];
  const randomKey = `${randomRank}_${randomSuit}`;

  return {
    rank: randomRank,
    suit: randomSuit,
    img: cardImages[randomKey],
  };
};

export const checkWinner = (
  cardA: { rank: string; suit: string }, 
  cardB: { rank: string; suit: string }
): string => {

  if (cardOrder[cardA.rank] > cardOrder[cardB.rank]) return 'A';
  if (cardOrder[cardA.rank] < cardOrder[cardB.rank]) return 'B';
  
  if (suitOrder[cardA.suit] > suitOrder[cardB.suit]) return 'A';
  if (suitOrder[cardA.suit] < suitOrder[cardB.suit]) return 'B';
  
  return 'D';
};

const COMMISSION_RATES: any = 0.02

const calculateCommission = (betAmount: any, winAmount: any) => {
     const profit = betAmount - winAmount;
     return profit > 0 ? +(profit * COMMISSION_RATES).toFixed(2) : 0 
}

export const resolveBets = async (gameId: number, winner: string) => {
  return prisma.$transaction(async (tx: any) => {
     const game = await tx.game.findUnique({
      where: { id: gameId },
      include: { 
        bets: { 
          include: { 
            user: true 
          } 
        } 
      }
    });

    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    await tx.game.update({
      where: { id: gameId },
      data: { 
        status: 'COMPLETED',
        winner 
      }
    });

    for (const bet of game.bets) {
      const isWinner = 
        (winner === 'A' && bet.chosenSide === 'A') ||
        (winner === 'B' && bet.chosenSide === 'B') ||
        (winner === 'D' && bet.chosenSide === 'D');

      if (isWinner) {
        const winAmount = bet.amount * 2;
        const commission = calculateCommission(winAmount, bet.amount);
        const netWinnings = (winAmount - commission);

        await tx.user.update({
          where: { id: bet.userId },
          data: { 
            balance: { 
              increment: parseInt(netWinnings.toFixed(2)) 
            } 
          }
        });

        await tx.bet.update({
          where: { id: bet.id },
          data: { 
            result: 'WIN',
            commission: commission
          }
        });

        console.log(`Bet ${bet.id}: Won ${winAmount}, Commission: ${commission}, Net Payout: ${netWinnings}`);
      } else {
        await tx.bet.update({
          where: { id: bet.id },
          data: { 
            result: 'LOSE' 
          }
        });
      }
    }

    return game;
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  });
};