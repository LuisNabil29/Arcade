import type { 
  GameState, 
  Position, 
  InputState, 
  CaptureSequence, 
  StageConfig 
} from '../types/galaga.types';
import { 
  GamePhase, 
  BulletType, 
  EnemyType, 
  GAME_CONFIG, 
  SCORING, 
  BOUNDARIES 
} from '../types/galaga.types';
import { Player } from './Player';
import { Formation } from './Formation';
import { BulletPool, createPlayerBullet, createEnemyBullet, createTractorBeam } from './Bullet';

export class GalagaEngine {
  private gameState: GameState;
  private player: Player;
  private formation: Formation;
  private bulletPool: BulletPool;
  private lastUpdateTime = 0;
  private frameCount = 0;
  private stageConfigs: StageConfig[] = [];

  constructor() {
    this.bulletPool = new BulletPool();
    this.player = new Player({
      x: GAME_CONFIG.WIDTH / 2,
      y: BOUNDARIES.PLAYER_BOTTOM - 20
    });
    this.formation = new Formation();
    
    this.gameState = this.createInitialState();
    this.createStageConfigs();
  }

  // Create initial game state
  private createInitialState(): GameState {
    return {
      phase: GamePhase.READY,
      score: 0,
      lives: 3,
      stage: 1,
      highScore: this.loadHighScore(),
      player: this.player.getState(),
      enemies: [],
      bullets: [],
      rescueMode: {
        active: false,
        doubleShip: false,
        rescueBonus: 0
      },
      stageStartTime: Date.now(),
      enemiesKilled: 0,
      perfectStage: true
    };
  }

  // Create stage configurations
  private createStageConfigs(): void {
    for (let stage = 1; stage <= 10; stage++) {
      this.stageConfigs.push({
        stageNumber: stage,
        enemySpeed: 1 + (stage * 0.1),
        shootingRate: 0.1 + (stage * 0.05),
        divingFrequency: 0.002 + (stage * 0.001),
        specialEvents: stage % 3 === 0 ? ['BONUS_STAGE'] : [],
        bonusTargets: Math.floor(stage / 2) + 1
      });
    }
  }

  // Main update method
  update(deltaTime: number, input: InputState): void {
    if (this.gameState.phase !== GamePhase.PLAYING) return;

    this.frameCount++;
    
    // Update all game systems
    this.updatePlayer(deltaTime, input);
    this.updateEnemies(deltaTime);
    this.updateBullets(deltaTime);
    
    // Handle collisions
    this.handleCollisions();
    
    // Handle capture mechanics
    this.updateCaptureSequence(deltaTime);
    
    // Check win/lose conditions
    this.checkGameConditions();
    
    // Update game state
    this.syncGameState();
  }

  // Update player
  private updatePlayer(deltaTime: number, input: InputState): void {
    // Handle input
    if (input.left) {
      this.player.move('left', deltaTime);
    }
    if (input.right) {
      this.player.move('right', deltaTime);
    }
    if (input.shoot && this.player.shoot()) {
      // Create player bullet
      const spawnPos = this.player.getBulletSpawnPosition();
      createPlayerBullet(spawnPos, this.bulletPool);
    }

    // Update player state
    this.player.update(deltaTime);
  }

  // Update enemies
  private updateEnemies(deltaTime: number): void {
    const playerPos = this.player.getPosition();
    this.formation.update(deltaTime, playerPos);

    // Handle enemy shooting
    const enemies = this.formation.getAliveEnemies();
    enemies.forEach(enemy => {
      if (enemy.canShoot()) {
        const bulletPos = enemy.getBulletSpawnPosition();
        createEnemyBullet(bulletPos, playerPos, this.bulletPool, enemy.getId());
        enemy.resetShootTimer();
      }
    });

    // Handle Galaga capture attempts
    this.handleGalagaCaptureAttempts();
  }

  // Update bullets
  private updateBullets(deltaTime: number): void {
    this.bulletPool.updateAll(deltaTime);
  }

  // Handle all collisions
  private handleCollisions(): void {
    this.handlePlayerBulletCollisions();
    this.handleEnemyBulletCollisions();
    this.handleTractorBeamCollisions();
  }

