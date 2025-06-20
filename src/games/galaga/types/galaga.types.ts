// Galaga Game Types

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// Game Configuration
export const GAME_CONFIG = {
  WIDTH: 400,
  HEIGHT: 600,
  PLAYER_AREA: 100,
  ENEMY_AREA: 500,
  CELL_SIZE: 20,
} as const;

export const BOUNDARIES = {
  PLAYER_LEFT: 20,
  PLAYER_RIGHT: 380,
  PLAYER_TOP: 500,
  PLAYER_BOTTOM: 580,
  ENEMY_TOP: 50,
  ENEMY_BOTTOM: 450,
} as const;

// Player Configuration
export interface PlayerState {
  position: Position;
  speed: number;
  lives: number;
  isAlive: boolean;
  invulnerable: boolean;
  invulnerabilityTimer: number;
  canShoot: boolean;
  shootCooldown: number;
  capturedByGalaga: boolean;
  rescueMode: boolean;
}

export const PLAYER_CONFIG = {
  SPEED: 200,
  SHOOT_COOLDOWN: 250,
  INVULNERABILITY: 2000,
  MAX_BULLETS: 2,
} as const;

// Enemy Types and States
export enum EnemyType {
  GALAGA = 'GALAGA',
  GOEI = 'GOEI',
  ZAKO = 'ZAKO'
}

export enum EnemyState {
  FORMATION = 'FORMATION',
  DIVING = 'DIVING',
  CAPTURED = 'CAPTURED',
  RETURNING = 'RETURNING'
}

export interface EnemyConfig {
  type: EnemyType;
  health: number;
  speed: number;
  points: number;
  canCapture: boolean;
  divingPattern: string;
  shootingRate: number;
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
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

export interface EnemyEntity {
  id: string;
  type: EnemyType;
  position: Position;
  velocity: Velocity;
  state: EnemyState;
  health: number;
  isAlive: boolean;
  formationPosition: Position;
  divingStartTime?: number;
  shootTimer: number;
  capturedPlayer?: boolean;
}

// Formation System
export const FORMATION_LAYOUT = {
  rows: 5,
  cols: 10,
  spacing: { x: 32, y: 24 },
  startPosition: { x: 50, y: 100 },
  distribution: [
    { row: 0, type: EnemyType.GALAGA, count: 4 },
    { row: 1, type: EnemyType.GOEI, count: 8 },
    { row: 2, type: EnemyType.GOEI, count: 8 },
    { row: 3, type: EnemyType.ZAKO, count: 10 },
    { row: 4, type: EnemyType.ZAKO, count: 10 }
  ]
} as const;

export interface FormationPattern {
  name: string;
  duration: number;
  movement: (time: number) => Position;
}

// Bullet System
export enum BulletType {
  PLAYER = 'PLAYER',
  ENEMY = 'ENEMY',
  TRACTOR_BEAM = 'TRACTOR_BEAM'
}

export interface BulletState {
  id: string;
  type: BulletType;
  position: Position;
  velocity: Velocity;
  damage: number;
  owner: string;
  isActive: boolean;
}

export const BULLET_CONFIG = {
  PLAYER_SPEED: 400,
  ENEMY_SPEED: 200,
  TRACTOR_SPEED: 150,
  MAX_DISTANCE: 650
} as const;

// Capture Mechanics
export interface CaptureSequence {
  phase: 'TRACTOR_BEAM' | 'PULLING' | 'CAPTURED';
  progress: number;
  galagaId: string;
  playerCaptured: boolean;
}

export interface RescueMode {
  active: boolean;
  doubleShip: boolean;
  rescueBonus: number;
}

// Game State
export enum GamePhase {
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  STAGE_CLEAR = 'STAGE_CLEAR'
}

export interface GameState {
  phase: GamePhase;
  score: number;
  lives: number;
  stage: number;
  highScore: number;
  player: PlayerState;
  enemies: EnemyEntity[];
  bullets: BulletState[];
  captureSequence?: CaptureSequence;
  rescueMode: RescueMode;
  stageStartTime: number;
  enemiesKilled: number;
  perfectStage: boolean;
}

// Scoring System
export const SCORING = {
  ZAKO: 50,
  GOEI: 160,
  GALAGA: 400,
  PERFECT_STAGE: 10000,
  RESCUE_BONUS: 1000,
  DIVING_BONUS: 100,
  FORMATION_BONUS: 500,
  DOUBLE_SHIP_MULTIPLIER: 2,
  COMBO_MULTIPLIER: 1.5,
  EXTRA_LIFE: 20000
} as const;

// Input Types
export interface InputState {
  left: boolean;
  right: boolean;
  shoot: boolean;
  pause: boolean;
  restart: boolean;
}

// Stage Configuration
export interface StageConfig {
  stageNumber: number;
  enemySpeed: number;
  shootingRate: number;
  divingFrequency: number;
  specialEvents: string[];
  bonusTargets: number;
}

// Power-ups (for future implementation)
export enum PowerUpType {
  RAPID_FIRE = 'RAPID_FIRE',
  DOUBLE_SHOT = 'DOUBLE_SHOT',
  SHIELD = 'SHIELD',
  EXTRA_LIFE = 'EXTRA_LIFE'
}

export interface PowerUpState {
  type: PowerUpType;
  position: Position;
  isActive: boolean;
  duration: number;
}