import Tetromino from './Tetromino';
import type { Cell, Position } from '../types/tetris.types';

export default class GameBoard {
  width = 10;
  height = 20;
  grid: (string | null)[][];

  constructor() {
    this.grid = Array.from({ length: this.height }, () => Array(this.width).fill(null));
  }

  isValid(tetromino: Tetromino, pos: Position): boolean {
    const shape = tetromino.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (!shape[y][x]) continue;
        const newX = pos.x + x;
        const newY = pos.y + y;
        if (newX < 0 || newX >= this.width || newY >= this.height) {
          return false;
        }
        if (newY >= 0 && this.grid[newY][newX]) {
          return false;
        }
      }
    }
    return true;
  }

  place(tetromino: Tetromino) {
    const shape = tetromino.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (!shape[y][x]) continue;
        const boardY = tetromino.position.y + y;
        const boardX = tetromino.position.x + x;
        if (boardY >= 0) {
          this.grid[boardY][boardX] = tetromino.color;
        }
      }
    }
  }

  clearLines(): number {
    let lines = 0;
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.grid[y].every(cell => cell)) {
        this.grid.splice(y, 1);
        this.grid.unshift(Array(this.width).fill(null));
        lines++;
        y++;
      }
    }
    return lines;
  }

  reset() {
    this.grid = Array.from({ length: this.height }, () => Array(this.width).fill(null));
  }
}