  // Handle player bullet collisions with enemies
  private handlePlayerBulletCollisions(): void {
    const playerBullets = this.bulletPool.getBulletsByType(BulletType.PLAYER);
    const enemies = this.formation.getAliveEnemies();

    playerBullets.forEach(bullet => {
      if (!bullet.isActive()) return;

      const bulletBounds = bullet.getBounds();
      
      enemies.forEach(enemy => {
        if (!enemy.isAlive()) return;

        const enemyBounds = enemy.getBounds();
        
        if (this.checkCollision(bulletBounds, enemyBounds)) {
          // Hit enemy
          bullet.deactivate();
          
          if (enemy.takeDamage(bullet.getDamage())) {
            // Enemy destroyed
            const points = enemy.getPoints();
            this.addScore(points);
            this.gameState.enemiesKilled++;

            // Special handling for Galaga with captured player
            if (enemy.getType() === EnemyType.GALAGA && enemy.hasCapturedPlayer()) {
              this.handlePlayerRescue();
            }
          }
        }
      });
    });
  }

  // Handle enemy bullet collisions with player
  private handleEnemyBulletCollisions(): void {
    const enemyBullets = this.bulletPool.getBulletsByType(BulletType.ENEMY);
    
    if (!this.player.isVulnerable()) return;

    const playerBounds = this.player.getBounds();
    
    enemyBullets.forEach(bullet => {
      if (!bullet.isActive()) return;

      const bulletBounds = bullet.getBounds();
      
      if (this.checkCollision(bulletBounds, playerBounds)) {
        bullet.deactivate();
        
        if (this.player.takeDamage()) {
          // Game over
          this.gameState.phase = GamePhase.GAME_OVER;
        } else {
          // Lost a life but still playing
          this.gameState.perfectStage = false;
        }
      }
    });
  }

  // Handle tractor beam collisions
  private handleTractorBeamCollisions(): void {
    const tractorBeams = this.bulletPool.getBulletsByType(BulletType.TRACTOR_BEAM);
    
    if (!this.player.isVulnerable()) return;

    const playerBounds = this.player.getBounds();
    
    tractorBeams.forEach(beam => {
      if (!beam.isActive()) return;

      const beamBounds = beam.getBounds();
      
      if (this.checkCollision(beamBounds, playerBounds)) {
        // Start capture sequence
        this.startCaptureSequence(beam.getOwner());
        beam.deactivate();
      }
    });
  }

  // Handle Galaga capture attempts
  private handleGalagaCaptureAttempts(): void {
    const galagas = this.formation.getEnemiesByType(EnemyType.GALAGA);
    
    galagas.forEach(galaga => {
      if (galaga.isDiving() && !galaga.hasCapturedPlayer() && Math.random() < 0.01) {
        // Attempt to deploy tractor beam
        const beamPos = galaga.getBulletSpawnPosition();
        createTractorBeam(beamPos, this.bulletPool, galaga.getId());
      }
    });
  }

  // Start capture sequence
  private startCaptureSequence(galagaId: string): void {
    this.gameState.captureSequence = {
      phase: 'TRACTOR_BEAM',
      progress: 0,
      galagaId,
      playerCaptured: false
    };
  }

  // Update capture sequence
  private updateCaptureSequence(deltaTime: number): void {
    if (!this.gameState.captureSequence) return;

    const sequence = this.gameState.captureSequence;
    sequence.progress += deltaTime / 1000; // 1 second total

    switch (sequence.phase) {
      case 'TRACTOR_BEAM':
        if (sequence.progress >= 0.5) {
          sequence.phase = 'PULLING';
          sequence.progress = 0;
        }
        break;
        
      case 'PULLING':
        if (sequence.progress >= 0.5) {
          sequence.phase = 'CAPTURED';
          sequence.playerCaptured = true;
          this.player.captureByGalaga();
          
          // Mark Galaga as having captured player
          const galaga = this.formation.getEnemyById(sequence.galagaId);
          if (galaga) {
            galaga.capturePlayer();
          }
          
          // Lose a life
          this.gameState.lives--;
          this.gameState.perfectStage = false;
          
          // Clear sequence after capture
          this.gameState.captureSequence = undefined;
        }
        break;
    }
  }

  // Handle player rescue
  private handlePlayerRescue(): void {
    if (this.player.isCaptured()) {
      this.player.rescue();
      this.addScore(SCORING.RESCUE_BONUS);
      
      this.gameState.rescueMode = {
        active: true,
        doubleShip: true,
        rescueBonus: SCORING.RESCUE_BONUS
      };
    }
  }

