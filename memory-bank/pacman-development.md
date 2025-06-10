# Memory Bank: Pac-Man Game Development

## Objetivo Principal
Implementar el juego Pac-Man completo y funcional, integrándolo con la plataforma Arcade existente.

## Estado Actual
- ✅ Base de la plataforma implementada (Fase 1 completada)
- ✅ Placeholder de Pac-Man existente en `/src/games/pacman/PacmanPage.tsx`
- 🎯 **OBJETIVO:** Reemplazar placeholder con juego funcional

## Arquitectura del Juego Pac-Man

### Estructura de Archivos Requerida
```
src/games/pacman/
├── PacmanPage.tsx          # ✅ Existe - Página principal del juego
├── engine/
│   ├── PacmanEngine.ts     # 🔨 CREAR - Lógica principal del juego
│   ├── Player.ts           # 🔨 CREAR - Entidad Pac-Man
│   ├── Ghost.ts            # 🔨 CREAR - Entidades fantasmas
│   ├── Maze.ts             # 🔨 CREAR - Sistema de laberinto
│   ├── Pellets.ts          # 🔨 CREAR - Sistema de puntos y power pellets
│   └── GameState.ts        # 🔨 CREAR - Estado del juego
├── hooks/
│   ├── usePacman.ts        # 🔨 CREAR - Hook principal del juego
│   ├── useGameLoop.ts      # 🔨 CREAR - Loop de animación
│   └── useInput.ts         # 🔨 CREAR - Manejo de controles
├── components/
│   ├── PacmanCanvas.tsx    # 🔨 CREAR - Canvas de renderizado
│   ├── GameUI.tsx          # 🔨 CREAR - UI del juego (score, lives, level)
│   ├── Controls.tsx        # 🔨 CREAR - Controles direccionales
│   └── GameOver.tsx        # 🔨 CREAR - Pantalla de game over
├── data/
│   ├── mazeLayout.ts       # 🔨 CREAR - Diseño del laberinto
│   └── ghostPatterns.ts    # 🔨 CREAR - Patrones de movimiento de fantasmas
├── styles/
│   ├── pacman.css          # 🔨 CREAR - Estilos específicos
│   └── animations.css      # 🔨 CREAR - Animaciones del juego
└── types/
    └── pacman.types.ts     # 🔨 CREAR - Tipos TypeScript
```

## Especificaciones Técnicas

### 1. Maze System (Sistema de Laberinto)
```typescript
// Configuración del laberinto
const MAZE_CONFIG = {
  WIDTH: 19,        // 19 celdas de ancho
  HEIGHT: 21,       // 21 celdas de alto
  CELL_SIZE: 20,    // 20px por celda
  TOTAL_WIDTH: 380, // 380px total
  TOTAL_HEIGHT: 420 // 420px total
};

// Tipos de celda
enum CellType {
  EMPTY = 0,        // Espacio vacío
  WALL = 1,         // Pared
  PELLET = 2,       // Punto pequeño
  POWER_PELLET = 3, // Punto de poder
  GHOST_HOUSE = 4,  // Casa de fantasmas
  TUNNEL = 5        // Túnel lateral
}

// Representación del laberinto
type MazeCell = {
  type: CellType;
  x: number;
  y: number;
  hasCollision: boolean;
};
```

### 2. Player Entity (Pac-Man)
```typescript
// Estado de Pac-Man
interface PacmanState {
  position: { x: number; y: number };
  direction: Direction;
  nextDirection: Direction;
  speed: number;
  isMoving: boolean;
  animationFrame: number; // Para animación de boca
  powerMode: boolean;     // Modo poder activo
  powerModeTimer: number; // Tiempo restante de poder
}

// Direcciones
enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  NONE = 'NONE'
}
```

