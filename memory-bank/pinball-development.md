# Memory Bank: Pinball Game Development

## Objetivo Principal
Implementar el juego Pinball completo y funcional, integrándolo con la plataforma Arcade existente.

## Estado Actual
- ✅ Base de la plataforma implementada (Fase 1 completada)
- ✅ Placeholder de Pinball existente en `/src/games/pinball/PinballPage.tsx`
- 🎯 **OBJETIVO:** Reemplazar placeholder con juego funcional

## Arquitectura del Juego Pinball

### Estructura de Archivos Requerida
```
src/games/pinball/
├── PinballPage.tsx         # ✅ Existe - Página principal del juego
├── engine/
│   ├── PinballEngine.ts    # 🔨 CREAR - Lógica principal del juego
│   ├── Ball.ts             # 🔨 CREAR - Física de la pelota
│   ├── Flipper.ts          # 🔨 CREAR - Mecánica de flippers
│   ├── Table.ts            # 🔨 CREAR - Mesa de pinball
│   ├── Targets.ts          # 🔨 CREAR - Objetivos y bumpers
│   ├── Physics.ts          # 🔨 CREAR - Motor de física
│   └── GameState.ts        # 🔨 CREAR - Estado del juego
├── hooks/
│   ├── usePinball.ts       # 🔨 CREAR - Hook principal del juego
│   ├── usePhysics.ts       # 🔨 CREAR - Hook de física
│   └── useInput.ts         # 🔨 CREAR - Manejo de controles
├── components/
│   ├── PinballCanvas.tsx   # 🔨 CREAR - Canvas de renderizado
│   ├── GameUI.tsx          # 🔨 CREAR - UI del juego (score, ball count)
│   ├── Controls.tsx        # 🔨 CREAR - Controles de flippers
│   └── GameOver.tsx        # 🔨 CREAR - Pantalla de game over
├── data/
│   ├── tableLayout.ts      # 🔨 CREAR - Diseño de la mesa
│   ├── targetConfig.ts     # 🔨 CREAR - Configuración de objetivos
│   └── soundEffects.ts     # 🔨 CREAR - Efectos de sonido
├── styles/
│   ├── pinball.css         # 🔨 CREAR - Estilos específicos
│   └── animations.css      # 🔨 CREAR - Animaciones del juego
└── types/
    └── pinball.types.ts    # 🔨 CREAR - Tipos TypeScript
```

## Especificaciones Técnicas

### 1. Table Layout (Diseño de Mesa)
```typescript
// Configuración de la mesa de pinball
const TABLE_CONFIG = {
  WIDTH: 400,       // 400px de ancho
  HEIGHT: 800,      // 800px de alto (formato vertical)
  FLIPPER_AREA: 100, // 100px área inferior para flippers
  PLAY_AREA: 700,   // 700px área de juego principal
  CELL_SIZE: 10     // 10px por unidad de física
};

// Elementos de la mesa
enum TableElement {
  WALL = 'WALL',
  FLIPPER = 'FLIPPER',
  BUMPER = 'BUMPER',
  TARGET = 'TARGET',
  RAMP = 'RAMP',
  HOLE = 'HOLE',
  LAUNCHER = 'LAUNCHER',
  DRAIN = 'DRAIN'
}
```

### 2. Ball Physics (Física de la Pelota)
```typescript
// Estado de la pelota
interface BallState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  radius: number;
  mass: number;
  isActive: boolean;
  trail: Position[]; // Estela visual
}

// Configuración de física
const PHYSICS_CONFIG = {
  GRAVITY: 980,         // Gravedad (píxeles/s²)
  FRICTION: 0.98,       // Fricción de la mesa
  BOUNCE_DAMPING: 0.8,  // Amortiguación de rebotes
  MAX_VELOCITY: 1000,   // Velocidad máxima
  MIN_VELOCITY: 10,     // Velocidad mínima antes de parar
  BALL_RADIUS: 8        // Radio de la pelota
};
```

### 3. Flipper System (Sistema de Flippers)
```typescript
// Estado de flipper
interface FlipperState {
  position: { x: number; y: number };
  angle: number;        // Ángulo actual
  targetAngle: number;  // Ángulo objetivo
  isActive: boolean;    // Si está siendo presionado
  side: 'LEFT' | 'RIGHT';
  length: number;
  width: number;
  pivot: { x: number; y: number }; // Punto de rotación
}

// Configuración de flippers
const FLIPPER_CONFIG = {
  LENGTH: 60,           // Longitud del flipper
  WIDTH: 8,             // Ancho del flipper
  REST_ANGLE: -30,      // Ángulo en reposo (grados)
  ACTIVE_ANGLE: 30,     // Ángulo activo (grados)
  ROTATION_SPEED: 720,  // Velocidad de rotación (grados/s)
  POWER: 500,           // Fuerza de golpe
  
  // Posiciones
  LEFT_POSITION: { x: 120, y: 720 },
  RIGHT_POSITION: { x: 280, y: 720 }
};
```

