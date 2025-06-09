import React from 'react';

interface Props {
  score: number;
}

const TetrisUI: React.FC<Props> = ({ score }) => {
  return (
    <div className="tetris-ui">
      <p>Puntuación: {score}</p>
    </div>
  );
};

export default TetrisUI;
