# Memory Bank: Snake Game Development

## Objetivo Principal
Implementar el juego Snake completo y funcional, integrándolo con la plataforma Arcade existente.

## Estado Actual
- ✅ Base de la plataforma implementada (Fase 1 completada)
- ✅ Placeholder de Snake existente en `/src/games/snake/SnakePage.tsx`
- 🎯 **OBJETIVO:** Reemplazar placeholder con juego funcional

## Arquitectura del Juego Snake

### Estructura de Archivos Requerida
```
src/games/snake/
├── SnakePage.tsx           # ✅ Existe - Página principal del juego
├── engine/
│   ├── SnakeEngine.ts      # 🔨 CREAR - Lógica principal del juego
│   ├── Snake.ts            # 🔨 CREAR - Entidad serpiente
│   ├── Food.ts             # 🔨 CREAR - Sistema de comida
│   ├── Grid.ts             # 🔨 CREAR - Tablero de juego
│   └── GameState.ts        # 🔨 CREAR - Estado del juego
├── hooks/
│   ├── useSnake.ts         # 🔨 CREAR - Hook principal del juego
│   ├── useGameLoop.ts      # 🔨 CREAR - Loop de movimiento
│   └── useInput.ts         # 🔨 CREAR - Manejo de controles
├── components/
│   ├── SnakeCanvas.tsx     # 🔨 CREAR - Canvas de renderizado
│   ├── GameUI.tsx          # 🔨 CREAR - UI del juego (score, high score)
│   ├── Controls.tsx        # 🔨 CREAR - Controles direccionales
│   └── GameOver.tsx        # 🔨 CREAR - Pantalla de game over
├── styles/
│   ├── snake.css           # 🔨 CREAR - Estilos específicos
│   └── animations.css      # 🔨 CREAR - Animaciones del juego
└── types/
    └── snake.types.ts      # 🔨 CREAR - Tipos TypeScript
```

## Especificaciones Técnicas

### 1. Game Grid (Tablero)
```typescript
// Configuración del tablero
const GRID_CONFIG = {
  WIDTH: 20,        // 20 celdas de ancho
  HEIGHT: 20,       // 20 celdas de alto
  CELL_SIZE: 20,    // 20px por celda
  TOTAL_WIDTH: 400, // 400px total
  TOTAL_HEIGHT: 400 // 400px total
};

// Representación: Coordenadas (x, y)
type Position = { x: number; y: number };
```

### 2. Snake Entity (Serpiente)
```typescript
// Estructura de la serpiente
interface SnakeSegment {
  x: number;
  y: number;
}

// Direcciones posibles
enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

// Estado de la serpiente
interface SnakeState {
  body: SnakeSegment[];     // Array de segmentos
  direction: Direction;     // Dirección actual
  nextDirection: Direction; // Próxima dirección (buffer)
  growing: boolean;         // Si debe crecer en próximo movimiento
}
```

### 3. Food System (Sistema de Comida)
```typescript
// Tipos de comida
enum FoodType {
  NORMAL = 'NORMAL',    // +10 puntos
  BONUS = 'BONUS',      // +50 puntos (aparece ocasionalmente)
  SPECIAL = 'SPECIAL'   // +100 puntos (muy raro)
}

// Configuración de comida
interface Food {
  position: Position;
  type: FoodType;
  value: number;
  timeLeft?: number; // Para comida temporal
}
```

### 4. Game Mechanics (Mecánicas)

#### Movimiento
- **Velocidad base:** 150ms entre movimientos
- **Aceleración:** Reduce 10ms cada 5 puntos de comida
- **Velocidad mínima:** 50ms (máxima velocidad)
- **Movimiento continuo:** La serpiente se mueve automáticamente

#### Crecimiento
- **Comida normal:** +1 segmento
- **Comida bonus:** +2 segmentos
- **Comida especial:** +3 segmentos

