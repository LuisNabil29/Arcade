import React, { useEffect, useRef } from 'react';
import GameBoard from './engine/GameBoard';
import Tetromino from './engine/Tetromino';
import Renderer from './engine/Renderer';

interface Props {
  board: GameBoard;
  piece: Tetromino;
}

const TetrisCanvas: React.FC<Props> = ({ board, piece }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer>();

  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        rendererRef.current = new Renderer(ctx);
      }
    }
    if (rendererRef.current) {
      rendererRef.current.render(board, piece);
    }
  }, [board, piece]);

  return <canvas ref={canvasRef} width={300} height={600} className="tetris-canvas" />;
};

export default TetrisCanvas;
