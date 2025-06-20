import { useState, useEffect, useCallback } from 'react';
import type { InputState } from '../types/galaga.types';

export const useInput = () => {
  const [inputState, setInputState] = useState<InputState>({
    left: false,
    right: false,
    shoot: false,
    pause: false,
    restart: false
  });

  // Touch state for mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [lastTouchShoot, setLastTouchShoot] = useState(0);

  // Update input state
  const updateInput = useCallback((key: keyof InputState, pressed: boolean) => {
    setInputState(prev => ({
      ...prev,
      [key]: pressed
    }));
  }, []);

  // Keyboard event handlers
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        updateInput('left', true);
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'KeyD':
        updateInput('right', true);
        event.preventDefault();
        break;
      case 'Space':
      case 'ArrowUp':
        updateInput('shoot', true);
        event.preventDefault();
        break;
      case 'KeyP':
        updateInput('pause', true);
        event.preventDefault();
        break;
      case 'KeyR':
        updateInput('restart', true);
        event.preventDefault();
        break;
    }
  }, [updateInput]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        updateInput('left', false);
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'KeyD':
        updateInput('right', false);
        event.preventDefault();
        break;
      case 'Space':
      case 'ArrowUp':
        updateInput('shoot', false);
        event.preventDefault();
        break;
      case 'KeyP':
        updateInput('pause', false);
        event.preventDefault();
        break;
      case 'KeyR':
        updateInput('restart', false);
        event.preventDefault();
        break;
    }
  }, [updateInput]);

  // Touch event handlers
  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    
    // Touch to shoot (with cooldown)
    const now = Date.now();
    if (now - lastTouchShoot > 250) { // 250ms cooldown
      updateInput('shoot', true);
      setLastTouchShoot(now);
      setTimeout(() => updateInput('shoot', false), 100);
    }
  }, [updateInput, lastTouchShoot]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();
    if (!touchStart) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    
    // Threshold for movement
    const threshold = 10;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        updateInput('left', false);
        updateInput('right', true);
      } else {
        updateInput('left', true);
        updateInput('right', false);
      }
    } else {
      updateInput('left', false);
      updateInput('right', false);
    }
  }, [touchStart, updateInput]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    event.preventDefault();
    setTouchStart(null);
    updateInput('left', false);
    updateInput('right', false);
  }, [updateInput]);

  // Mouse event handlers (for debugging)
  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (event.button === 0) { // Left click
      updateInput('shoot', true);
    }
  }, [updateInput]);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (event.button === 0) { // Left click
      updateInput('shoot', false);
    }
  }, [updateInput]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (event.buttons === 1) { // Left button held
      const rect = (event.target as HTMLElement)?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const mouseX = event.clientX;
        
        if (mouseX < centerX - 20) {
          updateInput('left', true);
          updateInput('right', false);
        } else if (mouseX > centerX + 20) {
          updateInput('left', false);
          updateInput('right', true);
        } else {
          updateInput('left', false);
          updateInput('right', false);
        }
      }
    }
  }, [updateInput]);

  // Effect to set up event listeners
  useEffect(() => {
    // Keyboard events
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Touch events
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Mouse events (for desktop debugging)
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      // Clean up keyboard events
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      
      // Clean up touch events
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      // Clean up mouse events
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    handleKeyDown,
    handleKeyUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove
  ]);

  // Manual input control functions
  const setLeft = useCallback((pressed: boolean) => {
    updateInput('left', pressed);
  }, [updateInput]);

  const setRight = useCallback((pressed: boolean) => {
    updateInput('right', pressed);
  }, [updateInput]);

  const setShoot = useCallback((pressed: boolean) => {
    updateInput('shoot', pressed);
  }, [updateInput]);

  const setPause = useCallback((pressed: boolean) => {
    updateInput('pause', pressed);
  }, [updateInput]);

  const setRestart = useCallback((pressed: boolean) => {
    updateInput('restart', pressed);
  }, [updateInput]);

  // Reset all inputs
  const resetInput = useCallback(() => {
    setInputState({
      left: false,
      right: false,
      shoot: false,
      pause: false,
      restart: false
    });
  }, []);

  return {
    inputState,
    setLeft,
    setRight,
    setShoot,
    setPause,
    setRestart,
    resetInput
  };
};