### 3. Ghost System (Sistema de Fantasmas)
```typescript
// Tipos de fantasmas (cada uno con comportamiento único)
enum GhostType {
  BLINKY = 'BLINKY', // Rojo - Agresivo, persigue directamente
  PINKY = 'PINKY',   // Rosa - Embosca, va hacia donde Pac-Man se dirige
  INKY = 'INKY',     // Cyan - Impredecible, usa posición de Blinky
  CLYDE = 'CLYDE'    // Naranja - Tímido, huye cuando está cerca
}

// Estados de fantasmas
enum GhostMode {
  SCATTER = 'SCATTER',     // Modo dispersión
  CHASE = 'CHASE',         // Modo persecución
  FRIGHTENED = 'FRIGHTENED', // Modo asustado (power pellet)
  EATEN = 'EATEN'          // Fantasma comido, regresando a casa
}

// Estado individual de fantasma
interface GhostState {
  type: GhostType;
  position: { x: number; y: number };
  direction: Direction;
  mode: GhostMode;
  speed: number;
  target: { x: number; y: number }; // Objetivo actual
  inHouse: boolean; // Si está en la casa de fantasmas
  modeTimer: number; // Tiempo en modo actual
}
```

### 4. Pellet System (Sistema de Puntos)
```typescript
// Configuración de puntos
const PELLET_CONFIG = {
  NORMAL_POINTS: 10,      // Puntos por pellet normal
  POWER_PELLET_POINTS: 50, // Puntos por power pellet
  POWER_DURATION: 6000,   // Duración del modo poder (6 segundos)
  GHOST_POINTS: [200, 400, 800, 1600] // Puntos por fantasmas (secuencial)
};

// Estado de pellets
interface PelletState {
  normalPellets: Set<string>; // Posiciones de pellets normales
  powerPellets: Set<string>;  // Posiciones de power pellets
  totalPellets: number;       // Total inicial
  remainingPellets: number;   // Pellets restantes
}
```

### 5. Game Mechanics (Mecánicas)

#### Movement System
- **Grid-based movement:** Movimiento basado en cuadrícula
- **Smooth interpolation:** Interpolación suave entre celdas
- **Direction buffering:** Buffer de dirección para controles responsivos
- **Wall collision:** Detección de colisiones con paredes

#### AI Behavior (Comportamiento de Fantasmas)
```typescript
// Algoritmo de pathfinding para fantasmas
const ghostBehaviors = {
  BLINKY: (pacmanPos: Position) => {
    // Persigue directamente a Pac-Man
    return pacmanPos;
  },
  
  PINKY: (pacmanPos: Position, pacmanDir: Direction) => {
    // Apunta 4 celdas adelante de Pac-Man
    return getPositionAhead(pacmanPos, pacmanDir, 4);
  },
  
  INKY: (pacmanPos: Position, blinkyPos: Position) => {
    // Comportamiento complejo basado en Pac-Man y Blinky
    return calculateInkyTarget(pacmanPos, blinkyPos);
  },
  
  CLYDE: (pacmanPos: Position, ghostPos: Position) => {
    // Si está lejos persigue, si está cerca huye
    const distance = getDistance(pacmanPos, ghostPos);
    return distance > 8 ? pacmanPos : getScatterTarget();
  }
};
```

### 6. Scoring System (Sistema de Puntuación)
```typescript
const SCORING = {
  PELLET: 10,
  POWER_PELLET: 50,
  GHOST_BASE: 200,        // Primera captura
  GHOST_MULTIPLIER: 2,    // Multiplicador por captura consecutiva
  FRUIT_BONUS: [100, 300, 500, 700, 1000, 2000, 3000, 5000],
  EXTRA_LIFE: 10000       // Vida extra cada 10,000 puntos
};
```

## Controles del Juego

### Teclado (Desktop)
- **↑/W:** Mover hacia arriba
- **↓/S:** Mover hacia abajo
- **←/A:** Mover hacia izquierda
- **→/D:** Mover hacia derecha
- **Espacio:** Pausar/Reanudar
- **R:** Reiniciar juego
- **Esc:** Volver al menú

