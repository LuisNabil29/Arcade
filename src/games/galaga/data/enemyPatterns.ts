import type { Position, FormationPattern } from '../types/galaga.types';
import { EnemyType } from '../types/galaga.types';

// Diving patterns for different enemy types
export const DIVING_PATTERNS = {
  STRAIGHT: (startPos: Position, time: number): Position => {
    // Simple straight dive down
    return {
      x: startPos.x,
      y: startPos.y + time * 200
    };
  },

  LOOP: (startPos: Position, time: number): Position => {
    // Loop pattern - common for GOEI enemies
    const angle = time * Math.PI * 2;
    const radius = 60;
    return {
      x: startPos.x + Math.sin(angle) * radius,
      y: startPos.y + time * 150 + Math.cos(angle) * 30
    };
  },

  SPIRAL: (startPos: Position, time: number): Position => {
    // Spiral pattern - special for GALAGA enemies
    const angle = time * Math.PI * 3;
    const radius = 50 + time * 40;
    return {
      x: startPos.x + Math.cos(angle) * radius,
      y: startPos.y + Math.sin(angle) * radius + time * 120
    };
  },

  ZIGZAG: (startPos: Position, time: number): Position => {
    // Zigzag pattern
    const amplitude = 80;
    const frequency = 3;
    return {
      x: startPos.x + Math.sin(time * Math.PI * frequency) * amplitude,
      y: startPos.y + time * 180
    };
  },

  CURVE_LEFT: (startPos: Position, time: number): Position => {
    // Curved dive to the left
    const curve = time * time;
    return {
      x: startPos.x - curve * 100,
      y: startPos.y + time * 200
    };
  },

  CURVE_RIGHT: (startPos: Position, time: number): Position => {
    // Curved dive to the right
    const curve = time * time;
    return {
      x: startPos.x + curve * 100,
      y: startPos.y + time * 200
    };
  },

  FIGURE_EIGHT: (startPos: Position, time: number): Position => {
    // Figure-8 pattern for advanced enemies
    const angle = time * Math.PI * 2;
    const radius = 40;
    return {
      x: startPos.x + Math.sin(angle) * radius,
      y: startPos.y + Math.sin(angle * 2) * radius + time * 100
    };
  }
};

// Formation movement patterns
export const FORMATION_PATTERNS: Record<string, FormationPattern> = {
  WAVE_MOTION: {
    name: 'wave_motion',
    duration: 4,
    movement: (time: number) => ({
      x: Math.sin(time * Math.PI) * 30,
      y: Math.sin(time * Math.PI * 0.5) * 10
    })
  },

  CIRCLE_MOTION: {
    name: 'circle_motion',
    duration: 6,
    movement: (time: number) => {
      const angle = (time / 6) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 40,
        y: Math.sin(angle) * 20
      };
    }
  },

  ATTACK_SWOOP: {
    name: 'attack_swoop',
    duration: 3,
    movement: (time: number) => ({
      x: Math.sin(time * Math.PI) * 60,
      y: time * 30
    })
  },

  RETREAT_PATTERN: {
    name: 'retreat_pattern',
    duration: 2,
    movement: (time: number) => ({
      x: 0,
      y: -time * 40
    })
  },

  DEFENSIVE_FORMATION: {
    name: 'defensive_formation',
    duration: 5,
    movement: (time: number) => ({
      x: Math.sin(time * Math.PI * 2) * 20,
      y: -Math.abs(Math.sin(time * Math.PI)) * 15
    })
  }
};

// Pattern selection based on enemy type and situation
export const getPatternForEnemyType = (type: EnemyType, situation: string = 'normal'): string => {
  switch (type) {
    case EnemyType.GALAGA:
      switch (situation) {
        case 'aggressive':
          return 'spiral';
        case 'defensive':
          return 'figure_eight';
        default:
          return Math.random() > 0.5 ? 'spiral' : 'loop';
      }
      
    case EnemyType.GOEI:
      switch (situation) {
        case 'aggressive':
          return 'loop';
        case 'defensive':
          return 'zigzag';
        default:
          return Math.random() > 0.5 ? 'loop' : 'curve_left';
      }
      
    case EnemyType.ZAKO:
      switch (situation) {
        case 'aggressive':
          return 'straight';
        case 'defensive':
          return 'zigzag';
        default:
          return Math.random() > 0.7 ? 'straight' : 'curve_right';
      }
      
    default:
      return 'straight';
  }
};

