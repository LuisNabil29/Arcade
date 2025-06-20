import type { Position, EnemyEntity } from '../types/galaga.types';
import { EnemyType, EnemyState, ENEMY_CONFIGS, GAME_CONFIG } from '../types/galaga.types';

export class Enemy {
  private entity: EnemyEntity;
  private divingPath: Position[] = [];
  private pathIndex = 0;

  constructor(id: string, type: EnemyType, formationPosition: Position) {
    const config = ENEMY_CONFIGS[type];
    
    this.entity = {
      id,
      type,
      position: { ...formationPosition },
      velocity: { x: 0, y: 0 },
      state: EnemyState.FORMATION,
      health: config.health,
      isAlive: true,
      formationPosition: { ...formationPosition },
      shootTimer: Math.random() * 2000, // Random initial shoot timer
      capturedPlayer: false
    };
  }

  // Update enemy behavior
  update(deltaTime: number, formationOffset: Position, playerPosition: Position): void {
    if (!this.entity.isAlive) return;

    // Update shoot timer
    this.entity.shootTimer -= deltaTime;

    switch (this.entity.state) {
      case EnemyState.FORMATION:
        this.updateFormationMovement(formationOffset);
        break;
      case EnemyState.DIVING:
        this.updateDivingMovement(deltaTime);
        break;
      case EnemyState.RETURNING:
        this.updateReturningMovement(deltaTime);
        break;
      case EnemyState.CAPTURED:
        // Captured enemies don't move
        break;
    }
  }

  // Update formation movement
  private updateFormationMovement(formationOffset: Position): void {
    this.entity.position.x = this.entity.formationPosition.x + formationOffset.x;
    this.entity.position.y = this.entity.formationPosition.y + formationOffset.y;
  }

  // Update diving movement
  private updateDivingMovement(deltaTime: number): void {
    if (this.divingPath.length === 0) return;

    const dt = deltaTime / 1000;
    const config = ENEMY_CONFIGS[this.entity.type];
    
    // Move towards next point in diving path
    if (this.pathIndex < this.divingPath.length) {
      const target = this.divingPath[this.pathIndex];
      const dx = target.x - this.entity.position.x;
      const dy = target.y - this.entity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Reached waypoint, move to next
        this.pathIndex++;
        if (this.pathIndex >= this.divingPath.length) {
          // Finished diving, start returning
          this.startReturning();
        }
      } else {
        // Move towards waypoint
        this.entity.velocity.x = (dx / distance) * config.speed;
        this.entity.velocity.y = (dy / distance) * config.speed;
        
        this.entity.position.x += this.entity.velocity.x * dt;
        this.entity.position.y += this.entity.velocity.y * dt;
      }
    }

