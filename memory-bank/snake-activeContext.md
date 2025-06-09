# Snake (Viborita) - Contexto Activo de Desarrollo

## 🐍 Enfoque Actual: Implementación de Snake

### Estado Actual
- **Rama**: `feature/snake`
- **Fase**: Preparación para desarrollo del juego completo
- **Base**: Placeholder funcional ya implementado en main
- **Prioridad**: Segundo juego después de Tetris

### Objetivos de Esta Rama
1. **Implementar Snake completo** con mecánicas clásicas
2. **Reutilizar patrones** establecidos en Tetris
3. **Optimizar game engine** para juegos de grid
4. **Establecer controles fluidos** para movimiento continuo

## 🎮 Especificaciones de Snake

### Mecánicas Core
- **Serpiente**: Cuerpo que crece al comer comida
- **Movimiento**: Continuo en 4 direcciones (arriba, abajo, izquierda, derecha)
- **Comida**: Aparece aleatoriamente en el grid
- **Crecimiento**: La serpiente crece al comer
- **Colisiones**: Muerte al chocar con paredes o consigo misma
- **Puntuación**: Puntos por cada comida consumida

### Controles
- **Flechas/WASD**: Cambiar dirección de movimiento
- **Espacio**: Pausa/Resume
- **R**: Reiniciar juego
- **+/-**: Aumentar/Disminuir velocidad (modo debug)

### Estados del Juego
1. **Menu**: Pantalla inicial con opciones de velocidad
2. **Playing**: Juego activo con movimiento continuo
3. **Paused**: Juego pausado
4. **GameOver**: Fin del juego con puntuación final
5. **HighScore**: Nueva puntuación máxima

## 🏗️ Arquitectura Técnica

### Componentes Principales
```
SnakeGame/
├── SnakeGame.tsx           # Componente principal
├── SnakeCanvas.tsx         # Canvas de renderizado
├── SnakeUI.tsx            # HUD (puntos, velocidad, high score)
├── hooks/
│   ├── useGameLoop.ts     # Game loop reutilizado de Tetris
│   ├── useSnakeState.ts   # Estado específico de Snake
│   ├── useInput.ts        # Input handling reutilizado
│   └── useSnakeLogic.ts   # Lógica específica de Snake
├── engine/
│   ├── SnakeBoard.ts      # Grid de juego
│   ├── Snake.ts           # Serpiente y movimiento
│   ├── Food.ts            # Sistema de comida
│   ├── GameLogic.ts       # Lógica de juego
│   └── Renderer.ts        # Renderizado reutilizado
└── types/
    └── snake.types.ts     # Tipos TypeScript
```

### Game Loop Architecture
```typescript
// Patrón de game loop continuo
const snakeGameLoop = () => {
  updateSnakePosition(deltaTime);
  checkCollisions();
  checkFoodConsumption();
  updateScore();
  render();
  requestAnimationFrame(snakeGameLoop);
};
```

## 🎨 Diseño Visual

