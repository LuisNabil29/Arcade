# Tetris - Contexto Activo de Desarrollo

## 🧩 Enfoque Actual: Implementación de Tetris

### Estado Actual
- **Rama**: `feature/tetris`
- **Fase**: Preparación para desarrollo del juego completo
- **Base**: Placeholder funcional ya implementado en main

### Objetivos de Esta Rama
1. **Implementar Tetris completo** con todas las mecánicas clásicas
2. **Establecer patrones** reutilizables para otros juegos
3. **Crear game engine base** que sirva para el resto de juegos
4. **Optimizar rendimiento** para 60 FPS constantes

## 🎮 Especificaciones de Tetris

### Mecánicas Core
- **Tetrominós**: 7 piezas clásicas (I, O, T, S, Z, J, L)
- **Rotación**: Sistema de rotación con wall kicks
- **Líneas**: Detección y eliminación de líneas completas
- **Gravedad**: Caída automática con aceleración por nivel
- **Puntuación**: Sistema clásico de puntos
- **Niveles**: Incremento de velocidad progresivo

### Controles
- **Izquierda/Derecha**: Mover pieza horizontalmente
- **Abajo**: Soft drop (caída rápida)
- **Arriba**: Hard drop (caída instantánea)
- **Z/X**: Rotación izquierda/derecha
- **Espacio**: Pausa
- **R**: Reiniciar juego

### Estados del Juego
1. **Menu**: Pantalla inicial con opciones
2. **Playing**: Juego activo
3. **Paused**: Juego pausado
4. **GameOver**: Fin del juego con puntuación
5. **LineClearing**: Animación de líneas eliminadas

## 🏗️ Arquitectura Técnica

### Componentes Principales
```
TetrisGame/
├── TetrisGame.tsx          # Componente principal
├── TetrisCanvas.tsx        # Canvas de renderizado
├── TetrisUI.tsx           # HUD (puntos, nivel, siguiente pieza)
├── hooks/
│   ├── useGameLoop.ts     # Game loop principal
│   ├── useGameState.ts    # Estado del juego
│   ├── useInput.ts        # Manejo de controles
│   └── useTetris.ts       # Lógica específica de Tetris
├── engine/
│   ├── GameBoard.ts       # Tablero de juego
│   ├── Tetromino.ts       # Piezas y rotaciones
│   ├── GameLogic.ts       # Lógica de juego
│   └── Renderer.ts        # Renderizado en canvas
└── types/
    └── tetris.types.ts    # Tipos TypeScript
```

### Game Loop Architecture
```typescript
// Patrón de game loop a 60 FPS
const gameLoop = () => {
  update(deltaTime);    // Actualizar estado
  render();            // Renderizar frame
  requestAnimationFrame(gameLoop);
};
```

## 🎨 Diseño Visual

### Estética
- **Colores**: Tema cyan neón (#00ffff) como principal
- **Tetrominós**: Cada pieza con su color clásico
- **Efectos**: Glow effects, partículas al eliminar líneas
- **Animaciones**: Smooth transitions, line clear effects

### Canvas Specifications
- **Tamaño**: 400x600px (proporción 2:3)
- **Grid**: 10x20 celdas (estándar Tetris)
- **Celda**: 30x30px cada una
- **Responsive**: Escala según pantalla

## 📊 Sistema de Puntuación

### Puntos por Acción
- **Single**: 100 × nivel
- **Double**: 300 × nivel  
- **Triple**: 500 × nivel
- **Tetris**: 800 × nivel
- **Soft Drop**: 1 punto por celda
- **Hard Drop**: 2 puntos por celda

### Niveles
- **Inicio**: Nivel 1
- **Incremento**: Cada 10 líneas eliminadas
- **Velocidad**: Gravedad aumenta exponencialmente

## 🔧 Implementación Técnica

### Prioridades de Desarrollo
1. **Setup básico**: Canvas, game loop, input handling
2. **Tetrominós**: Creación, rotación, movimiento
3. **Tablero**: Detección de colisiones

4. **Líneas**: Detección y eliminación
5. **Puntuación**: Sistema de puntos y niveles
6. **UI**: HUD completo con información
7. **Audio**: Efectos de sonido (opcional)
8. **Polish**: Animaciones, efectos visuales

### Patrones a Establecer
- **Component Structure**: Separación clara de responsabilidades
- **State Management**: Hooks personalizados para estado
- **Performance**: Optimizaciones de renderizado
- **Input Handling**: Sistema robusto de controles
- **Game Logic**: Lógica separada de presentación

## 🧪 Testing Strategy

### Casos de Prueba
- **Rotaciones**: Todas las piezas en todas las posiciones
- **Wall Kicks**: Rotaciones cerca de bordes
- **Line Clearing**: 1, 2, 3, 4 líneas simultáneas
- **Game Over**: Condiciones de fin de juego
- **Performance**: 60 FPS constantes

### Debugging Tools
- **Console logs**: Estados de juego
- **Visual debugging**: Grid overlay, collision boxes
- **Performance monitoring**: FPS counter

## 🚀 Milestones

### Milestone 1: Core Mechanics (Semana 1)
- [ ] Canvas setup y game loop
- [ ] Tetrominós básicos funcionando
- [ ] Movimiento y rotación
- [ ] Detección de colisiones

### Milestone 2: Game Logic (Semana 2)  
- [ ] Eliminación de líneas
- [ ] Sistema de puntuación
- [ ] Niveles y velocidad
- [ ] Game over conditions

### Milestone 3: Polish (Semana 3)
- [ ] UI completa
- [ ] Animaciones y efectos
- [ ] Audio (opcional)
- [ ] Optimizaciones finales

## 🔄 Integration Plan

### Merge to Main
- **Criterios**: Juego completamente funcional
- **Testing**: Verificación en múltiples navegadores
- **Documentation**: Memory bank actualizado
- **Performance**: 60 FPS garantizados

### Reusable Patterns
- **Game Engine**: Base para otros juegos
- **Canvas Utils**: Funciones de renderizado
- **Input System**: Manejo de controles
- **State Patterns**: Gestión de estado de juego

## 📝 Notas de Desarrollo

### Decisiones Técnicas
- **Canvas vs DOM**: Canvas para mejor performance
- **TypeScript**: Tipado fuerte para robustez
- **Hooks**: React hooks para state management
- **60 FPS**: Target de performance no negociable

### Challenges Esperados
- **Timing**: Sincronización precisa del game loop
- **Rotations**: Sistema de wall kicks complejo
- **Performance**: Renderizado eficiente
- **Mobile**: Controles táctiles (futuro)

### Referencias
- [Tetris Guideline](https://tetris.fandom.com/wiki/Tetris_Guideline)
- [SRS Rotation System](https://tetris.fandom.com/wiki/SRS)
- [Canvas Performance](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

---

**Próximo paso**: Añadir tetrominós y lógica de colisiones
