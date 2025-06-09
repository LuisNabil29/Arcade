import { useEffect, useState } from 'react';
import type { InputState } from '../types/tetris.types';

const initialState: InputState = {
  left: false,
  right: false,
  down: false,
  rotate: false
};

export const useInput = () => {
  const [state, setState] = useState<InputState>(initialState);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          setState(s => ({ ...s, left: true }));
          break;
        case 'ArrowRight':
          setState(s => ({ ...s, right: true }));
          break;
        case 'ArrowDown':
          setState(s => ({ ...s, down: true }));
          break;
        case 'ArrowUp':
        case 'Space':
          setState(s => ({ ...s, rotate: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          setState(s => ({ ...s, left: false }));
          break;
        case 'ArrowRight':
          setState(s => ({ ...s, right: false }));
          break;
        case 'ArrowDown':
          setState(s => ({ ...s, down: false }));
          break;
        case 'ArrowUp':
        case 'Space':
          setState(s => ({ ...s, rotate: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return state;
};
