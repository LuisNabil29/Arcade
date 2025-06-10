# Memory Bank: Galaga Game Development

## Objetivo Principal
Implementar el juego Galaga completo y funcional, integrándolo con la plataforma Arcade existente.

## Estado Actual
- ✅ Base de la plataforma implementada (Fase 1 completada)
- ✅ Placeholder de Galaga existente en `/src/games/galaga/GalagaPage.tsx`
- 🎯 **OBJETIVO:** Reemplazar placeholder con juego funcional

## Arquitectura del Juego Galaga

### Estructura de Archivos Requerida
```
src/games/galaga/
├── GalagaPage.tsx          # ✅ Existe - Página principal del juego
├── engine/
│   ├── GalagaEngine.ts     # 🔨 CREAR - Lógica principal del juego
│   ├── Player.ts           # 🔨 CREAR - Nave del jugador
│   ├── Enemy.ts            # 🔨 CREAR - Entidades enemigas
│   ├── Bullet.ts           # 🔨 CREAR - Sistema de proyectiles
│   ├── Formation.ts        # 🔨 CREAR - Formaciones de enemigos
│   ├── PowerUp.ts          # 🔨 CREAR - Power-ups y bonificaciones
│   └── GameState.ts        # 🔨 CREAR - Estado del juego
├── hooks/
│   ├── useGalaga.ts        # 🔨 CREAR - Hook principal del juego
│   ├── useGameLoop.ts      # 🔨 CREAR - Loop de animación
│   └── useInput.ts         # 🔨 CREAR - Manejo de controles
├── components/
│   ├── GalagaCanvas.tsx    # 🔨 CREAR - Canvas de renderizado
│   ├── GameUI.tsx          # 🔨 CREAR - UI del juego (score, lives, stage)
│   ├── Controls.tsx        # 🔨 CREAR - Controles de movimiento y disparo
│   └── GameOver.tsx        # 🔨 CREAR - Pantalla de game over
├── data/
│   ├── enemyPatterns.ts    # 🔨 CREAR - Patrones de movimiento enemigos
│   ├── formations.ts       # 🔨 CREAR - Formaciones de ataque
│   └── stages.ts           # 🔨 CREAR - Configuración de niveles
├── styles/
│   ├── galaga.css          # 🔨 CREAR - Estilos específicos
│   └── animations.css      # 🔨 CREAR - Animaciones del juego
└── types/
    └── galaga.types.ts     # 🔨 CREAR - Tipos TypeScript
```

## Especificaciones Técnicas

### 1. Game Area (Área de Juego)
```typescript
// Configuración del área de juego
const GAME_CONFIG = {
  WIDTH: 400,       // 400px de ancho
  HEIGHT: 600,      // 600px de alto
  PLAYER_AREA: 100, // 100px área inferior para jugador
  ENEMY_AREA: 500,  // 500px área superior para enemigos
  CELL_SIZE: 20     // 20px por unidad de movimiento
};

// Límites de movimiento
const BOUNDARIES = {
  PLAYER_LEFT: 20,
  PLAYER_RIGHT: 380,
  PLAYER_TOP: 500,
  PLAYER_BOTTOM: 580,
  ENEMY_TOP: 50,
  ENEMY_BOTTOM: 450
};
```

### 2. Player Ship (Nave del Jugador)
```typescript
// Estado de la nave del jugador
interface PlayerState {
  position: { x: number; y: number };
  speed: number;
  lives: number;
  isAlive: boolean;
  invulnerable: boolean;      // Invulnerabilidad temporal tras muerte
  invulnerabilityTimer: number;
  canShoot: boolean;
  shootCooldown: number;
  capturedByGalaga: boolean;  // Capturada por Galaga boss
  rescueMode: boolean;        // Modo rescate (doble nave)
}

// Configuración de la nave
const PLAYER_CONFIG = {
  SPEED: 200,           // Píxeles por segundo
  SHOOT_COOLDOWN: 250,  // Milisegundos entre disparos
  INVULNERABILITY: 2000, // 2 segundos de invulnerabilidad
  MAX_BULLETS: 2        // Máximo 2 balas simultáneas
};
```

