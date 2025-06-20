import React from 'react';
import type { GameState } from '../types/galaga.types';
import { GamePhase } from '../types/galaga.types';

interface GameUIProps {
  gameState: GameState | null;
  debugInfo?: any;
  showDebug?: boolean;
}

export const GameUI: React.FC<GameUIProps> = ({ 
  gameState, 
  debugInfo = null, 
  showDebug = false 
}) => {
  if (!gameState) {
    return (
      <div className="galaga-ui loading">
        <div className="loading-text">Loading Galaga...</div>
      </div>
    );
  }

  // Format score with leading zeros
  const formatScore = (score: number): string => {
    return score.toString().padStart(6, '0');
  };

  // Format time
  const formatTime = (timestamp: number): string => {
    const elapsed = Math.floor((Date.now() - timestamp) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }; 

  return (
    <div className="galaga-ui">
      {/* Top HUD */}
      <div className="hud-top">
        <div className="score-section">
          <div className="score-label">SCORE</div>
          <div className="score-value">{formatScore(gameState.score)}</div>
        </div>

        <div className="high-score-section">
          <div className="high-score-label">HIGH SCORE</div>
          <div className="high-score-value">{formatScore(gameState.highScore)}</div>
        </div>

        <div className="stage-section">
          <div className="stage-label">STAGE</div>
          <div className="stage-value">{gameState.stage}</div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="hud-bottom">
        <div className="lives-section">
          <div className="lives-label">LIVES</div>
          <div className="lives-display">
            {Array.from({ length: Math.max(0, gameState.lives) }, (_, i) => (
              <div key={i} className="life-icon">🚀</div>
            ))}
          </div>
        </div>

        <div className="time-section">
          <div className="time-label">TIME</div>
          <div className="time-value">{formatTime(gameState.stageStartTime)}</div>
        </div>

        <div className="enemies-section">
          <div className="enemies-label">ENEMIES</div>
          <div className="enemies-value">{gameState.enemies.filter(e => e.isAlive).length}</div>
        </div>
      </div>

      {/* Special status indicators */}
      {gameState.rescueMode.active && (
        <div className="status-indicator rescue-mode">
          <div className="status-text">DOUBLE SHIP MODE</div>
          <div className="status-bonus">+{gameState.rescueMode.rescueBonus}</div>
        </div>
      )}

      {gameState.captureSequence && (
        <div className="status-indicator capture-sequence">
          <div className="status-text">PLAYER BEING CAPTURED!</div>
          <div className="capture-progress">
            <div 
              className="capture-bar"
              style={{ width: `${gameState.captureSequence.progress * 100}%` }}
            />
          </div>
        </div>
      )}

      {gameState.perfectStage && gameState.phase === GamePhase.PLAYING && (
        <div className="status-indicator perfect-stage">
          <div className="status-text">PERFECT STAGE</div>
        </div>
      )}

      {/* Game phase overlays */}
      {gameState.phase === GamePhase.READY && (
        <div className="game-overlay ready">
          <div className="overlay-title">STAGE {gameState.stage}</div>
          <div className="overlay-subtitle">GET READY!</div>
          <div className="overlay-controls">
            <div>← → Move</div>
            <div>SPACE Shoot</div>
            <div>P Pause</div>
          </div>
        </div>
      )}

      {gameState.phase === GamePhase.PAUSED && (
        <div className="game-overlay paused">
          <div className="overlay-title">PAUSED</div>
          <div className="overlay-subtitle">Press P to resume</div>
        </div>
      )}

      {gameState.phase === GamePhase.GAME_OVER && (
        <div className="game-overlay game-over">
          <div className="overlay-title">GAME OVER</div>
          <div className="overlay-stats">
            <div>Final Score: {formatScore(gameState.score)}</div>
            <div>Stage Reached: {gameState.stage}</div>
            <div>Enemies Defeated: {gameState.enemiesKilled}</div>
          </div>
          <div className="overlay-controls">
            <div>R - Restart Game</div>
            <div>ESC - Return to Menu</div>
          </div>
        </div>
      )}

      {gameState.phase === GamePhase.STAGE_CLEAR && (
        <div className="game-overlay stage-clear">
          <div className="overlay-title">STAGE {gameState.stage} CLEAR!</div>
          <div className="overlay-stats">
            <div>Enemies Defeated: {gameState.enemiesKilled}</div>
            {gameState.perfectStage && <div className="perfect-bonus">PERFECT STAGE BONUS!</div>}
          </div>
          <div className="overlay-subtitle">Preparing next stage...</div>
        </div>
      )}

      {/* Control hints */}
      <div className="control-hints">
        <div className="hint-row">
          <span className="key">←→</span>
          <span className="action">Move</span>
        </div>
        <div className="hint-row">
          <span className="key">SPACE</span>
          <span className="action">Shoot</span>
        </div>
        <div className="hint-row">
          <span className="key">P</span>
          <span className="action">Pause</span>
        </div>
      </div>

      {/* Debug information */}
      {showDebug && debugInfo && (
        <div className="debug-panel">
          <div className="debug-title">DEBUG INFO</div>
          <div className="debug-stats">
            <div>FPS: {debugInfo.fps}</div>
            <div>Frame: {debugInfo.frameCount}</div>
            <div>Bullets: {debugInfo.bulletsActive}</div>
            <div>Enemies: {debugInfo.enemiesAlive}</div>
          </div>
          <div className="debug-input">
            <div>Input State:</div>
            <div>Left: {debugInfo.inputState?.left ? 'ON' : 'OFF'}</div>
            <div>Right: {debugInfo.inputState?.right ? 'ON' : 'OFF'}</div>
            <div>Shoot: {debugInfo.inputState?.shoot ? 'ON' : 'OFF'}</div>
          </div>
        </div>
      )}
    </div>
  );
};