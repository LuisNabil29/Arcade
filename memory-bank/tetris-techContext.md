# Tetris - Contexto Técnico Específico

## 🧩 Stack Tecnológico para Tetris

### Core Technologies
- **React 18**: Componentes y hooks para UI
- **TypeScript**: Tipado fuerte para game logic
- **Canvas API**: Renderizado de alta performance
- **RequestAnimationFrame**: Game loop a 60 FPS

### Arquitectura de Componentes

```typescript
// Estructura de componentes Tetris
interface TetrisArchitecture {
  TetrisGame: {
    purpose: "Componente principal que orquesta todo";
    responsibilities: ["Game state", "Event handling", "Component coordination"];
  };
  TetrisCanvas: {
    purpose: "Renderizado del juego en canvas";
    responsibilities: ["Drawing", "Animation", "Visual effects"];
  };
  TetrisUI: {
    purpose: "HUD y controles";
    responsibilities: ["Score display", "Next piece", "Level info"];
  };
}
```

## 🎮 Game Engine Architecture

### Core Classes

```typescript
// Tetromino.ts - Piezas del juego
class Tetromino {
  type: TetrominoType;
  position: Position;
  rotation: number;
  shape: number[][];
  color: string;
  
  rotate(direction: 'left' | 'right'): void;
  move(dx: number, dy: number): void;
  getGhostPosition(board: GameBoard): Position;
}

// GameBoard.ts - Tablero de juego
class GameBoard {
  grid: Cell[][];
  width: number = 10;
  height: number = 20;
  
  isValidPosition(tetromino: Tetromino): boolean;
  placeTetromino(tetromino: Tetromino): void;
  clearLines(): number[];
  isGameOver(): boolean;
}

// GameLogic.ts - Lógica principal
class TetrisLogic {
  board: GameBoard;
  currentPiece: Tetromino;
  nextPiece: Tetromino;
  score: number;
  level: number;
  lines: number;
  
  update(deltaTime: number): void;
  handleInput(input: InputState): void;
  calculateScore(linesCleared: number): number;
}
```

### State Management

```typescript
// Game State usando React hooks
interface GameState {
  status: 'menu' | 'playing' | 'paused' | 'gameOver' | 'lineClearing';
  board: Cell[][];
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  lines: number;
  dropTime: number;
  lastUpdate: number;
}

// Custom hooks para manejo de estado
const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  // ... lógica de estado
};

const useGameLoop = (gameState: GameState, updateGame: Function) => {
  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      updateGame(deltaTime);
      requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
  }, []);
};
```

## 🎨 Rendering System

### Canvas Rendering

```typescript
// Renderer.ts - Sistema de renderizado
class TetrisRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cellSize: number = 30;
  
  renderBoard(board: Cell[][]): void;
  renderTetromino(tetromino: Tetromino): void;
  renderGhost(tetromino: Tetromino, board: GameBoard): void;
  renderEffects(effects: Effect[]): void;
  
  // Optimizaciones de performance
  clearCanvas(): void;
  setTransform(): void;
  drawCell(x: number, y: number, color: string): void;
}

// Efectos visuales
interface Effect {
  type: 'lineClear' | 'drop' | 'rotate';
  position: Position;
  duration: number;
  progress: number;
}
```

### Color System

```typescript
// Colores específicos de Tetris
const TETRIS_COLORS = {
  I: '#00ffff', // Cyan - pieza I
  O: '#ffff00', // Yellow - pieza O
  T: '#800080', // Purple - pieza T
  S: '#00ff00', // Green - pieza S
  Z: '#ff0000', // Red - pieza Z
  J: '#0000ff', // Blue - pieza J
  L: '#ffa500', // Orange - pieza L
  GHOST: '#ffffff40', // Transparente para ghost piece
  GRID: '#333333', // Grid lines
  BACKGROUND: '#000000' // Fondo
} as const;
```

## ⌨️ Input System

### Input Handling

```typescript
// Input types
interface InputState {
  left: boolean;
  right: boolean;
  down: boolean;
  up: boolean;
  rotateLeft: boolean;
  rotateRight: boolean;
  pause: boolean;
  restart: boolean;
}

// useInput hook
const useInput = () => {
  const [inputState, setInputState] = useState<InputState>(initialInput);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'ArrowLeft': setInputState(prev => ({...prev, left: true})); break;
        case 'ArrowRight': setInputState(prev => ({...prev, right: true})); break;
        case 'ArrowDown': setInputState(prev => ({...prev, down: true})); break;
        case 'ArrowUp': setInputState(prev => ({...prev, up: true})); break;
        case 'KeyZ': setInputState(prev => ({...prev, rotateLeft: true})); break;
        case 'KeyX': setInputState(prev => ({...prev, rotateRight: true})); break;
        case 'Space': setInputState(prev => ({...prev, pause: true})); break;
        case 'KeyR': setInputState(prev => ({...prev, restart: true})); break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // Reset input states
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return inputState;
};
```

