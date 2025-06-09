import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: (delta: number) => void) => {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(0);

  useEffect(() => {
    const loop = (time: number) => {
      const delta = time - previousTimeRef.current;
      previousTimeRef.current = time;
      callback(delta);
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [callback]);
};
