import React from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { useTetris } from './hooks/useTetris';
import TetrisCanvas from './TetrisCanvas';
import TetrisUI from './TetrisUI';
import './styles/Tetris.css';

const TetrisGame: React.FC = () => {
  const { update, board, piece, score } = useTetris();

  useGameLoop(delta => update(delta));

  return (
    <div className="tetris-game">
      <TetrisCanvas board={board} piece={piece} />
      <TetrisUI score={score} />
    </div>
  );
};

export default TetrisGame;