#### Colisiones
- **Paredes:** Game over si toca bordes
- **Auto-colisión:** Game over si toca su propio cuerpo
- **Comida:** Consume y crece

### 5. Scoring System (Puntuación)
```typescript
const SCORING = {
  NORMAL_FOOD: 10,
  BONUS_FOOD: 50,
  SPECIAL_FOOD: 100,
  SPEED_BONUS: 2,     // Bonus por velocidad alta
  LENGTH_MULTIPLIER: 1 // Multiplicador por longitud
};

// Cálculo de score
// Score = (Comida × Valor) + (Velocidad × Bonus) + (Longitud × Multiplicador)
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
- **Swipe Up:** Mover hacia arriba
- **Swipe Down:** Mover hacia abajo
- **Swipe Left:** Mover hacia izquierda
- **Swipe Right:** Mover hacia derecha
- **Botones direccionales:** Controles alternativos
- **Tap:** Pausar (en área específica)

## Implementación por Pasos

### Paso 1: Estructura Base
1. **Crear tipos TypeScript** (`types/snake.types.ts`)
   - Position, Direction, SnakeState, Food, GameState
2. **Implementar Grid** (`engine/Grid.ts`)
   - Sistema de coordenadas
   - Validación de posiciones
3. **Crear Snake** (`engine/Snake.ts`)
   - Lógica de movimiento
   - Crecimiento y colisiones

### Paso 2: Game Logic
1. **Food System** (`engine/Food.ts`)
   - Generación aleatoria de comida
   - Diferentes tipos de comida
   - Sistema de puntuación
2. **SnakeEngine** (`engine/SnakeEngine.ts`)
   - Loop principal del juego
   - Manejo de estado
   - Lógica de colisiones

### Paso 3: React Integration
1. **useSnake Hook** (`hooks/useSnake.ts`)
   - Estado del juego en React
   - Conexión con engine
2. **useGameLoop Hook** (`hooks/useGameLoop.ts`)
   - Loop de animación
   - Control de velocidad
3. **useInput Hook** (`hooks/useInput.ts`)
   - Manejo de controles
   - Prevención de movimientos inválidos

### Paso 4: UI Components
1. **SnakeCanvas** (`components/SnakeCanvas.tsx`)
   - Renderizado con Canvas HTML5
   - Optimizaciones de performance
2. **GameUI** (`components/GameUI.tsx`)
   - Score actual y high score
   - Información del juego
3. **Controls** (`components/Controls.tsx`)
   - Controles táctiles
   - Botones de acción

### Paso 5: Integration
1. **Actualizar SnakePage.tsx**
   - Reemplazar placeholder
   - Integrar todos los componentes
2. **Testing y optimización**
   - Verificar funcionamiento
   - Optimizar performance

## Estilos y Diseño

### Paleta de Colores (Snake)
```css
:root {
  /* Snake Colors */
  --snake-head: #00ff41;      /* Verde brillante - cabeza */
  --snake-body: #00cc33;      /* Verde medio - cuerpo */
  --snake-tail: #009926;      /* Verde oscuro - cola */
  
  /* Food Colors */
  --food-normal: #ff4444;     /* Rojo - comida normal */
  --food-bonus: #ffaa00;      /* Naranja - comida bonus */
  --food-special: #ff00ff;    /* Magenta - comida especial */
  
  /* Grid Colors */
  --grid-bg: #0a0a0a;         /* Negro - fondo */
  --grid-lines: #1a1a1a;      /* Gris oscuro - líneas */
  --grid-border: #333333;     /* Gris - borde */
}
```

### Visual Effects
- **Snake gradient:** Degradado de cabeza a cola
- **Food pulse:** Animación de pulsación para comida
- **Grid pattern:** Patrón sutil de cuadrícula
- **Game over:** Efecto de desvanecimiento

### Responsive Design
- **Desktop:** 400×400px canvas centrado
- **Tablet:** Escala proporcional con controles táctiles
- **Mobile:** Canvas adaptativo + controles grandes

## Advanced Features

### 1. Power-ups (Opcional)
```typescript
enum PowerUpType {
  SLOW_TIME = 'SLOW_TIME',    // Ralentiza el juego temporalmente
  INVINCIBLE = 'INVINCIBLE',  // Inmune a colisiones por 3 segundos
  DOUBLE_SCORE = 'DOUBLE_SCORE', // Doble puntuación por 10 segundos
  SHRINK = 'SHRINK'           // Reduce longitud en 2 segmentos
}
```

### 2. Game Modes (Futuro)
- **Classic:** Modo tradicional
- **Arcade:** Con power-ups y efectos especiales
- **Timed:** Contra reloj
- **Survival:** Velocidad incrementa constantemente

### 3. Visual Enhancements
- **Particle effects:** Al comer comida
- **Screen shake:** En colisiones
- **Smooth movement:** Interpolación entre posiciones
- **Trail effect:** Estela de la serpiente

## Performance Considerations

### Optimization Targets
- **60 FPS:** Renderizado suave
- **Low latency:** Respuesta inmediata a controles
- **Memory efficient:** Sin memory leaks
- **Battery friendly:** Optimizado para móviles

### Technical Optimizations
```typescript
// Ejemplo de optimización de renderizado
const renderOptimized = (ctx: CanvasRenderingContext2D) => {
  // Solo re-renderizar celdas que cambiaron
  const changedCells = getChangedCells();
  changedCells.forEach(cell => renderCell(ctx, cell));
};
```

## Testing Strategy

### Unit Tests
- **Snake movement:** Todas las direcciones
- **Collision detection:** Paredes y auto-colisión
- **Food generation:** Posiciones válidas
- **Scoring system:** Cálculos correctos

### Integration Tests
- **Game flow:** Inicio → Juego → Game Over
- **Controls:** Todos los métodos de input
- **State management:** Persistencia de estado

### User Testing
- **Mobile responsiveness:** Diferentes tamaños de pantalla
- **Performance:** En dispositivos de gama baja
- **Accessibility:** Controles alternativos

## Integration with Platform

### Navigation Updates
1. **HomePage:** Verificar enlace a `/snake`
2. **GameCard:** Actualizar estado de "disponible"
3. **Routing:** Asegurar ruta funcional

### State Management
- **High Score:** Persistir en localStorage
- **Game Settings:** Velocidad, controles preferidos
- **Statistics:** Partidas jugadas, mejor puntuación

## Success Criteria

### Minimum Viable Product (MVP)
- ✅ Juego completamente funcional
- ✅ Controles responsivos (teclado + táctil)
- ✅ Sistema de puntuación
- ✅ Game over y reinicio
- ✅ Integración con plataforma
- ✅ Performance 60 FPS

### Enhanced Features (Nice-to-have)
- 🎯 Efectos visuales avanzados
- 🎯 Sonidos y música
- 🎯 Múltiples niveles de dificultad
- 🎯 Power-ups y bonificaciones
- 🎯 Estadísticas detalladas

## Development Notes

### Key Patterns
- **Game loop:** requestAnimationFrame para movimiento suave
- **State immutability:** Evitar mutaciones directas
- **Event handling:** Debounce para prevenir spam
- **Canvas optimization:** Renderizado eficiente

### Common Pitfalls
- **Direction buffer:** Evitar cambios de dirección muy rápidos
- **Collision timing:** Verificar colisiones antes de movimiento
- **Food placement:** Evitar generar comida sobre la serpiente
- **Memory leaks:** Limpiar event listeners

## Next Steps
1. 🔨 Implementar estructura base y tipos
2. 🔨 Desarrollar engine de Snake
3. 🔨 Crear componentes React
4. 🔨 Integrar con plataforma
5. ✅ Testing exhaustivo
6. 🚀 Optimización y deploy 