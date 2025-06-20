import type { Position, Velocity, BulletState } from '../types/galaga.types';
import { BulletType, BULLET_CONFIG, GAME_CONFIG } from '../types/galaga.types';

export class Bullet {
  private state: BulletState;

  constructor(id: string, type: BulletType, position: Position, velocity: Velocity, owner: string) {
    this.state = {
      id,
      type,
      position: { ...position },
      velocity: { ...velocity },
      damage: 1,
      owner,
      isActive: true
    };
  }

  // Update bullet position
  update(deltaTime: number): void {
    if (!this.state.isActive) return;

    const dt = deltaTime / 1000;
    this.state.position.x += this.state.velocity.x * dt;
    this.state.position.y += this.state.velocity.y * dt;

    // Deactivate bullets that go off-screen
    if (this.state.position.y < -50 || 
        this.state.position.y > GAME_CONFIG.HEIGHT + 50 ||
        this.state.position.x < -20 ||
        this.state.position.x > GAME_CONFIG.WIDTH + 20) {
      this.state.isActive = false;
    }
  }

  // Get collision bounds
  getBounds(): { x: number; y: number; width: number; height: number } {
    const size = this.state.type === BulletType.TRACTOR_BEAM ? 8 : 4;
    return {
      x: this.state.position.x - size / 2,
      y: this.state.position.y - size / 2,
      width: size,
      height: size
    };
  }

  // Deactivate bullet
  deactivate(): void {
    this.state.isActive = false;
  }

  // Reset bullet for reuse
  reset(): void {
    this.state.isActive = false;
    this.state.position = { x: 0, y: 0 };
    this.state.velocity = { x: 0, y: 0 };
  }

  // Getters
  getState(): BulletState {
    return { ...this.state };
  }

  getPosition(): Position {
    return { ...this.state.position };
  }

  getType(): BulletType {
    return this.state.type;
  }

  getOwner(): string {
    return this.state.owner;
  }

  isActive(): boolean {
    return this.state.isActive;
  }

  getDamage(): number {
    return this.state.damage;
  }
}

// Bullet Pool for performance optimization
export class BulletPool {
  private pool: Bullet[] = [];
  private active: Bullet[] = [];
  private idCounter = 0;

  // Get bullet from pool or create new one
  getBullet(type: BulletType, position: Position, velocity: Velocity, owner: string): Bullet {
    let bullet = this.pool.pop();
    
    if (!bullet) {
      bullet = new Bullet(`bullet_${this.idCounter++}`, type, position, velocity, owner);
    } else {
      // Reuse existing bullet
      bullet['state'] = {
        id: `bullet_${this.idCounter++}`,
        type,
        position: { ...position },
        velocity: { ...velocity },
        damage: 1,
        owner,
        isActive: true
      };
    }

    this.active.push(bullet);
    return bullet;
  }

  // Return bullet to pool
  returnBullet(bullet: Bullet): void {
    const index = this.active.indexOf(bullet);
    if (index > -1) {
      this.active.splice(index, 1);
      bullet.reset();
      this.pool.push(bullet);
    }
  }

  // Update all active bullets
  updateAll(deltaTime: number): void {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const bullet = this.active[i];
      bullet.update(deltaTime);
      
      if (!bullet.isActive()) {
        this.returnBullet(bullet);
      }
    }
  }

  // Get all active bullets
  getActiveBullets(): Bullet[] {
    return [...this.active];
  }

  // Get bullets by type
  getBulletsByType(type: BulletType): Bullet[] {
    return this.active.filter(bullet => bullet.getType() === type);
  }

  // Get bullets by owner
  getBulletsByOwner(owner: string): Bullet[] {
    return this.active.filter(bullet => bullet.getOwner() === owner);
  }

  // Clear all bullets
  clearAll(): void {
    for (const bullet of this.active) {
      this.returnBullet(bullet);
    }
  }

  // Get pool statistics (for debugging)
  getStats(): { active: number; pooled: number; total: number } {
    return {
      active: this.active.length,
      pooled: this.pool.length,
      total: this.active.length + this.pool.length
    };
  }
}

// Bullet factory functions
export const createPlayerBullet = (position: Position, pool: BulletPool): Bullet => {
  return pool.getBullet(
    BulletType.PLAYER,
    position,
    { x: 0, y: -BULLET_CONFIG.PLAYER_SPEED },
    'player'
  );
};

export const createEnemyBullet = (position: Position, targetPosition: Position, pool: BulletPool, ownerId: string): Bullet => {
  // Calculate direction towards target
  const dx = targetPosition.x - position.x;
  const dy = targetPosition.y - position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const velocity = {
    x: (dx / distance) * BULLET_CONFIG.ENEMY_SPEED,
    y: (dy / distance) * BULLET_CONFIG.ENEMY_SPEED
  };

  return pool.getBullet(BulletType.ENEMY, position, velocity, ownerId);
};

export const createTractorBeam = (position: Position, pool: BulletPool, galagaId: string): Bullet => {
  return pool.getBullet(
    BulletType.TRACTOR_BEAM,
    position,
    { x: 0, y: BULLET_CONFIG.TRACTOR_SPEED },
    galagaId
  );
};