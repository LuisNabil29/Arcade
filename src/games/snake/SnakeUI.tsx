import React from 'react';

interface SnakeUIProps {
  score: number;
  gameOver: boolean;
  onRestart: () => void;
}

const SnakeUI: React.FC<SnakeUIProps> = ({ score, gameOver, onRestart }) => (
  <div className="snake-ui">
    <p>Puntuación: {score}</p>
    {gameOver && (
      <div>
        <p>¡Game Over!</p>
        <button onClick={onRestart}>Reiniciar</button>
      </div>
    )}
  </div>
);

export default SnakeUI;
