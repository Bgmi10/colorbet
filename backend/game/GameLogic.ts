import { prisma } from '../prisma/prisma';
import { GameState } from '../types/types';



const suits = ['h', 'd', 'c', 's'];
const ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];



const cardOrder: { [key: string]: number } = { a: 14, k: 13, q: 12, j: 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
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




  export const checkWinner = (cardA: { rank: string; suit: string }, cardB: { rank: string; suit: string }): string => {
    if (cardOrder[cardA.rank] > cardOrder[cardB.rank]) return 'A';
    if (cardOrder[cardA.rank] < cardOrder[cardB.rank]) return 'B';
    if (suitOrder[cardA.suit] > suitOrder[cardB.suit]) return 'A';
    if (suitOrder[cardA.suit] < suitOrder[cardB.suit]) return 'B';
    return 'D'; // Draw
  };


  export const resolveBets = async (gameId: number, winner: string) => {
    const bets = await prisma.bet.findMany({ where: { gameId } });
  
    for (const bet of bets) {
      let result = 'lose';
      if (bet.chosenSide === winner) {
        result = 'win';
  
        await prisma.user.update({
          where: { id: bet.userId },
          data: { balance: { increment: bet.amount * 2 } }, // Double the amount if won
        });
      }
  
      await prisma.bet.update({
        where: { id: bet.id },
        data: { result },
      });
    }
  };