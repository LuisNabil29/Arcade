import GameBoard from './GameBoard';
import Tetromino, { randomTetromino } from './Tetromino';
import type { InputState, Position } from '../types/tetris.types';

export default class GameLogic {
  board: GameBoard = new GameBoard();
  piece: Tetromino = randomTetromino();
  next: Tetromino = randomTetromino();
  score = 0;
  dropCounter = 0;
  dropInterval = 1000;

  update(delta: number, input: InputState) {
    this.dropCounter += delta;
    if (input.left) this.move(-1);
    if (input.right) this.move(1);
    if (input.down) this.drop();
    if (input.rotate) {
      this.rotate();
    }
    if (this.dropCounter > this.dropInterval) {
      this.drop();
      this.dropCounter = 0;
    }
  }

  move(dir: number) {
    const pos: Position = { x: this.piece.position.x + dir, y: this.piece.position.y };
    if (this.board.isValid(this.piece, pos)) {
      this.piece.position = pos;
    }
  }

  drop() {
    const pos: Position = { x: this.piece.position.x, y: this.piece.position.y + 1 };
    if (this.board.isValid(this.piece, pos)) {
      this.piece.position = pos;
    } else {
      this.board.place(this.piece);
      this.board.clearLines();
      this.piece = this.next;
      this.next = randomTetromino();
      this.piece.position = { x: 3, y: 0 };
      if (!this.board.isValid(this.piece, this.piece.position)) {
        this.reset();
      }
    }
  }

  rotate() {
    const prev = this.piece.rotation;
    this.piece.rotate();
    if (!this.board.isValid(this.piece, this.piece.position)) {
      this.piece.rotation = prev;
    }
  }

  reset() {
    this.board.reset();
    this.piece = randomTetromino();
    this.next = randomTetromino();
    this.score = 0;
  }
}
