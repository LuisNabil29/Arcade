import { useEffect, useRef, type FC } from 'react';
import GameBoard from './engine/GameBoard';
import Tetromino from './engine/Tetromino';
import Renderer from './engine/Renderer';

interface Props {
  board: GameBoard;
  piece: Tetromino;
}

const TetrisCanvas: FC<Props> = ({ board, piece }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

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
  });

  return <canvas ref={canvasRef} width={300} height={600} className="tetris-canvas" />;
};

export default TetrisCanvas;
