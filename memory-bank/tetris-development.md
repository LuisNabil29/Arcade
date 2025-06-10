# Memory Bank: Tetris Game Development

## Objetivo Principal
Implementar el juego Tetris completo y funcional, integrándolo con la plataforma Arcade existente.

## Estado Actual
- ✅ Base de la plataforma implementada (Fase 1 completada)
- ✅ Placeholder de Tetris existente en `/src/games/tetris/TetrisPage.tsx`
- 🎯 **OBJETIVO:** Reemplazar placeholder con juego funcional

## Arquitectura del Juego Tetris

### Estructura de Archivos Requerida
```
src/games/tetris/
├── TetrisPage.tsx          # ✅ Existe - Página principal del juego
├── engine/
│   ├── TetrisEngine.ts     # 🔨 CREAR - Lógica principal del juego
│   ├── Tetromino.ts        # 🔨 CREAR - Definición de piezas
│   ├── Board.ts            # 🔨 CREAR - Tablero de juego
│   └── GameState.ts        # 🔨 CREAR - Estado del juego
├── hooks/
│   ├── useTetris.ts        # 🔨 CREAR - Hook principal del juego
│   ├── useGameLoop.ts      # 🔨 CREAR - Loop de animación
│   └── useInput.ts         # 🔨 CREAR - Manejo de controles
├── components/
│   ├── TetrisCanvas.tsx    # 🔨 CREAR - Canvas de renderizado
│   ├── GameUI.tsx          # 🔨 CREAR - UI del juego (score, next piece)
│   ├── Controls.tsx        # 🔨 CREAR - Controles en pantalla
│   └── GameOver.tsx        # 🔨 CREAR - Pantalla de game over
├── styles/
│   ├── tetris.css          # 🔨 CREAR - Estilos específicos
│   └── animations.css      # 🔨 CREAR - Animaciones del juego
└── types/
    └── tetris.types.ts     # 🔨 CREAR - Tipos TypeScript
```

## Especificaciones Técnicas

### 1. Tetromino Pieces (Piezas)
```typescript
// Tipos de piezas estándar
enum TetrominoType {
  I = 'I', // Línea
  O = 'O', // Cuadrado
  T = 'T', // T
  S = 'S', // S
  Z = 'Z', // Z
  J = 'J', // J
  L = 'L'  // L
}

// Cada pieza tiene 4 rotaciones posibles
// Representación en matriz 4x4
```

### 2. Game Board (Tablero)
- **Dimensiones:** 10 columnas × 20 filas (estándar Tetris)
- **Representación:** Matriz 2D con estados de celda
- **Detección de líneas:** Verificar filas completas
- **Limpieza:** Eliminar líneas y colapsar tablero

### 3. Game Mechanics (Mecánicas)
- **Caída automática:** Piezas caen cada X milisegundos
- **Rotación:** 4 estados de rotación por pieza
- **Movimiento lateral:** Izquierda/derecha con validación
- **Caída rápida:** Acelerar caída con tecla
- **Colocación:** Fijar pieza cuando toca fondo/otra pieza

### 4. Scoring System (Puntuación)
```typescript
// Sistema de puntuación estándar
const POINTS = {
  SINGLE: 100,    // 1 línea
  DOUBLE: 300,    // 2 líneas
  TRIPLE: 500,    // 3 líneas
  TETRIS: 800,    // 4 líneas (Tetris!)
  SOFT_DROP: 1,   // Por celda de caída rápida
  HARD_DROP: 2    // Por celda de caída instantánea
};

// Niveles: Aumenta velocidad cada 10 líneas
// Velocidad: Reduce tiempo de caída automática
```

## Controles del Juego

### Teclado (Desktop)
- **←/→:** Mover pieza izquierda/derecha
- **↓:** Caída rápida (soft drop)
- **↑/Espacio:** Rotar pieza
- **Shift:** Caída instantánea (hard drop)
- **P:** Pausar juego
- **R:** Reiniciar juego

### Táctil (Mobile)
- **Swipe izq/der:** Mover pieza
- **Swipe abajo:** Caída rápida
- **Tap:** Rotar pieza
- **Botones en pantalla:** Controles alternativos

## Implementación por Pasos

### Paso 1: Estructura Base
1. **Crear tipos TypeScript** (`types/tetris.types.ts`)
2. **Implementar Tetromino** (`engine/Tetromino.ts`)
3. **Crear Board** (`engine/Board.ts`)
4. **Setup GameState** (`engine/GameState.ts`)

### Paso 2: Engine Principal
1. **TetrisEngine** (`engine/TetrisEngine.ts`)
   - Lógica principal del juego
   - Manejo de estado
   - Validaciones de movimiento
   - Detección de colisiones