### 4. Target System (Sistema de Objetivos)
```typescript
// Tipos de objetivos
enum TargetType {
  BUMPER = 'BUMPER',           // Bumper circular
  SLINGSHOT = 'SLINGSHOT',     // Tirachinas lateral
  DROP_TARGET = 'DROP_TARGET', // Objetivo que baja
  SPINNER = 'SPINNER',         // Objetivo giratorio
  RAMP = 'RAMP',              // Rampa
  HOLE = 'HOLE',              // Agujero
  BONUS_TARGET = 'BONUS_TARGET' // Objetivo especial
}

// Configuración de objetivos
interface TargetConfig {
  type: TargetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  points: number;
  bounceForce: number;
  isActive: boolean;
  hitCount: number;
  maxHits?: number;        // Para drop targets
  bonusMultiplier?: number; // Para objetivos especiales
}

// Puntuación por objetivos
const TARGET_SCORING = {
  BUMPER: 100,
  SLINGSHOT: 50,
  DROP_TARGET: 500,
  SPINNER: 25,           // Por rotación
  RAMP: 1000,
  HOLE: 2000,
  BONUS_TARGET: 5000
};
```

### 5. Physics Engine (Motor de Física)
```typescript
// Sistema de colisiones
interface CollisionResult {
  hasCollision: boolean;
  normal: { x: number; y: number }; // Vector normal de colisión
  penetration: number;              // Profundidad de penetración
  contactPoint: { x: number; y: number };
}

// Tipos de colisión
enum CollisionType {
  CIRCLE_CIRCLE = 'CIRCLE_CIRCLE',   // Pelota vs bumper
  CIRCLE_LINE = 'CIRCLE_LINE',       // Pelota vs pared/flipper
  CIRCLE_RECT = 'CIRCLE_RECT',       // Pelota vs objetivo rectangular
  CIRCLE_POLYGON = 'CIRCLE_POLYGON'  // Pelota vs forma compleja
}
```

## Game Mechanics (Mecánicas del Juego)

### 1. Ball Launcher (Lanzador de Pelotas)
```typescript
// Sistema de lanzamiento
interface LauncherState {
  power: number;        // Fuerza de lanzamiento (0-100)
  isCharging: boolean;  // Si está cargando fuerza
  position: { x: number; y: number };
  angle: number;        // Ángulo de lanzamiento
}

const LAUNCHER_CONFIG = {
  MIN_POWER: 200,       // Fuerza mínima
  MAX_POWER: 800,       // Fuerza máxima
  CHARGE_RATE: 300,     // Velocidad de carga (unidades/s)
  POSITION: { x: 380, y: 600 },
  ANGLE: -90            // Lanzamiento hacia arriba
};
```

### 2. Multiball System (Sistema Multiball)
```typescript
// Estado multiball
interface MultiballState {
  isActive: boolean;
  ballCount: number;
  activeBalls: Ball[];
  jackpotMultiplier: number;
  timeRemaining: number;
}

// Condiciones para activar multiball
const MULTIBALL_CONDITIONS = {
  DROP_TARGETS_COMPLETE: 'All drop targets hit',
  RAMP_COMBO: 'Hit ramp 3 times in sequence',
  BONUS_HOLE: 'Ball in bonus hole',
  TIME_LIMIT: 30000     // 30 segundos de multiball
};
```

### 3. Bonus System (Sistema de Bonificaciones)
```typescript
// Tipos de bonus
enum BonusType {
  SKILL_SHOT = 'SKILL_SHOT',     // Disparo de habilidad
  COMBO = 'COMBO',               // Combinación de objetivos
  JACKPOT = 'JACKPOT',           // Premio mayor
  EXTRA_BALL = 'EXTRA_BALL',     // Pelota extra
  MULTIPLIER = 'MULTIPLIER'      // Multiplicador de puntos
}

// Sistema de multiplicadores
interface MultiplierState {
  current: number;      // Multiplicador actual
  duration: number;     // Duración restante
  maxMultiplier: number; // Multiplicador máximo
}
```