  // Check collision between two rectangles
  private checkCollision(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
  ): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  // Add score with multipliers
  private addScore(points: number): void {
    let finalPoints = points;
    
    // Double ship multiplier
    if (this.gameState.rescueMode.doubleShip) {
      finalPoints *= SCORING.DOUBLE_SHIP_MULTIPLIER;
    }
    
    this.gameState.score += finalPoints;
    
    // Check for extra life
    if (this.gameState.score >= this.getNextExtraLifeScore()) {
      this.player.addLife();
      this.gameState.lives++;
    }
    
    // Update high score
    if (this.gameState.score > this.gameState.highScore) {
      this.gameState.highScore = this.gameState.score;
      this.saveHighScore(this.gameState.highScore);
    }
  }

  // Get next extra life score threshold
  private getNextExtraLifeScore(): number {
    const currentLives = 3; // Starting lives
    const livesGained = this.gameState.lives - currentLives;
    return (livesGained + 1) * SCORING.EXTRA_LIFE;
  }

  // Check game conditions
  private checkGameConditions(): void {
    // Check if all enemies destroyed
    if (this.formation.isEmpty()) {
      this.completeStage();
    }
    
    // Check game over
    if (this.gameState.lives <= 0 && !this.player.isAlive()) {
      this.gameState.phase = GamePhase.GAME_OVER;
    }
  }

  // Complete current stage
  private completeStage(): void {
    // Perfect stage bonus
    if (this.gameState.perfectStage) {
      this.addScore(SCORING.PERFECT_STAGE);
    }
    
    // Formation completion bonus
    this.addScore(SCORING.FORMATION_BONUS);
    
    this.gameState.phase = GamePhase.STAGE_CLEAR;
    
    // Prepare next stage
    setTimeout(() => {
      this.startNextStage();
    }, 2000);
  }

  // Start next stage
  private startNextStage(): void {
    this.gameState.stage++;
    this.gameState.stageStartTime = Date.now();
    this.gameState.enemiesKilled = 0;
    this.gameState.perfectStage = true;
    
    // Reset formation with increased difficulty
    this.formation.recreate(this.gameState.stage);
    
    // Reset player position
    this.player.resetPosition();
    
    // Disable rescue mode for new stage
    this.gameState.rescueMode = {
      active: false,
      doubleShip: false,
      rescueBonus: 0
    };
    
    this.gameState.phase = GamePhase.PLAYING;
  }

  // Sync game state with current objects
  private syncGameState(): void {
    this.gameState.player = this.player.getState();
    this.gameState.enemies = this.formation.getAliveEnemies().map(e => e.getEntity());
    this.gameState.bullets = this.bulletPool.getActiveBullets().map(b => b.getState());
    this.gameState.lives = this.player.getLives();
  }

  // Public methods for game control
  startGame(): void {
    this.gameState.phase = GamePhase.PLAYING;
    this.gameState.stageStartTime = Date.now();
  }

  pauseGame(): void {
    if (this.gameState.phase === GamePhase.PLAYING) {
      this.gameState.phase = GamePhase.PAUSED;
    }
  }

  resumeGame(): void {
    if (this.gameState.phase === GamePhase.PAUSED) {
      this.gameState.phase = GamePhase.PLAYING;
    }
  }

  resetGame(): void {
    this.player = new Player({
      x: GAME_CONFIG.WIDTH / 2,
      y: BOUNDARIES.PLAYER_BOTTOM - 20
    });
    this.formation.reset();
    this.bulletPool.clearAll();
    this.gameState = this.createInitialState();
  }

  // Getters
  getGameState(): GameState {
    return { ...this.gameState };
  }

  getPlayer(): Player {
    return this.player;
  }

  getFormation(): Formation {
    return this.formation;
  }

  getBulletPool(): BulletPool {
    return this.bulletPool;
  }

  // High score management
  private loadHighScore(): number {
    try {
      const saved = localStorage.getItem('galaga-high-score');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  }

  private saveHighScore(score: number): void {
    try {
      localStorage.setItem('galaga-high-score', score.toString());
    } catch {
      // Ignore localStorage errors
    }
  }

  // Debug methods
  setStage(stage: number): void {
    this.gameState.stage = stage;
    this.formation.recreate(stage);
  }

  addDebugScore(points: number): void {
    this.addScore(points);
  }

  getStats(): {
    frameCount: number;
    bulletsActive: number;
    enemiesAlive: number;
    stage: number;
    score: number;
  } {
    return {
      frameCount: this.frameCount,
      bulletsActive: this.bulletPool.getActiveBullets().length,
      enemiesAlive: this.formation.getAliveEnemies().length,
      stage: this.gameState.stage,
      score: this.gameState.score
    };
  }
}