import type { Position, FormationPattern } from '../types/galaga.types';
import { EnemyType, FORMATION_LAYOUT } from '../types/galaga.types';
import { Enemy } from './Enemy';

export class Formation {
  private enemies: Enemy[] = [];
  private offset: Position = { x: 0, y: 0 };
  private movementPattern: FormationPattern | null = null;
  private patternStartTime = 0;
  private basePosition: Position;
  private movementDirection = 1; // 1 for right, -1 for left
  private movementSpeed = 30; // pixels per second

  constructor() {
    this.basePosition = { ...FORMATION_LAYOUT.startPosition };
    this.createFormation();
  }

  // Create the initial formation
  private createFormation(): void {
    let enemyId = 0;

    FORMATION_LAYOUT.distribution.forEach(({ row, type, count }) => {
      const rowY = this.basePosition.y + (row * FORMATION_LAYOUT.spacing.y);
      const startX = this.basePosition.x + 
                    ((FORMATION_LAYOUT.cols - count) / 2) * FORMATION_LAYOUT.spacing.x;

      for (let col = 0; col < count; col++) {
        const x = startX + (col * FORMATION_LAYOUT.spacing.x);
        const y = rowY;

        const enemy = new Enemy(`enemy_${enemyId++}`, type, { x, y });
        this.enemies.push(enemy);
      }
    });
  }

  // Update formation
  update(deltaTime: number, playerPosition: Position): void {
    this.updateMovement(deltaTime);
    this.updateEnemies(deltaTime, playerPosition);
    this.manageDivingAttacks();
  }

  // Update formation movement
  private updateMovement(deltaTime: number): void {
    const dt = deltaTime / 1000;

    if (this.movementPattern) {
      // Use custom movement pattern
      const elapsed = (Date.now() - this.patternStartTime) / 1000;
      if (elapsed < this.movementPattern.duration) {
        const newOffset = this.movementPattern.movement(elapsed);
        this.offset = newOffset;
      } else {
        // Pattern finished, return to normal movement
        this.movementPattern = null;
      }
    } else {
      // Standard side-to-side movement
      this.offset.x += this.movementDirection * this.movementSpeed * dt;

      // Check boundaries and reverse direction
      const leftBound = -50;
      const rightBound = 50;

      if (this.offset.x > rightBound) {
        this.movementDirection = -1;
        this.offset.x = rightBound;
        this.offset.y += 10; // Move down slightly when changing direction
      } else if (this.offset.x < leftBound) {
        this.movementDirection = 1;
        this.offset.x = leftBound;
        this.offset.y += 10;
      }
    }
  }

  // Update all enemies
  private updateEnemies(deltaTime: number, playerPosition: Position): void {
    this.enemies.forEach(enemy => {
      if (enemy.isAlive()) {
        enemy.update(deltaTime, this.offset, playerPosition);
      }
    });
  }

  // Manage diving attacks
  private manageDivingAttacks(): void {
    const formationEnemies = this.enemies.filter(e => e.isAlive() && e.isInFormation());
    
    // Randomly select enemies for diving attacks
    if (formationEnemies.length > 0 && Math.random() < 0.002) { // 0.2% chance per frame
      const randomEnemy = formationEnemies[Math.floor(Math.random() * formationEnemies.length)];
      const pattern = this.getDivingPattern(randomEnemy.getType());
      randomEnemy.startDiving(pattern);
    }
  }

  // Get diving pattern for enemy type
  private getDivingPattern(type: EnemyType): string {
    switch (type) {
      case EnemyType.GALAGA:
        return Math.random() > 0.5 ? 'spiral' : 'loop';
      case EnemyType.GOEI:
        return 'loop';
      case EnemyType.ZAKO:
        return 'straight';
      default:
        return 'straight';
    }
  }

  // Add new enemy to formation
  addEnemy(enemy: Enemy): void {
    this.enemies.push(enemy);
  }

  // Remove enemy from formation
  removeEnemy(enemyId: string): Enemy | null {
    const index = this.enemies.findIndex(e => e.getId() === enemyId);
    if (index > -1) {
      return this.enemies.splice(index, 1)[0];
    }
    return null;
  }

  // Get all enemies
  getEnemies(): Enemy[] {
    return this.enemies;
  }

