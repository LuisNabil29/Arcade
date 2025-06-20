import { useEffect, useRef, useCallback } from 'react';

export const useGameLoop = (
  updateCallback: (deltaTime: number) => void,
  isRunning: boolean = true,
  targetFPS: number = 60
) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const fpsCounterRef = useRef({ frames: 0, lastTime: 0, fps: 0 });

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      // Cap deltaTime to prevent huge jumps
      const cappedDeltaTime = Math.min(deltaTime, 1000 / 30); // Max 30 FPS minimum
      
      // Only update if we have a reasonable deltaTime
      if (cappedDeltaTime > 0) {
        updateCallback(cappedDeltaTime);
      }
      
      // Update FPS counter
      const fpsCounter = fpsCounterRef.current;
      fpsCounter.frames++;
      
      if (time - fpsCounter.lastTime >= 1000) {
        fpsCounter.fps = fpsCounter.frames;
        fpsCounter.frames = 0;
        fpsCounter.lastTime = time;
      }
    }
    
    previousTimeRef.current = time;
    
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [updateCallback, isRunning]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, isRunning]);

  // Get current FPS
  const getFPS = useCallback(() => {
    return fpsCounterRef.current.fps;
  }, []);

  // Manually start/stop the loop
  const start = useCallback(() => {
    if (!requestRef.current) {
      previousTimeRef.current = undefined;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const stop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  }, []);

  return {
    getFPS,
    start,
    stop
  };
};