    // Check if enemy went off-screen
    if (this.entity.position.y > GAME_CONFIG.HEIGHT + 50) {
      this.startReturning();
    }
  }

  // Update returning to formation
  private updateReturningMovement(deltaTime: number): void {
    const dt = deltaTime / 1000;
    const config = ENEMY_CONFIGS[this.entity.type];
    
    const dx = this.entity.formationPosition.x - this.entity.position.x;
    const dy = this.entity.formationPosition.y - this.entity.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 10) {
      // Back in formation
      this.entity.state = EnemyState.FORMATION;
      this.entity.velocity = { x: 0, y: 0 };
    } else {
      // Move towards formation position
      this.entity.velocity.x = (dx / distance) * config.speed;
      this.entity.velocity.y = (dy / distance) * config.speed;
      
      this.entity.position.x += this.entity.velocity.x * dt;
      this.entity.position.y += this.entity.velocity.y * dt;
    }
  }

  // Start diving attack
  startDiving(pattern: string): void {
    if (this.entity.state !== EnemyState.FORMATION) return;

    this.entity.state = EnemyState.DIVING;
    this.entity.divingStartTime = Date.now();
    this.divingPath = this.generateDivingPath(pattern);
    this.pathIndex = 0;
  }

  // Generate diving path based on pattern
  private generateDivingPath(pattern: string): Position[] {
    const path: Position[] = [];
    const startPos = { ...this.entity.position };

    switch (pattern) {
      case 'straight':
        // Straight dive down
        path.push({ x: startPos.x, y: GAME_CONFIG.HEIGHT + 50 });
        break;

      case 'loop':
        // Loop pattern
        for (let i = 0; i <= 10; i++) {
          const t = i / 10;
          const angle = t * Math.PI * 2;
          path.push({
            x: startPos.x + Math.sin(angle) * 80,
            y: startPos.y + t * 200 + Math.cos(angle) * 40
          });
        }
        break;

      case 'spiral':
        // Spiral pattern (Galaga special)
        for (let i = 0; i <= 15; i++) {
          const t = i / 15;
          const angle = t * Math.PI * 4;
          const radius = 60 + t * 40;
          path.push({
            x: startPos.x + Math.cos(angle) * radius,
            y: startPos.y + Math.sin(angle) * radius + t * 150
          });
        }
        break;

      default:
        path.push({ x: startPos.x, y: GAME_CONFIG.HEIGHT + 50 });
    }

    return path;
  }

  // Start returning to formation
  private startReturning(): void {
    this.entity.state = EnemyState.RETURNING;
    this.divingPath = [];
    this.pathIndex = 0;
  }

  // Take damage
  takeDamage(damage: number): boolean {
    if (!this.entity.isAlive) return false;

    this.entity.health -= damage;
    
    if (this.entity.health <= 0) {
      this.entity.isAlive = false;
      return true; // Enemy destroyed
    }

    return false; // Still alive
  }

  // Check if enemy can shoot
  canShoot(): boolean {
    const config = ENEMY_CONFIGS[this.entity.type];
    return this.entity.isAlive && 
           this.entity.shootTimer <= 0 && 
           Math.random() < config.shootingRate;
  }

  // Reset shoot timer
  resetShootTimer(): void {
    const config = ENEMY_CONFIGS[this.entity.type];
    // Random interval based on shooting rate
    this.entity.shootTimer = (Math.random() * 2000) + (1000 / config.shootingRate);
  }

  // Get bullet spawn position
  getBulletSpawnPosition(): Position {
    return {
      x: this.entity.position.x,
      y: this.entity.position.y + 10
    };
  }

  // Get collision bounds
  getBounds(): { x: number; y: number; width: number; height: number } {
    const size = this.entity.type === EnemyType.GALAGA ? 20 : 16;
    return {
      x: this.entity.position.x - size / 2,
      y: this.entity.position.y - size / 2,
      width: size,
      height: size
    };
  }

  // Capture player (Galaga only)
  capturePlayer(): boolean {
    if (this.entity.type !== EnemyType.GALAGA || !this.entity.isAlive) return false;
    
    this.entity.capturedPlayer = true;
    return true;
  }

  // Release captured player
  releasePlayer(): void {
    this.entity.capturedPlayer = false;
  }

  // Check if in formation
  isInFormation(): boolean {
    return this.entity.state === EnemyState.FORMATION;
  }

  // Check if diving
  isDiving(): boolean {
    return this.entity.state === EnemyState.DIVING;
  }

  // Get points value
  getPoints(): number {
    const config = ENEMY_CONFIGS[this.entity.type];
    let points = config.points;
    
    // Bonus for diving enemies
    if (this.entity.state === EnemyState.DIVING) {
      points += 100;
    }

    return points;
  }

  // Getters
  getEntity(): EnemyEntity {
    return { ...this.entity };
  }

  getId(): string {
    return this.entity.id;
  }

  getType(): EnemyType {
    return this.entity.type;
  }

  getPosition(): Position {
    return { ...this.entity.position };
  }

  getState(): EnemyState {
    return this.entity.state;
  }

  isAlive(): boolean {
    return this.entity.isAlive;
  }

     hasCapturedPlayer(): boolean {
     return this.entity.capturedPlayer || false;
   }

  canCapture(): boolean {
    return ENEMY_CONFIGS[this.entity.type].canCapture;
  }

  // Set formation position (for dynamic formations)
  setFormationPosition(position: Position): void {
    this.entity.formationPosition = { ...position };
  }

  // Debug method
  setPosition(position: Position): void {
    this.entity.position = { ...position };
  }
}