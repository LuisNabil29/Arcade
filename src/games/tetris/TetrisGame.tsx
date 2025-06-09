import { useState, type FC } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { useTetris } from './hooks/useTetris';
import TetrisCanvas from './TetrisCanvas';
import TetrisUI from './TetrisUI';
import './styles/Tetris.css';

const TetrisGame: FC = () => {
  const { update, board, piece, score } = useTetris();
  const [, setTick] = useState(0);

  useGameLoop(delta => {
    update(delta);
    setTick(t => t + 1);
  });

  return (
    <div className="tetris-game">
      <TetrisCanvas board={board} piece={piece} />
      <TetrisUI score={score} />
    </div>
  );
};

export default TetrisGame;
