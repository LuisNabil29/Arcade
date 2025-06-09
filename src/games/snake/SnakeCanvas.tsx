import React, { useEffect, useRef } from 'react';
import { Point } from './types';

interface SnakeCanvasProps {
  gridSize: number;
  cellSize: number;
  snake: Point[];
  food: Point;
}

const SnakeCanvas: React.FC<SnakeCanvasProps> = ({ gridSize, cellSize, snake, food }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, gridSize * cellSize, gridSize * cellSize);

    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

    // Draw snake
    ctx.fillStyle = '#00ff00';
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });
  }, [snake, food, gridSize, cellSize]);

  return <canvas ref={canvasRef} width={gridSize * cellSize} height={gridSize * cellSize} />;
};

export default SnakeCanvas;
