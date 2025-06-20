import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, InputState } from '../types/galaga.types';
import { GamePhase } from '../types/galaga.types';
import { GalagaEngine } from '../engine/GalagaEngine';
import { useGameLoop } from './useGameLoop';
import { useInput } from './useInput';

export const useGalaga = () => {
  const engineRef = useRef<GalagaEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the game engine
  const initializeEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new GalagaEngine();
      setGameState(engineRef.current.getGameState());
      setIsInitialized(true);
    }
  }, []);

  // Input handling
  const { inputState, resetInput } = useInput();

  // Game update function
  const updateGame = useCallback((deltaTime: number) => {
    if (!engineRef.current || !gameState) return;

    // Handle pause input
    if (inputState.pause) {
      if (gameState.phase === GamePhase.PLAYING) {
        engineRef.current.pauseGame();
      } else if (gameState.phase === GamePhase.PAUSED) {
        engineRef.current.resumeGame();
      }
      resetInput();
    }

    // Handle restart input
    if (inputState.restart) {
      engineRef.current.resetGame();
      resetInput();
    }

    // Update the engine
    engineRef.current.update(deltaTime, inputState);

    // Sync state
    const newState = engineRef.current.getGameState();
    setGameState(newState);
  }, [gameState, inputState, resetInput]);

  // Game loop
  const isGameRunning = gameState?.phase !== GamePhase.GAME_OVER && isInitialized;
  const { getFPS } = useGameLoop(updateGame, isGameRunning);

  // Game control functions
  const startGame = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.startGame();
      setGameState(engineRef.current.getGameState());
    }
  }, []);

  const pauseGame = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.pauseGame();
      setGameState(engineRef.current.getGameState());
    }
  }, []);

  const resumeGame = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resumeGame();
      setGameState(engineRef.current.getGameState());
    }
  }, []);

  const resetGame = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resetGame();
      setGameState(engineRef.current.getGameState());
    }
  }, []);

  // Initialize engine on mount
  useEffect(() => {
    initializeEngine();
  }, [initializeEngine]);

  // Debug functions
  const getDebugInfo = useCallback(() => {
    if (!engineRef.current) return null;
    
    return {
      ...engineRef.current.getStats(),
      fps: getFPS(),
      inputState,
      isInitialized
    };
  }, [getFPS, inputState, isInitialized]);

  const setDebugStage = useCallback((stage: number) => {
    if (engineRef.current) {
      engineRef.current.setStage(stage);
    }
  }, []);

  const addDebugScore = useCallback((points: number) => {
    if (engineRef.current) {
      engineRef.current.addDebugScore(points);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetInput();
    };
  }, [resetInput]);

  return {
    // Game state
    gameState,
    isInitialized,
    
    // Game controls
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    
    // Debug functions
    getDebugInfo,
    setDebugStage,
    addDebugScore,
    
    // Direct engine access (use carefully)
    getEngine: () => engineRef.current
  };
};