### Táctil (Mobile)
- **Swipe gestures:** Direcciones de movimiento
- **Tap controls:** Botones direccionales en pantalla
- **Touch areas:** Zonas de la pantalla para direcciones

## Implementación por Pasos

### Paso 1: Maze Foundation
1. **Crear tipos base** (`types/pacman.types.ts`)
2. **Diseñar laberinto** (`data/mazeLayout.ts`)
   - Layout clásico de Pac-Man
   - Definir paredes, pasillos, túneles
3. **Implementar Maze class** (`engine/Maze.ts`)
   - Carga y validación del laberinto
   - Detección de colisiones
   - Pathfinding básico

### Paso 2: Player Implementation
1. **Player class** (`engine/Player.ts`)
   - Movimiento basado en grid
   - Animación de Pac-Man
   - Detección de colisiones con pellets
2. **Input handling** (`hooks/useInput.ts`)
   - Buffer de direcciones
   - Validación de movimientos

### Paso 3: Ghost AI
1. **Ghost base class** (`engine/Ghost.ts`)
   - Movimiento y pathfinding
   - Estados y transiciones
2. **AI behaviors** (`data/ghostPatterns.ts`)
   - Implementar comportamientos únicos
   - Modos de juego (scatter, chase, frightened)

### Paso 4: Game Systems
1. **Pellet system** (`engine/Pellets.ts`)
   - Distribución de pellets en el laberinto
   - Power pellet mechanics
2. **Game engine** (`engine/PacmanEngine.ts`)
   - Loop principal del juego
   - Manejo de colisiones
   - Transiciones de estado

### Paso 5: React Integration
1. **Hooks development**
   - `usePacman.ts` - Estado principal
   - `useGameLoop.ts` - Loop de animación
2. **Canvas rendering** (`components/PacmanCanvas.tsx`)
   - Renderizado optimizado del laberinto
   - Animaciones de personajes
3. **UI components**
   - Score, vidas, nivel
   - Controles móviles

## Estilos y Diseño

### Paleta de Colores (Pac-Man)
```css
:root {
  /* Pac-Man */
  --pacman-color: #ffff00;        /* Amarillo clásico */
  --pacman-mouth: #000000;        /* Negro para boca */
  
  /* Fantasmas */
  --ghost-blinky: #ff0000;        /* Rojo */
  --ghost-pinky: #ffb8ff;         /* Rosa */
  --ghost-inky: #00ffff;          /* Cyan */
  --ghost-clyde: #ffb852;         /* Naranja */
  --ghost-frightened: #0000ff;    /* Azul cuando asustados */
  --ghost-eyes: #ffffff;          /* Blanco para ojos */
  
  /* Laberinto */
  --maze-wall: #0000ff;           /* Azul para paredes */
  --maze-bg: #000000;             /* Negro para fondo */
  --pellet-normal: #ffff00;       /* Amarillo para pellets */
  --pellet-power: #ffffff;        /* Blanco para power pellets */
}
```

### Visual Effects
- **Pac-Man animation:** Boca que se abre y cierra
- **Ghost animation:** Movimiento ondulante
- **Power pellet:** Efecto de parpadeo
- **Frightened ghosts:** Cambio de color y temblor
- **Tunnel effect:** Transición suave en túneles laterales

### Responsive Design
- **Desktop:** Canvas 380×420px
- **Mobile:** Escala proporcional con controles táctiles
- **Tablet:** Tamaño intermedio con controles opcionales

## Advanced Features

### 1. Fruit Bonuses
```typescript
// Frutas bonus que aparecen ocasionalmente
enum FruitType {
  CHERRY = 'CHERRY',      // 100 puntos
  STRAWBERRY = 'STRAWBERRY', // 300 puntos
  ORANGE = 'ORANGE',      // 500 puntos
  APPLE = 'APPLE',        // 700 puntos
  MELON = 'MELON',        // 1000 puntos
  GALAXIAN = 'GALAXIAN',  // 2000 puntos
  BELL = 'BELL',          // 3000 puntos
  KEY = 'KEY'             // 5000 puntos
}
```