  // Get alive enemies
  getAliveEnemies(): Enemy[] {
    return this.enemies.filter(e => e.isAlive());
  }

  // Get enemies in formation
  getFormationEnemies(): Enemy[] {
    return this.enemies.filter(e => e.isAlive() && e.isInFormation());
  }

  // Get diving enemies
  getDivingEnemies(): Enemy[] {
    return this.enemies.filter(e => e.isAlive() && e.isDiving());
  }

  // Get enemies by type
  getEnemiesByType(type: EnemyType): Enemy[] {
    return this.enemies.filter(e => e.isAlive() && e.getType() === type);
  }

  // Get enemy by ID
  getEnemyById(id: string): Enemy | null {
    return this.enemies.find(e => e.getId() === id) || null;
  }

  // Check if formation is empty
  isEmpty(): boolean {
    return this.getAliveEnemies().length === 0;
  }

  // Get formation completion percentage
  getCompletionPercentage(): number {
    const total = this.enemies.length;
    const remaining = this.getAliveEnemies().length;
    return ((total - remaining) / total) * 100;
  }

  // Set movement pattern
  setMovementPattern(pattern: FormationPattern): void {
    this.movementPattern = pattern;
    this.patternStartTime = Date.now();
  }

  // Clear movement pattern
  clearMovementPattern(): void {
    this.movementPattern = null;
  }

  // Reset formation to starting position
  reset(): void {
    this.offset = { x: 0, y: 0 };
    this.movementDirection = 1;
    this.movementPattern = null;
    this.enemies = [];
    this.createFormation();
  }

  // Recreate formation for new stage
  recreate(stageNumber: number): void {
    this.enemies = [];
    this.offset = { x: 0, y: 0 };
    this.movementDirection = 1;
    this.movementPattern = null;
    
    // Adjust movement speed based on stage
    this.movementSpeed = 30 + (stageNumber * 5);
    
    this.createFormation();
  }

  // Special formation patterns
  startAttackPattern(): void {
    const attackPattern: FormationPattern = {
      name: 'attack_swoop',
      duration: 3,
      movement: (time: number) => ({
        x: Math.sin(time * Math.PI) * 100,
        y: Math.sin(time * Math.PI * 0.5) * 20
      })
    };
    
    this.setMovementPattern(attackPattern);
  }

  startRetreatPattern(): void {
    const retreatPattern: FormationPattern = {
      name: 'retreat_up',
      duration: 2,
      movement: (time: number) => ({
        x: this.offset.x,
        y: this.offset.y - (time * 50)
      })
    };
    
    this.setMovementPattern(retreatPattern);
  }

  // Get formation bounds (for collision detection)
  getBounds(): { left: number; right: number; top: number; bottom: number } {
    const aliveEnemies = this.getAliveEnemies();
    if (aliveEnemies.length === 0) {
      return { left: 0, right: 0, top: 0, bottom: 0 };
    }

    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;

    aliveEnemies.forEach(enemy => {
      const pos = enemy.getPosition();
      left = Math.min(left, pos.x - 15);
      right = Math.max(right, pos.x + 15);
      top = Math.min(top, pos.y - 15);
      bottom = Math.max(bottom, pos.y + 15);
    });

    return { left, right, top, bottom };
  }

  // Force all enemies to attack (challenge mode)
  forceAllAttack(): void {
    const formationEnemies = this.getFormationEnemies();
    formationEnemies.forEach(enemy => {
      const pattern = this.getDivingPattern(enemy.getType());
      setTimeout(() => {
        if (enemy.isAlive() && enemy.isInFormation()) {
          enemy.startDiving(pattern);
        }
      }, Math.random() * 2000); // Stagger attacks over 2 seconds
    });
  }

  // Get formation statistics
  getStats(): {
    total: number;
    alive: number;
    formation: number;
    diving: number;
    byType: Record<EnemyType, number>;
  } {
    const alive = this.getAliveEnemies();
    const byType: Record<EnemyType, number> = {
      [EnemyType.GALAGA]: 0,
      [EnemyType.GOEI]: 0,
      [EnemyType.ZAKO]: 0
    };

    alive.forEach(enemy => {
      byType[enemy.getType()]++;
    });

    return {
      total: this.enemies.length,
      alive: alive.length,
      formation: this.getFormationEnemies().length,
      diving: this.getDivingEnemies().length,
      byType
    };
  }
}