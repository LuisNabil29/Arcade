import GameBoard from './GameBoard';
import Tetromino from './Tetromino';
import type { Position } from '../types/tetris.types';

export default class Renderer {
  ctx: CanvasRenderingContext2D;
  cellSize: number;

  constructor(ctx: CanvasRenderingContext2D, cellSize = 30) {
    this.ctx = ctx;
    this.cellSize = cellSize;
  }

  render(board: GameBoard, piece: Tetromino) {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, board.width * this.cellSize, board.height * this.cellSize);
    this.drawMatrix(board.grid, { x: 0, y: 0 });
    const shape = piece.shape.map(row => row.map(v => (v ? piece.color : null)));
    this.drawMatrix(shape, piece.position);
  }

  private drawMatrix(matrix: (string | null)[][], offset: Position) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.ctx.fillStyle = value;
          this.ctx.fillRect(
            (x + offset.x) * this.cellSize,
            (y + offset.y) * this.cellSize,
            this.cellSize,
            this.cellSize
          );
          this.ctx.strokeStyle = '#111';
          this.ctx.strokeRect(
            (x + offset.x) * this.cellSize,
            (y + offset.y) * this.cellSize,
            this.cellSize,
            this.cellSize
          );
        }
      });
    });
  }
}