### 3. Enemy System (Sistema de Enemigos)
```typescript
// Tipos de enemigos
enum EnemyType {
  GALAGA = 'GALAGA',     // Jefe - puede capturar nave
  GOEI = 'GOEI',         // Escolta - acompaña a Galaga
  ZAKO = 'ZAKO'          // Básico - más común
}

// Estados de enemigos
enum EnemyState {
  FORMATION = 'FORMATION',   // En formación
  DIVING = 'DIVING',         // Atacando en picada
  CAPTURED = 'CAPTURED',     // Capturado por tractor beam
  RETURNING = 'RETURNING'    // Regresando a formación
}

// Configuración de enemigos
interface EnemyConfig {
  type: EnemyType;
  health: number;
  speed: number;
  points: number;
  canCapture: boolean;       // Solo Galaga puede capturar
  divingPattern: string;     // Patrón de ataque
  shootingRate: number;      // Frecuencia de disparo
}

const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  GALAGA: {
    type: EnemyType.GALAGA,
    health: 2,
    speed: 100,
    points: 400,
    canCapture: true,
    divingPattern: 'spiral',
    shootingRate: 0.3
  },
  GOEI: {
    type: EnemyType.GOEI,
    health: 1,
    speed: 120,
    points: 160,
    canCapture: false,
    divingPattern: 'loop',
    shootingRate: 0.2
  },
  ZAKO: {
    type: EnemyType.ZAKO,
    health: 1,
    speed: 150,
    points: 50,
    canCapture: false,
    divingPattern: 'straight',
    shootingRate: 0.1
  }
};
```

### 4. Formation System (Sistema de Formaciones)
```typescript
// Configuración de formación estándar
const FORMATION_LAYOUT = {
  rows: 5,
  cols: 10,
  spacing: { x: 32, y: 24 },
  startPosition: { x: 50, y: 100 },
  
  // Distribución por tipo
  distribution: [
    { row: 0, type: EnemyType.GALAGA, count: 4 },
    { row: 1, type: EnemyType.GOEI, count: 8 },
    { row: 2, type: EnemyType.GOEI, count: 8 },
    { row: 3, type: EnemyType.ZAKO, count: 10 },
    { row: 4, type: EnemyType.ZAKO, count: 10 }
  ]
};

// Patrones de movimiento de formación
interface FormationPattern {
  name: string;
  duration: number;
  movement: (time: number) => { x: number; y: number };
}
```

### 5. Bullet System (Sistema de Proyectiles)
```typescript
// Tipos de proyectiles
enum BulletType {
  PLAYER = 'PLAYER',
  ENEMY = 'ENEMY',
  TRACTOR_BEAM = 'TRACTOR_BEAM' // Rayo tractor de Galaga
}

// Estado de proyectil
interface BulletState {
  id: string;
  type: BulletType;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  damage: number;
  owner: string; // ID del que disparó
  isActive: boolean;
}

// Configuración de proyectiles
const BULLET_CONFIG = {
  PLAYER_SPEED: 400,    // Velocidad de balas del jugador
  ENEMY_SPEED: 200,     // Velocidad de balas enemigas
  TRACTOR_SPEED: 150,   // Velocidad del rayo tractor
  MAX_DISTANCE: 650     // Distancia máxima antes de destruirse
};
```

## Game Mechanics (Mecánicas del Juego)

### 1. Capture Mechanic (Mecánica de Captura)
```typescript
// Proceso de captura único de Galaga
interface CaptureSequence {
  phase: 'TRACTOR_BEAM' | 'PULLING' | 'CAPTURED';
  progress: number;
  galagaId: string;
  playerCaptured: boolean;
}

// Mecánica de rescate
interface RescueMode {
  active: boolean;
  doubleShip: boolean;    // Jugador controla dos naves
  rescueBonus: number;    // Bonus por rescatar nave
}
```

### 2. Diving Attacks (Ataques en Picada)
```typescript
// Patrones de ataque en picada
const DIVING_PATTERNS = {
  STRAIGHT: (startPos: Position, time: number) => {
    // Ataque directo hacia abajo
    return { x: startPos.x, y: startPos.y + time * 200 };
  },
  
  LOOP: (startPos: Position, time: number) => {
    // Ataque en bucle
    const angle = time * Math.PI;
    return {
      x: startPos.x + Math.sin(angle) * 100,
      y: startPos.y + time * 150
    };
  },
  
  SPIRAL: (startPos: Position, time: number) => {
    // Ataque en espiral (Galaga)
    const angle = time * Math.PI * 2;
    const radius = 50 + time * 30;
    return {
      x: startPos.x + Math.cos(angle) * radius,
      y: startPos.y + Math.sin(angle) * radius + time * 100
    };
  }
};
```