### Estética
- **Colores**: Tema verde neón (#00ff00) como principal
- **Serpiente**: Gradiente verde con cabeza destacada
- **Comida**: Rojo brillante (#ff0000) con efecto pulsante
- **Grid**: Líneas sutiles para guía visual
- **Efectos**: Trail effects, food consumption particles

### Canvas Specifications
- **Tamaño**: 600x600px (cuadrado perfecto)
- **Grid**: 30x30 celdas (20px cada una)
- **Responsive**: Escala manteniendo proporción cuadrada
- **Smooth movement**: Interpolación entre celdas

## 📊 Sistema de Puntuación

### Puntos por Acción
- **Comida básica**: 10 puntos
- **Comida especial**: 50 puntos (aparece ocasionalmente)
- **Bonus velocidad**: +1 punto por nivel de velocidad
- **Bonus longitud**: +1 punto por cada segmento de la serpiente

### Niveles de Velocidad
- **Lento**: 200ms por movimiento
- **Normal**: 150ms por movimiento
- **Rápido**: 100ms por movimiento
- **Extremo**: 50ms por movimiento

## 🔧 Implementación Técnica

### Prioridades de Desarrollo
1. **Setup básico**: Canvas, grid, game loop
2. **Serpiente**: Movimiento básico y crecimiento
3. **Comida**: Generación aleatoria y consumo
4. **Colisiones**: Paredes y auto-colisión
5. **Puntuación**: Sistema de puntos y high scores
6. **UI**: HUD completo con información
7. **Effects**: Animaciones y efectos visuales
8. **Polish**: Optimizaciones y mejoras

### Patrones Reutilizables de Tetris
- **Game Loop**: Mismo patrón de requestAnimationFrame
- **Input System**: Adaptado para movimiento direccional
- **Canvas Renderer**: Base reutilizable con adaptaciones
- **State Management**: Hooks pattern similar
- **Performance**: Mismas optimizaciones

## 🧪 Testing Strategy

### Casos de Prueba
- **Movimiento**: Todas las direcciones y cambios
- **Crecimiento**: Serpiente crece correctamente
- **Colisiones**: Paredes y auto-colisión
- **Comida**: Generación y consumo
- **Puntuación**: Cálculos correctos
- **Performance**: Movimiento fluido a todas las velocidades

### Debugging Tools
- **Grid overlay**: Visualización del grid
- **Snake segments**: Numeración de segmentos
- **Collision boxes**: Áreas de colisión visibles
- **Performance monitor**: FPS y timing

## 🚀 Milestones

### Milestone 1: Core Setup (Semana 1)
- [ ] Canvas setup y grid system
- [ ] Game loop adaptado de Tetris
- [ ] Input handling para direcciones
- [ ] Estructura de componentes básica

### Milestone 2: Snake Mechanics (Semana 2)
- [ ] Serpiente básica con movimiento
- [ ] Sistema de crecimiento
- [ ] Detección de colisiones
- [ ] Generación de comida

### Milestone 3: Game Logic (Semana 3)
- [ ] Sistema de puntuación
- [ ] Niveles de velocidad
- [ ] High scores locales
- [ ] Game over conditions

### Milestone 4: Polish & Effects (Semana 4)
- [ ] Efectos visuales y animaciones
- [ ] Smooth movement entre celdas
- [ ] Comida especial ocasional
- [ ] UI completa y atractiva

## 🎯 Características Únicas de Snake

### Diferencias con Tetris
- **Movimiento continuo** vs. movimiento por turnos
- **Grid dinámico** vs. grid estático
- **Crecimiento orgánico** vs. piezas predefinidas
- **Colisión consigo mismo** vs. colisión con objetos

### Innovaciones Planeadas
- **Smooth movement**: Interpolación entre celdas
- **Trail effects**: Estela visual de la serpiente
- **Food variety**: Diferentes tipos de comida
- **Speed ramping**: Aceleración gradual automática

## 🔄 Integration Plan

### Reutilización de Tetris
- **Game Engine Base**: Adaptar para grid-based games
- **Canvas Utils**: Funciones de renderizado
- **Input System**: Modificar para movimiento continuo
- **Performance Patterns**: Aplicar optimizaciones

### Merge to Main
- **Criterios**: Juego completamente funcional
- **Testing**: Verificación en múltiples navegadores
- **Performance**: 60 FPS constantes
- **Documentation**: Memory bank actualizado

## 📝 Notas de Desarrollo

### Decisiones Técnicas
- **Movimiento**: Interpolación suave entre celdas
- **Timing**: Sistema de timing independiente del framerate
- **Food generation**: Algoritmo de posicionamiento inteligente
- **Collision**: Detección eficiente en grid

### Challenges Esperados
- **Smooth movement**: Interpolación fluida sin lag
- **Input buffering**: Manejar inputs rápidos
- **Self-collision**: Detección precisa de auto-colisión
- **Performance**: Mantener 60 FPS con serpiente larga

### Referencias
- [Snake Game Mechanics](https://en.wikipedia.org/wiki/Snake_(video_game_genre))
- [Grid-based Movement](https://gamedev.stackexchange.com/questions/tagged/grid)
- [Canvas Animation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations)

---

**Próximo paso**: Desarrollar mecánicas avanzadas como colisiones y puntuación
