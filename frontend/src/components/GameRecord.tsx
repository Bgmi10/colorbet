import React from 'react';

interface Data {
  winner: string;
}

interface GameRecordProps {
  data: {
    message?: Data[]; 
  };
}

export const GameRecord: React.FC<GameRecordProps> = ({ data }) => {

  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap border w-fit m-3 p-2 gap-3">
        {
          data?.message?.map((i: Data, index: number) => (
            <div key={index}>
              {i.winner === "A" && <img src="https://colorwiz.cyou/images/luckyhit_red_dot.png" alt="Red Dot" />}
              {i.winner === "B" && <img src="https://colorwiz.cyou/images/luckyhit_black_dot.png" alt="Black Dot" />}
            </div>
          ))
        }
      </div>
    </div>
  );
};