### 3. Scoring System (Sistema de Puntuación)
```typescript
const SCORING = {
  // Puntos base por enemigo
  ZAKO: 50,
  GOEI: 160,
  GALAGA: 400,
  
  // Bonificaciones especiales
  PERFECT_STAGE: 10000,     // Eliminar todos sin perder vida
  RESCUE_BONUS: 1000,       // Rescatar nave capturada
  DIVING_BONUS: 100,        // Bonus por eliminar enemigo atacando
  FORMATION_BONUS: 500,     // Bonus por eliminar formación completa
  
  // Multiplicadores
  DOUBLE_SHIP_MULTIPLIER: 2, // Cuando tienes dos naves
  COMBO_MULTIPLIER: 1.5,     // Eliminaciones consecutivas
  
  // Vida extra
  EXTRA_LIFE: 20000          // Vida extra cada 20,000 puntos
};
```

## Controles del Juego

### Teclado (Desktop)
- **←/A:** Mover nave hacia la izquierda
- **→/D:** Mover nave hacia la derecha
- **Espacio/↑:** Disparar
- **P:** Pausar/Reanudar juego
- **R:** Reiniciar juego
- **Esc:** Volver al menú principal

### Táctil (Mobile)
- **Touch left/right:** Mover nave
- **Tap screen:** Disparar
- **Swipe left/right:** Movimiento rápido
- **Hold:** Disparo continuo (con cooldown)
- **Botones en pantalla:** Controles alternativos

## Implementación por Pasos

### Paso 1: Core Systems
1. **Crear tipos base** (`types/galaga.types.ts`)
2. **Player implementation** (`engine/Player.ts`)
   - Movimiento horizontal
   - Sistema de disparo
   - Manejo de vidas
3. **Bullet system** (`engine/Bullet.ts`)
   - Proyectiles del jugador y enemigos
   - Detección de colisiones
   - Pool de objetos para performance

### Paso 2: Enemy Foundation
1. **Enemy base class** (`engine/Enemy.ts`)
   - Estados y comportamientos básicos
   - Sistema de salud y puntuación
2. **Formation system** (`engine/Formation.ts`)
   - Posicionamiento en formación
   - Movimiento grupal
   - Selección para ataques

### Paso 3: Advanced Mechanics
1. **Diving attacks** (`data/enemyPatterns.ts`)
   - Patrones de movimiento complejos
   - Timing y coordinación
2. **Capture mechanic** (específico de Galaga)
   - Rayo tractor
   - Secuencia de captura
   - Modo de rescate

### Paso 4: Game Engine
1. **GalagaEngine** (`engine/GalagaEngine.ts`)
   - Loop principal del juego
   - Manejo de colisiones
   - Transiciones de estado
   - Sistema de oleadas

### Paso 5: React Integration
1. **Hooks development**
   - `useGalaga.ts` - Estado principal
   - `useGameLoop.ts` - Loop de animación
   - `useInput.ts` - Controles responsivos
2. **Canvas rendering** (`components/GalagaCanvas.tsx`)
   - Renderizado optimizado
   - Efectos visuales
   - Animaciones suaves

## Estilos y Diseño

### Paleta de Colores (Galaga)
```css
:root {
  /* Nave del jugador */
  --player-ship: #00ff00;         /* Verde brillante */
  --player-bullet: #ffff00;       /* Amarillo */
  
  /* Enemigos */
  --galaga-primary: #ff0000;      /* Rojo - Galaga */
  --galaga-secondary: #ffff00;    /* Amarillo - detalles */
  --goei-primary: #0080ff;        /* Azul - Goei */
  --goei-secondary: #ffffff;      /* Blanco - detalles */
  --zako-primary: #ff8000;        /* Naranja - Zako */
  --zako-secondary: #ffff80;      /* Amarillo claro */
  
  /* Proyectiles enemigos */
  --enemy-bullet: #ff4040;        /* Rojo claro */
  --tractor-beam: #00ffff;        /* Cyan - rayo tractor */
  
  /* UI y efectos */
  --space-bg: #000011;            /* Azul muy oscuro - espacio */
  --stars: #ffffff;               /* Blanco - estrellas */
  --explosion: #ffaa00;           /* Naranja - explosiones */
  --score-text: #00ff00;          /* Verde - texto de puntuación */
}
```

### Visual Effects
- **Starfield background:** Campo de estrellas en movimiento
- **Ship animations:** Propulsores y efectos de movimiento
- **Explosion effects:** Animaciones de destrucción
- **Tractor beam:** Efecto visual del rayo capturador
- **Formation movement:** Movimiento sincronizado de enemigos

### Responsive Design
- **Desktop:** Canvas 400×600px
- **Mobile:** Escala proporcional con controles táctiles
- **Tablet:** Tamaño intermedio con controles opcionales

## Advanced Features

