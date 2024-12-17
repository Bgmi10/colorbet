import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/prisma';

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
  // Compare rank first
  if (cardOrder[cardA.rank] > cardOrder[cardB.rank]) return 'A';
  if (cardOrder[cardA.rank] < cardOrder[cardB.rank]) return 'B';
  
  // If ranks are equal, compare suits
  if (suitOrder[cardA.suit] > suitOrder[cardB.suit]) return 'A';
  if (suitOrder[cardA.suit] < suitOrder[cardB.suit]) return 'B';
  
  // If everything is equal, it's a draw
  return 'D';
};

// Commission rates
const COMMISSION_RATES = {
  lowBet: 5,   // For small bets under ₹1000
  midBet: 4,   // For bets between ₹1001 - ₹5000
  highBet: 3   // For high bets above ₹5000
};

export const resolveBets = async (gameId: number, winner: string) => {
  return prisma.$transaction(async (tx: any) => {
    // Fetch game with all related bets and users
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

    // Update game status
    await tx.game.update({
      where: { id: gameId },
      data: { 
        status: 'COMPLETED',
        winner 
      }
    });

    // Process each bet
    for (const bet of game.bets) {
      // Determine if bet is a winner
      const isWinner = 
        (winner === 'A' && bet.chosenSide === 'A') ||
        (winner === 'B' && bet.chosenSide === 'B') ||
        (winner === 'D' && bet.chosenSide === 'D');

      if (isWinner) {
        // Calculate winnings (original bet + winnings)
        const winAmount = bet.amount * 2;

        // Apply commission based on bet amount
        let commissionRate = COMMISSION_RATES.lowBet;
        if (winAmount > 5000) {
          commissionRate = COMMISSION_RATES.highBet;
        } else if (winAmount > 1000) {
          commissionRate = COMMISSION_RATES.midBet;
        }

        // Calculate net winnings after commission
        const commission = Math.floor(winAmount * (commissionRate / 100));
        const netWinnings = winAmount - commission;

        // Update user balance
        await tx.user.update({
          where: { id: bet.userId },
          data: { 
            balance: { 
              increment: netWinnings 
            } 
          }
        });

        // Update bet result
        await tx.bet.update({
          where: { id: bet.id },
          data: { 
            result: 'WIN' 
          }
        });

        console.log(`Bet ${bet.id}: Won ${winAmount}, Commission: ${commission}, Net Payout: ${netWinnings}`);
      } else {
        // Update losing bet result
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
    // Use highest isolation level for financial transactions
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  });
};