### 4. Tilt System (Sistema de Inclinación)
```typescript
// Sistema anti-trampa
interface TiltState {
  warnings: number;     // Advertencias actuales
  maxWarnings: number;  // Máximo antes de tilt
  isTilted: boolean;    // Si está inclinado
  cooldownTime: number; // Tiempo de penalización
}

const TILT_CONFIG = {
  MAX_WARNINGS: 3,      // 3 advertencias antes de tilt
  TILT_DURATION: 5000,  // 5 segundos de penalización
  SENSITIVITY: 0.1      // Sensibilidad del tilt
};
```

## Controles del Juego

### Teclado (Desktop)
- **Espacio:** Lanzar pelota (mantener para cargar fuerza)
- **Shift Izq/Z:** Flipper izquierdo
- **Shift Der/M:** Flipper derecho
- **↑:** Empujar mesa (cuidado con tilt)
- **P:** Pausar/Reanudar
- **R:** Reiniciar juego
- **Esc:** Volver al menú

### Táctil (Mobile)
- **Tap y hold (área de lanzamiento):** Cargar y lanzar
- **Tap izquierda:** Flipper izquierdo
- **Tap derecha:** Flipper derecho
- **Shake device:** Empujar mesa (con detección de tilt)
- **Botones en pantalla:** Controles alternativos

## Implementación por Pasos

### Paso 1: Physics Foundation
1. **Crear tipos base** (`types/pinball.types.ts`)
2. **Physics engine** (`engine/Physics.ts`)
   - Sistema de colisiones
   - Integración de velocidad/posición
   - Detección de límites
3. **Ball implementation** (`engine/Ball.ts`)
   - Física de movimiento
   - Renderizado con trail
   - Estados de activación

### Paso 2: Table Elements
1. **Table layout** (`data/tableLayout.ts`)
   - Diseño de la mesa
   - Posicionamiento de elementos
   - Definición de límites
2. **Flipper system** (`engine/Flipper.ts`)
   - Mecánica de rotación
   - Detección de colisión con pelota
   - Transferencia de momentum

### Paso 3: Target System
1. **Target implementation** (`engine/Targets.ts`)
   - Diferentes tipos de objetivos
   - Sistema de puntuación
   - Efectos visuales y sonoros
2. **Collision detection**
   - Optimización de detección
   - Respuesta física realista
   - Efectos de rebote

### Paso 4: Game Systems
1. **Launcher mechanism** 
   - Sistema de carga de fuerza
   - Lanzamiento preciso
   - Skill shot detection
2. **Scoring and bonuses**
   - Sistema de puntuación complejo
   - Multiplicadores y combos
   - Extra balls y jackpots

### Paso 5: Advanced Features
1. **Multiball system**
   - Manejo de múltiples pelotas
   - Condiciones de activación
   - Jackpot mechanics
2. **Tilt system**
   - Detección de movimiento excesivo
   - Sistema de advertencias
   - Penalizaciones

## Estilos y Diseño

### Paleta de Colores (Pinball)
```css
:root {
  /* Mesa y estructura */
  --table-surface: #2a4d3a;      /* Verde mesa */
  --table-border: #8b4513;       /* Marrón madera */
  --table-rails: #c0c0c0;        /* Plata rieles */
  
  /* Pelota y elementos móviles */
  --ball-color: #e6e6fa;         /* Plata pelota */
  --ball-trail: #ffffff40;       /* Estela semi-transparente */
  --flipper-color: #ff6b35;      /* Naranja flippers */
  
  /* Objetivos y bumpers */
  --bumper-active: #ff0080;       /* Rosa bumpers */
  --bumper-inactive: #800040;     /* Rosa oscuro */
  --target-hit: #00ff00;          /* Verde objetivo golpeado */
  --target-normal: #ffff00;       /* Amarillo objetivo normal */
  
  /* Efectos y UI */
  --score-popup: #ffffff;         /* Blanco texto puntuación */
  --bonus-text: #ffd700;          /* Dorado bonus */
  --multiball: #ff4500;           /* Naranja multiball */
  --jackpot: #ff1493;             /* Rosa jackpot */
}
```

### Visual Effects
- **Ball trail:** Estela de la pelota en movimiento
- **Impact effects:** Destellos en colisiones
- **Score popups:** Animaciones de puntuación
- **Flipper glow:** Brillo al activar flippers
- **Multiball effects:** Efectos especiales durante multiball
- **Table lighting:** Iluminación dinámica de objetivos

### Responsive Design
- **Desktop:** Canvas 400×800px (formato vertical)
- **Mobile:** Escala para pantalla completa vertical
- **Tablet:** Tamaño intermedio con controles optimizados

## Advanced Features