### Paso 3: Hooks de React
1. **useTetris** (`hooks/useTetris.ts`)
   - Hook principal que conecta engine con UI
   - Estado del juego en React
2. **useGameLoop** (`hooks/useGameLoop.ts`)
   - Loop de animación con requestAnimationFrame
   - Control de velocidad de caída
3. **useInput** (`hooks/useInput.ts`)
   - Manejo de eventos de teclado/táctil
   - Prevención de spam de teclas

### Paso 4: Componentes UI
1. **TetrisCanvas** (`components/TetrisCanvas.tsx`)
   - Renderizado del tablero y piezas
   - Canvas HTML5 con optimizaciones
2. **GameUI** (`components/GameUI.tsx`)
   - Score, nivel, líneas, próxima pieza
   - Información del juego
3. **Controls** (`components/Controls.tsx`)
   - Controles táctiles para móvil
   - Botones de acción

### Paso 5: Integración con Plataforma
1. **Actualizar TetrisPage.tsx**
   - Reemplazar placeholder con juego real
   - Mantener navegación a página principal
2. **Actualizar navegación principal**
   - Verificar que el enlace funcione correctamente
   - Asegurar que el juego se carga sin errores

## Estilos y Diseño

### Paleta de Colores (Tetris)
```css
:root {
  /* Colores de piezas estándar */
  --tetris-i: #00f0f0; /* Cyan - I piece */
  --tetris-o: #f0f000; /* Yellow - O piece */
  --tetris-t: #a000f0; /* Purple - T piece */
  --tetris-s: #00f000; /* Green - S piece */
  --tetris-z: #f00000; /* Red - Z piece */
  --tetris-j: #0000f0; /* Blue - J piece */
  --tetris-l: #f0a000; /* Orange - L piece */
  
  /* UI Colors */
  --tetris-bg: #1a1a2e;
  --tetris-grid: #16213e;
  --tetris-border: #0f3460;
}
```

### Animaciones
- **Línea completada:** Flash y desvanecimiento
- **Pieza colocada:** Efecto de impacto sutil
- **Game Over:** Animación de caída del tablero
- **Rotación:** Transición suave de rotación

## Testing y Validación

### Casos de Prueba Críticos
1. **Rotación en bordes:** Piezas no deben salir del tablero
2. **Detección de colisiones:** Correcta en todos los escenarios
3. **Limpieza de líneas:** Múltiples líneas simultáneas
4. **Game Over:** Cuando pieza no puede aparecer
5. **Controles:** Responsivos y sin lag

### Performance Targets
- **60 FPS:** Renderizado suave
- **< 16ms:** Tiempo de frame
- **Responsive:** Funciona en móviles de gama baja

## Integración con Plataforma

### Modificaciones Requeridas en Página Principal
1. **Verificar enlace:** `/tetris` debe funcionar
2. **Estado del juego:** Indicar que Tetris está disponible
3. **Actualizar GameCard:** Cambiar de placeholder a "¡Jugar!"

### Navegación
- **Desde Home:** Click en tarjeta Tetris → `/tetris`
- **Desde Tetris:** Botón "Volver" → `/` (home)
- **Estado persistente:** Mantener high score

## Criterios de Éxito

### Funcionalidad Mínima Viable (MVP)
- ✅ Juego completamente jugable
- ✅ Todas las piezas implementadas
- ✅ Sistema de puntuación funcional
- ✅ Controles responsivos (teclado + táctil)
- ✅ Game Over y reinicio
- ✅ Integración con plataforma

### Características Avanzadas (Nice-to-have)
- 🎯 Efectos de sonido
- 🎯 Animaciones avanzadas
- 🎯 Persistencia de high score
- 🎯 Diferentes niveles de dificultad
- 🎯 Modo fantasma (preview de caída)

## Notas de Desarrollo

### Patrones a Seguir
- **Hooks personalizados:** Para lógica reutilizable
- **Separación de responsabilidades:** Engine vs UI
- **TypeScript estricto:** Tipos para todo
- **Performance first:** Optimizaciones desde el inicio

### Consideraciones Especiales
- **Mobile-first:** Diseño responsive desde el inicio
- **Accesibilidad:** Controles alternativos
- **Browser compatibility:** Funciona en todos los navegadores modernos
- **Bundle size:** Mantener tamaño optimizado

## Próximos Pasos Inmediatos
1. 🔨 Crear estructura de archivos
2. 🔨 Implementar tipos TypeScript
3. 🔨 Desarrollar engine básico
4. 🔨 Crear componentes UI
5. 🔨 Integrar con plataforma
6. ✅ Testing y pulido
7. 🚀 Deploy y documentación 