## 🔧 Performance Optimizations

### Canvas Optimizations

```typescript
// Técnicas de optimización
class PerformanceOptimizer {
  // 1. Dirty rectangle rendering
  dirtyRects: Rectangle[] = [];
  
  markDirty(rect: Rectangle): void {
    this.dirtyRects.push(rect);
  }
  
  renderDirtyRects(): void {
    this.dirtyRects.forEach(rect => {
      this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
      // Re-render only dirty areas
    });
    this.dirtyRects = [];
  }
  
  // 2. Object pooling para tetrominós
  tetrominoPool: Tetromino[] = [];
  
  getTetromino(): Tetromino {
    return this.tetrominoPool.pop() || new Tetromino();
  }
  
  returnTetromino(tetromino: Tetromino): void {
    tetromino.reset();
    this.tetrominoPool.push(tetromino);
  }
  
  // 3. Frame rate limiting
  targetFPS: number = 60;
  frameTime: number = 1000 / this.targetFPS;
  
  shouldRender(deltaTime: number): boolean {
    return deltaTime >= this.frameTime;
  }
}
```

### Memory Management

```typescript
// Gestión eficiente de memoria
interface MemoryManager {
  // Reutilización de arrays para evitar garbage collection
  tempArray: number[][];
  
  // Pool de efectos visuales
  effectPool: Effect[];
  
  // Cleanup automático
  cleanup(): void;
}
```

## 🧪 Testing Framework

### Unit Tests Structure

```typescript
// Tests para lógica de juego
describe('TetrisLogic', () => {
  describe('Line Clearing', () => {
    it('should clear single line', () => {
      // Test implementation
    });
    
    it('should clear multiple lines', () => {
      // Test implementation
    });
    
    it('should calculate correct score', () => {
      // Test implementation
    });
  });
  
  describe('Tetromino Rotation', () => {
    it('should rotate I piece correctly', () => {
      // Test SRS rotation system
    });
    
    it('should handle wall kicks', () => {
      // Test wall kick scenarios
    });
  });
});

// Performance tests
describe('Performance', () => {
  it('should maintain 60 FPS', () => {
    // Performance benchmarks
  });
  
  it('should not exceed memory limits', () => {
    // Memory usage tests
  });
});
```

## 📊 Metrics & Analytics

### Performance Monitoring

```typescript
// Sistema de métricas
class PerformanceMonitor {
  fps: number = 0;
  frameCount: number = 0;
  lastTime: number = 0;
  
  update(timestamp: number): void {
    this.frameCount++;
    if (timestamp - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = timestamp;
    }
  }
  
  getMetrics(): GameMetrics {
    return {
      fps: this.fps,
      memoryUsage: performance.memory?.usedJSHeapSize || 0,
      renderTime: this.lastRenderTime
    };
  }
}
```

## 🔄 Build & Deployment

### Development Setup

```json
// package.json scripts específicos para Tetris
{
  "scripts": {
    "dev:tetris": "vite --mode tetris",
    "build:tetris": "vite build --mode tetris",
    "test:tetris": "vitest run src/games/tetris",
    "benchmark:tetris": "node scripts/benchmark-tetris.js"
  }
}
```

### Environment Configuration

```typescript
// Configuración específica para desarrollo de Tetris
const TETRIS_CONFIG = {
  development: {
    showDebugInfo: true,
    showFPS: true,
    showCollisionBoxes: true,
    enableConsoleLogging: true
  },
  production: {
    showDebugInfo: false,
    showFPS: false,
    showCollisionBoxes: false,
    enableConsoleLogging: false
  }
};
```

## 🚀 Deployment Strategy

### Feature Branch Workflow
1. **Development**: En `feature/tetris`
2. **Testing**: Automated tests + manual QA
3. **Performance**: Benchmark validation
4. **Integration**: Merge to main cuando esté completo

### Success Criteria
- ✅ 60 FPS constantes en dispositivos target
- ✅ Todas las mecánicas de Tetris funcionando
- ✅ Zero memory leaks
- ✅ Cross-browser compatibility
- ✅ Responsive design working

---

**Próximo paso**: Implementar la estructura base de componentes y game loop 