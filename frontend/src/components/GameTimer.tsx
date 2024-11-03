
import { useState, useEffect } from 'react';

export const GameTimer = ({ game, isbettingopen }) => {
  const [timeLeft, setTimeLeft] = useState(game?.timeleft || 0);

  useEffect(() => {
    if (timeLeft > 0) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);

      return () => clearInterval(intervalId); 
    }
  }, [timeLeft]);


  useEffect(() => {
    if (game?.timeleft) {
      setTimeLeft(game.timeleft); 
    }
  }, [game]);

  return (
    <div className='justify-center flex py-5'>
      <h3 className='text-xl text-red-500'>Next game starts in {timeLeft} seconds</h3>
      {/* You can add any visual loading bar based on `timeLeft` here */}
    </div>
  );
};
