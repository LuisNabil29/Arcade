import React, { useRef, useEffect, useCallback } from 'react';
import type { GameState, Position } from '../types/galaga.types';
import { BulletType, EnemyType, GamePhase } from '../types/galaga.types';

interface GalagaCanvasProps {
  gameState: GameState | null;
  width: number;
  height: number;
  className?: string;
}

export const GalagaCanvas: React.FC<GalagaCanvasProps> = ({
  gameState,
  width,
  height,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Starfield for background
  const starsRef = useRef<Position[]>([]);

  // Initialize starfield
  const initializeStars = useCallback(() => {
    const stars: Position[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height
      });
    }
    starsRef.current = stars;
  }, [width, height]);

  // Render starfield
  const renderStarfield = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffffff';
    starsRef.current.forEach(star => {
      ctx.fillRect(star.x, star.y, 1, 1);
    });
  }, []);

  // Render player ship
  const renderPlayer = useCallback((ctx: CanvasRenderingContext2D, gameState: GameState) => {
    const player = gameState.player;
    const visualState = {
      positions: player.rescueMode ? [
        { x: player.position.x - 15, y: player.position.y },
        { x: player.position.x + 15, y: player.position.y }
      ] : [player.position],
      isVisible: player.isAlive && !player.capturedByGalaga,
      isBlinking: player.invulnerable,
      alpha: player.invulnerable ? 0.5 : 1.0
    };

    if (!visualState.isVisible) return;

    ctx.save();
    ctx.globalAlpha = visualState.alpha;
    ctx.fillStyle = '#00ff00';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    visualState.positions.forEach(pos => {
      // Ship body (triangle)
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y - 12);
      ctx.lineTo(pos.x - 8, pos.y + 8);
      ctx.lineTo(pos.x + 8, pos.y + 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Thruster effects
      if (Math.random() > 0.5) {
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(pos.x - 2, pos.y + 8, 4, 6);
      }
    });

    ctx.restore();
  }, []);

  // Render enemies
  const renderEnemies = useCallback((ctx: CanvasRenderingContext2D, gameState: GameState) => {
    gameState.enemies.forEach(enemy => {
      if (!enemy.isAlive) return;

      ctx.save();
      
      // Set color based on enemy type
      switch (enemy.type) {
        case EnemyType.GALAGA:
          ctx.fillStyle = '#ff0000';
          ctx.strokeStyle = '#ffff00';
          break;
        case EnemyType.GOEI:
          ctx.fillStyle = '#0080ff';
          ctx.strokeStyle = '#ffffff';
          break;
        case EnemyType.ZAKO:
          ctx.fillStyle = '#ff8000';
          ctx.strokeStyle = '#ffff80';
          break;
      }

      ctx.lineWidth = 1;
      const size = enemy.type === EnemyType.GALAGA ? 16 : 12;

      // Enemy body (different shapes for different types)
      if (enemy.type === EnemyType.GALAGA) {
        // Galaga - distinctive butterfly shape
        ctx.beginPath();
        ctx.ellipse(enemy.position.x, enemy.position.y - 4, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(enemy.position.x, enemy.position.y + 4, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (enemy.type === EnemyType.GOEI) {
        // Goei - elongated ship
        ctx.beginPath();
        ctx.ellipse(enemy.position.x, enemy.position.y, 6, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Zako - simple circular shape
        ctx.beginPath();
        ctx.arc(enemy.position.x, enemy.position.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Add captured player indicator for Galaga
      if (enemy.type === EnemyType.GALAGA && enemy.capturedPlayer) {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(enemy.position.x - 3, enemy.position.y + 12, 6, 8);
      }

      ctx.restore();
    });
  }, []);

  // Render bullets
  const renderBullets = useCallback((ctx: CanvasRenderingContext2D, gameState: GameState) => {
    gameState.bullets.forEach(bullet => {
      if (!bullet.isActive) return;

      ctx.save();

      switch (bullet.type) {
        case BulletType.PLAYER:
          ctx.fillStyle = '#ffff00';
          ctx.fillRect(bullet.position.x - 1, bullet.position.y - 4, 2, 8);
          break;
          
        case BulletType.ENEMY:
          ctx.fillStyle = '#ff4040';
          ctx.beginPath();
          ctx.arc(bullet.position.x, bullet.position.y, 2, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case BulletType.TRACTOR_BEAM:
          // Tractor beam - special visual effect
          ctx.strokeStyle = '#00ffff';
          ctx.lineWidth = 3;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.moveTo(bullet.position.x, bullet.position.y);
          ctx.lineTo(bullet.position.x, bullet.position.y + 20);
          ctx.stroke();
          
          // Add some sparkle effects
          ctx.fillStyle = '#ffffff';
          for (let i = 0; i < 3; i++) {
            const sparkleX = bullet.position.x + (Math.random() - 0.5) * 10;
            const sparkleY = bullet.position.y + Math.random() * 20;
            ctx.fillRect(sparkleX, sparkleY, 1, 1);
          }
          break;
      }

      ctx.restore();
    });
  }, []);

  // Render capture sequence
  const renderCaptureSequence = useCallback((ctx: CanvasRenderingContext2D, gameState: GameState) => {
    if (!gameState.captureSequence) return;

    const sequence = gameState.captureSequence;
    const progress = Math.min(sequence.progress, 1);

    ctx.save();
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;

    // Find the Galaga performing the capture
    const galaga = gameState.enemies.find(e => e.id === sequence.galagaId);
    if (!galaga) return;

    // Draw tractor beam effect
    const beamWidth = 20 + progress * 10;
    const gradient = ctx.createLinearGradient(
      galaga.position.x - beamWidth/2, galaga.position.y,
      galaga.position.x + beamWidth/2, galaga.position.y + 100
    );
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0.1)');

    ctx.fillStyle = gradient;
    ctx.fillRect(
      galaga.position.x - beamWidth/2,
      galaga.position.y,
      beamWidth,
      100
    );

    // Draw beam outline
    ctx.strokeRect(
      galaga.position.x - beamWidth/2,
      galaga.position.y,
      beamWidth,
      100
    );

    ctx.restore();
  }, []);

  // Render UI overlay
  const renderUIOverlay = useCallback((ctx: CanvasRenderingContext2D, gameState: GameState) => {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';

    // Game phase overlay
    switch (gameState.phase) {
      case GamePhase.READY:
        ctx.fillStyle = '#00ff00';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('READY', width / 2, height / 2);
        ctx.font = '14px monospace';
        ctx.fillText('Press SPACE to start', width / 2, height / 2 + 30);
        break;
        
      case GamePhase.PAUSED:
        ctx.fillStyle = '#ffff00';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', width / 2, height / 2);
        ctx.font = '14px monospace';
        ctx.fillText('Press P to resume', width / 2, height / 2 + 30);
        break;
        
      case GamePhase.GAME_OVER:
        ctx.fillStyle = '#ff0000';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', width / 2, height / 2);
        ctx.font = '14px monospace';
        ctx.fillText('Press R to restart', width / 2, height / 2 + 30);
        break;
        
      case GamePhase.STAGE_CLEAR:
        ctx.fillStyle = '#00ff00';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`STAGE ${gameState.stage} CLEAR`, width / 2, height / 2);
        ctx.font = '14px monospace';
        ctx.fillText('Get ready for next stage...', width / 2, height / 2 + 30);
        break;
    }

    ctx.restore();
  }, [width, height]);

  // Main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, width, height);

    // Render starfield
    renderStarfield(ctx);

    // Render game objects
    renderPlayer(ctx, gameState);
    renderEnemies(ctx, gameState);
    renderBullets(ctx, gameState);
    renderCaptureSequence(ctx, gameState);

    // Render UI overlay
    renderUIOverlay(ctx, gameState);

  }, [gameState, width, height, renderStarfield, renderPlayer, renderEnemies, renderBullets, renderCaptureSequence, renderUIOverlay]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  // Initialize stars when canvas size changes
  useEffect(() => {
    initializeStars();
  }, [initializeStars]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`galaga-canvas ${className}`}
      style={{
        border: '2px solid #00ff00',
        backgroundColor: '#000011',
        imageRendering: 'pixelated'
      }}
    />
  );
};