### 1. Stage Progression
```typescript
// Configuración de niveles
interface StageConfig {
  stageNumber: number;
  enemySpeed: number;
  shootingRate: number;
  divingFrequency: number;
  specialEvents: string[];
  bonusTargets: number;
}

// Eventos especiales por nivel
const SPECIAL_EVENTS = {
  BONUS_STAGE: 'BONUS_STAGE',     // Nivel bonus sin enemigos que disparan
  FAST_ENEMIES: 'FAST_ENEMIES',   // Enemigos más rápidos
  DOUBLE_GALAGA: 'DOUBLE_GALAGA', // Dos Galagas en formación
  METEOR_SHOWER: 'METEOR_SHOWER'  // Obstáculos adicionales
};
```

### 2. Bonus Stages
- **Target practice:** Enemigos que no disparan
- **Formation flying:** Patrones especiales de vuelo
- **Perfect bonus:** Puntuación extra por no fallar disparos
- **Time bonus:** Bonificación por completar rápidamente

### 3. Power-ups (Futuro)
```typescript
enum PowerUpType {
  RAPID_FIRE = 'RAPID_FIRE',     // Disparo rápido temporal
  DOUBLE_SHOT = 'DOUBLE_SHOT',   // Disparos dobles
  SHIELD = 'SHIELD',             // Escudo temporal
  EXTRA_LIFE = 'EXTRA_LIFE'      // Vida adicional
}
```

## Performance Considerations

### Optimization Strategies
```typescript
// Object pooling para proyectiles
class BulletPool {
  private pool: Bullet[] = [];
  private active: Bullet[] = [];
  
  getBullet(): Bullet {
    return this.pool.pop() || new Bullet();
  }
  
  returnBullet(bullet: Bullet): void {
    bullet.reset();
    this.pool.push(bullet);
  }
}

// Renderizado eficiente
const renderOptimized = (ctx: CanvasRenderingContext2D) => {
  // Solo renderizar objetos visibles
  const visibleObjects = getVisibleObjects();
  visibleObjects.forEach(obj => obj.render(ctx));
};
```

### Memory Management
- **Sprite caching:** Pre-cargar todos los sprites
- **Object pooling:** Reutilizar proyectiles y efectos
- **Garbage collection:** Minimizar creación de objetos

## Testing Strategy

### Core Functionality
- **Player movement:** Límites y responsividad
- **Shooting system:** Cooldown y límites de proyectiles
- **Enemy AI:** Patrones de movimiento y ataques
- **Collision detection:** Precisión en todas las interacciones
- **Capture mechanic:** Secuencia completa de captura/rescate

### Performance Testing
- **Frame rate:** Mantener 60 FPS con muchos objetos
- **Memory usage:** Sin memory leaks en sesiones largas
- **Input lag:** Respuesta inmediata a controles

## Integration with Platform

### Navigation
- **From home:** Click en tarjeta Galaga → `/galaga`
- **Return home:** Botón "Volver" → `/`
- **Game state:** Persistir high score y progreso

### Platform Features
- **High score table:** Top 10 puntuaciones
- **Achievement system:** Logros especiales
- **Statistics:** Enemigos eliminados, niveles completados

## Success Criteria

### Minimum Viable Product (MVP)
- ✅ Nave del jugador con movimiento y disparo fluidos
- ✅ Formación de enemigos con comportamiento básico
- ✅ Sistema de ataques en picada funcional
- ✅ Mecánica de captura de Galaga (característica única)
- ✅ Sistema de puntuación y vidas
- ✅ Múltiples niveles con dificultad progresiva
- ✅ Controles responsivos (teclado + táctil)

### Enhanced Features (Nice-to-have)
- 🎯 Efectos visuales avanzados y animaciones
- 🎯 Niveles bonus y eventos especiales
- 🎯 Sistema de power-ups
- 🎯 Efectos de sonido auténticos
- 🎯 Estadísticas detalladas y logros

## Development Challenges

### Technical Complexity
1. **Formation AI:** Coordinar movimiento de múltiples enemigos
2. **Capture mechanic:** Implementar la mecánica única de Galaga
3. **Diving patterns:** Patrones de ataque complejos y fluidos
4. **Performance:** Manejar muchos objetos simultáneamente

### Unique Features
- **Tractor beam:** Mecánica de captura visual y funcional
- **Double ship:** Modo de juego con dos naves
- **Formation flight:** Movimiento coordinado de enemigos
- **Rescue bonus:** Sistema de puntuación especial

## Next Steps
1. 🔨 Crear estructura base y tipos
2. 🔨 Implementar nave del jugador y controles
3. 🔨 Desarrollar sistema de enemigos y formaciones
4. 🔨 Crear mecánica de captura única
5. 🔨 Implementar patrones de ataque
6. 🔨 Desarrollar UI y efectos visuales
7. ✅ Testing exhaustivo de mecánicas complejas
8. 🚀 Integración y optimización final 