### 2. Level Progression
- **Speed increase:** Velocidad incrementa por nivel
- **Ghost behavior:** Comportamiento más agresivo
- **Fruit variety:** Diferentes frutas por nivel
- **Intermissions:** Animaciones entre niveles

### 3. Sound Effects (Futuro)
- **Waka waka:** Sonido clásico de comer pellets
- **Ghost sounds:** Diferentes sonidos por estado
- **Power pellet:** Música especial en modo poder
- **Game over:** Melodía de muerte

## Performance Considerations

### Optimization Strategies
```typescript
// Renderizado eficiente del laberinto
const renderMaze = (ctx: CanvasRenderingContext2D) => {
  // Pre-renderizar laberinto estático en buffer
  if (!mazeBuffer) {
    mazeBuffer = createMazeBuffer();
  }
  ctx.drawImage(mazeBuffer, 0, 0);
};

// Pathfinding optimizado para fantasmas
const findPath = memoize((start: Position, target: Position) => {
  return aStar(start, target, mazeGraph);
});
```

### Memory Management
- **Sprite caching:** Pre-cargar y cachear sprites
- **Object pooling:** Reutilizar objetos de animación
- **Event cleanup:** Limpiar listeners al desmontar

## Testing Strategy

### Core Functionality Tests
- **Movement:** Pac-Man se mueve correctamente en el laberinto
- **Collision:** Detección precisa con paredes y fantasmas
- **Pellet collection:** Puntuación y eliminación correcta
- **Ghost AI:** Comportamientos únicos funcionan
- **Power mode:** Mecánica de power pellets

### Edge Cases
- **Tunnel traversal:** Movimiento correcto por túneles
- **Ghost house:** Entrada y salida de fantasmas
- **Simultaneous events:** Múltiples colisiones
- **Level completion:** Transición cuando no quedan pellets

## Integration with Platform

### Navigation
- **From home:** Click en tarjeta Pac-Man → `/pacman`
- **Return home:** Botón "Volver" → `/`
- **Game state:** Mantener high score y estadísticas

### Platform Features
- **High score persistence:** localStorage
- **Game statistics:** Partidas, mejor nivel alcanzado
- **Settings:** Controles, volumen (futuro)

## Success Criteria

### Minimum Viable Product (MVP)
- ✅ Laberinto clásico completamente navegable
- ✅ Pac-Man con movimiento suave y animación
- ✅ 4 fantasmas con AI básica pero funcional
- ✅ Sistema de pellets y power pellets
- ✅ Puntuación y vidas
- ✅ Game over y reinicio
- ✅ Controles responsivos (teclado + táctil)

### Enhanced Features (Nice-to-have)
- 🎯 AI avanzada con comportamientos únicos por fantasma
- 🎯 Frutas bonus y niveles progresivos
- 🎯 Efectos de sonido y música
- 🎯 Animaciones de intermisión
- 🎯 Estadísticas detalladas

## Development Challenges

### Technical Complexity
1. **Ghost AI:** Implementar comportamientos únicos y realistas
2. **Pathfinding:** Algoritmo eficiente para navegación
3. **Timing:** Sincronización precisa de eventos
4. **State management:** Múltiples entidades con estados complejos

### Solutions Approach
- **Modular design:** Separar cada sistema claramente
- **State machines:** Para manejar estados de fantasmas
- **Event system:** Para comunicación entre entidades
- **Testing incremental:** Validar cada componente por separado

## Next Steps
1. 🔨 Crear estructura base y tipos
2. 🔨 Implementar sistema de laberinto
3. 🔨 Desarrollar Pac-Man player
4. 🔨 Crear AI básica de fantasmas
5. 🔨 Integrar sistemas de juego
6. 🔨 Desarrollar UI y controles
7. ✅ Testing y optimización
8. 🚀 Integración con plataforma 