// Generate diving path from pattern
export const generateDivingPath = (
  pattern: string,
  startPosition: Position,
  duration: number = 3,
  steps: number = 30
): Position[] => {
  const path: Position[] = [];
  const patternFunction = DIVING_PATTERNS[pattern as keyof typeof DIVING_PATTERNS];
  
  if (!patternFunction) {
    // Fallback to straight pattern
    return [
      startPosition,
      { x: startPosition.x, y: startPosition.y + 400 }
    ];
  }
  
  for (let i = 0; i <= steps; i++) {
    const time = (i / steps) * duration;
    const position = patternFunction(startPosition, time);
    path.push(position);
  }
  
  return path;
};

// Advanced pattern combinations
export const COMBO_PATTERNS = {
  GALAGA_SPECIAL: (startPos: Position, time: number): Position => {
    // Galaga's signature capture approach
    if (time < 1) {
      // Initial spiral
      return DIVING_PATTERNS.SPIRAL(startPos, time);
    } else if (time < 2) {
      // Slow down and position for tractor beam
      const adjustedTime = time - 1;
      return {
        x: startPos.x + Math.sin(adjustedTime * Math.PI) * 30,
        y: startPos.y + 150 + adjustedTime * 50
      };
    } else {
      // Hold position for capture
      return {
        x: startPos.x,
        y: startPos.y + 200
      };
    }
  },

  ESCORT_FORMATION: (startPos: Position, time: number, index: number): Position => {
    // Formation diving for GOEI enemies
    const offset = (index % 2) * Math.PI;
    const angle = time * Math.PI * 2 + offset;
    return {
      x: startPos.x + Math.sin(angle) * 40,
      y: startPos.y + time * 160 + Math.cos(angle) * 20
    };
  },

  SWARM_ATTACK: (startPos: Position, time: number, enemyIndex: number): Position => {
    // Coordinated swarm attack for ZAKO enemies
    const stagger = enemyIndex * 0.2;
    const adjustedTime = Math.max(0, time - stagger);
    
    if (adjustedTime < 0.5) {
      // Wait phase
      return startPos;
    } else {
      // Attack phase
      const attackTime = adjustedTime - 0.5;
      return {
        x: startPos.x + Math.sin(attackTime * Math.PI * 4) * 20,
        y: startPos.y + attackTime * 220
      };
    }
  }
};

// Pattern difficulty scaling
export const scalePatternDifficulty = (pattern: string, stage: number): string => {
  const difficulty = Math.min(stage / 5, 2); // Max 2x difficulty at stage 10+
  
  // Return more aggressive patterns for higher stages
  if (difficulty > 1.5) {
    switch (pattern) {
      case 'straight':
        return 'zigzag';
      case 'loop':
        return 'figure_eight';
      case 'spiral':
        return 'spiral'; // Galaga keeps signature pattern
      default:
        return pattern;
    }
  } else if (difficulty > 1) {
    switch (pattern) {
      case 'straight':
        return Math.random() > 0.5 ? 'curve_left' : 'curve_right';
      default:
        return pattern;
    }
  }
  
  return pattern;
};

// Get random formation pattern
export const getRandomFormationPattern = (): FormationPattern => {
  const patterns = Object.values(FORMATION_PATTERNS);
  return patterns[Math.floor(Math.random() * patterns.length)];
};

// Check if pattern is aggressive
export const isAggressivePattern = (pattern: string): boolean => {
  return ['spiral', 'figure_eight', 'zigzag'].includes(pattern);
};

// Get pattern duration
export const getPatternDuration = (pattern: string): number => {
  switch (pattern) {
    case 'straight':
      return 2;
    case 'loop':
      return 3;
    case 'spiral':
      return 4;
    case 'zigzag':
      return 2.5;
    case 'figure_eight':
      return 5;
    default:
      return 3;
  }
};