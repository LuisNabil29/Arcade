import type { Position, PlayerState } from '../types/galaga.types';
import { PLAYER_CONFIG, BOUNDARIES, GAME_CONFIG } from '../types/galaga.types';

export class Player {
  private state: PlayerState;

  constructor(startPosition: Position) {
    this.state = {
      position: { ...startPosition },
      speed: PLAYER_CONFIG.SPEED,
      lives: 3,
      isAlive: true,
      invulnerable: false,
      invulnerabilityTimer: 0,
      canShoot: true,
      shootCooldown: 0,
      capturedByGalaga: false,
      rescueMode: false
    };
  }

  // Update player state
  update(deltaTime: number): void {
    // Update invulnerability timer
    if (this.state.invulnerable) {
      this.state.invulnerabilityTimer -= deltaTime;
      if (this.state.invulnerabilityTimer <= 0) {
        this.state.invulnerable = false;
        this.state.invulnerabilityTimer = 0;
      }
    }

    // Update shoot cooldown
    if (this.state.shootCooldown > 0) {
      this.state.shootCooldown -= deltaTime;
      if (this.state.shootCooldown <= 0) {
        this.state.canShoot = true;
        this.state.shootCooldown = 0;
      }
    }
  }

  // Move player left or right
  move(direction: 'left' | 'right', deltaTime: number): void {
    if (!this.state.isAlive || this.state.capturedByGalaga) return;

    const moveDistance = this.state.speed * (deltaTime / 1000);
    
    if (direction === 'left') {
      this.state.position.x = Math.max(
        BOUNDARIES.PLAYER_LEFT,
        this.state.position.x - moveDistance
      );
    } else {
      this.state.position.x = Math.min(
        BOUNDARIES.PLAYER_RIGHT,
        this.state.position.x + moveDistance
      );
    }
  }

  // Attempt to shoot
  shoot(): boolean {
    if (!this.state.canShoot || !this.state.isAlive || this.state.capturedByGalaga) {
      return false;
    }

    this.state.canShoot = false;
    this.state.shootCooldown = PLAYER_CONFIG.SHOOT_COOLDOWN;
    return true;
  }

  // Get bullet spawn position
  getBulletSpawnPosition(): Position {
    return {
      x: this.state.position.x,
      y: this.state.position.y - 10
    };
  }

  // Take damage
  takeDamage(): boolean {
    if (this.state.invulnerable || !this.state.isAlive) return false;

    this.state.lives--;
    
    if (this.state.lives <= 0) {
      this.state.isAlive = false;
      return true; // Game over
    }

    // Temporary invulnerability
    this.state.invulnerable = true;
    this.state.invulnerabilityTimer = PLAYER_CONFIG.INVULNERABILITY;
    
    // Reset position
    this.resetPosition();
    
    return false; // Still alive
  }

  // Reset position to starting point
  resetPosition(): void {
    this.state.position = {
      x: GAME_CONFIG.WIDTH / 2,
      y: BOUNDARIES.PLAYER_BOTTOM - 20
    };
  }

  // Capture by Galaga
  captureByGalaga(): void {
    this.state.capturedByGalaga = true;
    this.state.isAlive = false;
  }

  // Rescue captured player
  rescue(): void {
    this.state.capturedByGalaga = false;
    this.state.rescueMode = true;
    this.state.isAlive = true;
    this.resetPosition();
  }

  // Enable rescue mode (double ship)
  enableRescueMode(): void {
    this.state.rescueMode = true;
  }

  // Disable rescue mode
  disableRescueMode(): void {
    this.state.rescueMode = false;
  }

  // Add extra life
  addLife(): void {
    this.state.lives++;
  }

  // Get collision bounds
  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.state.position.x - 12,
      y: this.state.position.y - 12,
      width: 24,
      height: 24
    };
  }

  // Check if player is vulnerable to damage
  isVulnerable(): boolean {
    return this.state.isAlive && !this.state.invulnerable && !this.state.capturedByGalaga;
  }

  // Get render position (for double ship mode)
  getRenderPositions(): Position[] {
    if (this.state.rescueMode) {
      return [
        { x: this.state.position.x - 15, y: this.state.position.y },
        { x: this.state.position.x + 15, y: this.state.position.y }
      ];
    }
    return [this.state.position];
  }

  // Getters
  getState(): PlayerState {
    return { ...this.state };
  }

  getPosition(): Position {
    return { ...this.state.position };
  }

  getLives(): number {
    return this.state.lives;
  }

  isAlive(): boolean {
    return this.state.isAlive;
  }

  isCaptured(): boolean {
    return this.state.capturedByGalaga;
  }

  isInRescueMode(): boolean {
    return this.state.rescueMode;
  }

  canShoot(): boolean {
    return this.state.canShoot;
  }

  isInvulnerable(): boolean {
    return this.state.invulnerable;
  }

  // Debug methods
  setPosition(position: Position): void {
    this.state.position = { ...position };
  }

  setLives(lives: number): void {
    this.state.lives = lives;
  }

  // Render helper - get visual state for drawing
  getVisualState(): {
    positions: Position[];
    isVisible: boolean;
    isBlinking: boolean;
    alpha: number;
  } {
    const isBlinking = this.state.invulnerable && 
                      Math.floor(this.state.invulnerabilityTimer / 100) % 2 === 0;
    
    return {
      positions: this.getRenderPositions(),
      isVisible: this.state.isAlive && !this.state.capturedByGalaga,
      isBlinking,
      alpha: isBlinking ? 0.5 : 1.0
    };
  }
}