### 1. Mission System
```typescript
// Misiones del juego
enum MissionType {
  TARGET_SEQUENCE = 'TARGET_SEQUENCE',   // Secuencia de objetivos
  TIME_CHALLENGE = 'TIME_CHALLENGE',     // Desafío de tiempo
  SKILL_SHOT = 'SKILL_SHOT',            // Disparo de precisión
  MULTIBALL_MASTER = 'MULTIBALL_MASTER', // Dominio del multiball
  COMBO_KING = 'COMBO_KING'             // Rey de los combos
}

interface Mission {
  id: string;
  type: MissionType;
  description: string;
  requirements: any;
  reward: number;
  isCompleted: boolean;
}
```

### 2. Table Themes
- **Classic:** Mesa tradicional con elementos básicos
- **Space:** Tema espacial con efectos futuristas
- **Medieval:** Castillo con dragones y caballeros
- **Underwater:** Tema submarino con criaturas marinas

### 3. Tournament Mode
- **Time Attack:** Máxima puntuación en tiempo limitado
- **Survival:** Mantener pelotas en juego el mayor tiempo
- **Precision:** Completar objetivos específicos
- **Endurance:** Partida de duración extendida

## Performance Considerations

### Physics Optimization
```typescript
// Optimización del motor de física
class PhysicsEngine {
  private spatialGrid: SpatialGrid;
  private activeObjects: PhysicsObject[];
  
  update(deltaTime: number): void {
    // Solo procesar objetos activos
    this.activeObjects.forEach(obj => {
      if (obj.isMoving()) {
        this.updatePhysics(obj, deltaTime);
      }
    });
    
    // Detección de colisiones optimizada
    this.spatialGrid.detectCollisions();
  }
}
```

### Rendering Optimization
- **Dirty rectangle:** Solo re-renderizar áreas que cambiaron
- **Object culling:** No renderizar objetos fuera de pantalla
- **Sprite batching:** Agrupar renderizado de elementos similares
- **Effect pooling:** Reutilizar objetos de efectos visuales

## Testing Strategy

### Physics Testing
- **Ball movement:** Trayectorias realistas
- **Collision accuracy:** Detección precisa en todos los ángulos
- **Flipper response:** Timing y fuerza correctos
- **Boundary conditions:** Comportamiento en bordes y esquinas

### Gameplay Testing
- **Scoring system:** Cálculos correctos de puntuación
- **Bonus mechanics:** Activación y funcionamiento de bonuses
- **Multiball:** Manejo correcto de múltiples pelotas
- **Tilt system:** Detección apropiada de trampa

## Integration with Platform

### Navigation
- **From home:** Click en tarjeta Pinball → `/pinball`
- **Return home:** Botón "Volver" → `/`
- **Game state:** Persistir high scores y estadísticas

### Platform Features
- **Leaderboard:** Mejores puntuaciones globales
- **Achievements:** Logros por misiones completadas
- **Statistics:** Tiempo jugado, pelotas perdidas, jackpots

## Success Criteria

### Minimum Viable Product (MVP)
- ✅ Física realista de pelota con gravedad y rebotes
- ✅ Flippers responsivos con timing preciso
- ✅ Mesa completa con objetivos variados
- ✅ Sistema de puntuación y bonificaciones
- ✅ Launcher con control de fuerza
- ✅ Sistema básico de tilt
- ✅ Controles fluidos (teclado + táctil)

### Enhanced Features (Nice-to-have)
- 🎯 Sistema multiball completo
- 🎯 Misiones y desafíos especiales
- 🎯 Efectos visuales y sonoros avanzados
- 🎯 Múltiples temas de mesa
- 🎯 Modo torneo y competitivo

## Development Challenges

### Technical Complexity
1. **Physics simulation:** Motor de física realista y eficiente
2. **Collision detection:** Precisión en formas complejas
3. **Real-time performance:** 60 FPS con múltiples objetos
4. **Input responsiveness:** Flippers con timing perfecto

### Unique Mechanics
- **Flipper physics:** Transferencia realista de momentum
- **Ball spin:** Efectos de rotación en movimiento
- **Table tilt:** Detección de movimiento excesivo
- **Multiball chaos:** Manejo de múltiples pelotas simultáneas

## Next Steps
1. 🔨 Crear motor de física básico
2. 🔨 Implementar pelota y flippers
3. 🔨 Desarrollar sistema de colisiones
4. 🔨 Crear mesa y objetivos
5. 🔨 Implementar sistema de puntuación
6. 🔨 Desarrollar características avanzadas
7. ✅ Testing exhaustivo de física
8. 🚀 Optimización y pulido final 