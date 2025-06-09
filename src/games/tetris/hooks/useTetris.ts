import { useRef } from 'react';
import GameLogic from '../engine/GameLogic';
import { useInput } from './useInput';

export const useTetris = () => {
  const input = useInput();
  const logicRef = useRef<GameLogic>(new GameLogic());

  const update = (delta: number) => {
    logicRef.current.update(delta, input);
  };

  return {
    update,
    board: logicRef.current.board,
    piece: logicRef.current.piece,
    score: logicRef.current.score
  };
};
