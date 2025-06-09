export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  color: string | null;
}

export interface InputState {
  left: boolean;
  right: boolean;
  down: boolean;
  rotate: boolean;
}
