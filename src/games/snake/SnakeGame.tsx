import React, { useEffect, useRef, useState } from 'react';
import SnakeCanvas from './SnakeCanvas';
import SnakeUI from './SnakeUI';
import { Direction, Point } from './types';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
];
const INITIAL_DIRECTION: Direction = 'Right';

const getRandomFood = (snake: Point[]): Point => {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
};

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(() => getRandomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && directionRef.current !== 'Down') setDirection('Up');
      else if (e.key === 'ArrowDown' && directionRef.current !== 'Up') setDirection('Down');
      else if (e.key === 'ArrowLeft' && directionRef.current !== 'Right') setDirection('Left');
      else if (e.key === 'ArrowRight' && directionRef.current !== 'Left') setDirection('Right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (directionRef.current === 'Up') head.y -= 1;
        if (directionRef.current === 'Down') head.y += 1;
        if (directionRef.current === 'Left') head.x -= 1;
        if (directionRef.current === 'Right') head.x += 1;

        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= GRID_SIZE ||
          head.y >= GRID_SIZE ||
          prev.some((s) => s.x === head.x && s.y === head.y)
        ) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomFood(newSnake));
          setScore((s) => s + 10);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [food, gameOver]);

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="snake-game">
      <SnakeCanvas
        gridSize={GRID_SIZE}
        cellSize={CELL_SIZE}
        snake={snake}
        food={food}
      />
      <SnakeUI score={score} gameOver={gameOver} onRestart={handleRestart} />
    </div>
  );
};

export default SnakeGame;
