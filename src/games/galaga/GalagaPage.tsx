import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGalaga } from './hooks/useGalaga';
import { GalagaCanvas } from './components/GalagaCanvas';
import { GameUI } from './components/GameUI';
import { GamePhase, GAME_CONFIG } from './types/galaga.types';
import './styles/galaga.css';

const GalagaPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, isInitialized, startGame, resetGame, getDebugInfo } = useGalaga();
  const [showDebug, setShowDebug] = useState(false);

  // Handle return to home
  const handleReturnHome = () => {
    navigate('/');
  };

  // Handle start game
  const handleStartGame = () => {
    if (gameState?.phase === GamePhase.READY) {
      startGame();
    }
  };

  // Handle restart game  
  const handleRestartGame = () => {
    resetGame();
  };

  // Toggle debug mode
  const handleToggleDebug = () => {
    setShowDebug(!showDebug);
  };

  if (!isInitialized) {
    return (
      <div className="galaga-game">
        <div className="galaga-container">
          <div className="game-area">
            <div className="loading-screen">
              <div className="loading-text">Inicializando Galaga...</div>
              <div className="loading-subtitle">Preparando naves enemigas...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="galaga-game">
      {/* Game Header */}
      <div className="game-header">
        <h1 className="game-title">🚀 GALAGA 🚀</h1>
        <button 
          className="return-button"
          onClick={handleReturnHome}
        >
          ← Volver al Menú
        </button>
      </div>

      {/* Main Game Container */}
      <div className="galaga-container">
        <div className="game-area">
          {/* Game Canvas with UI Overlay */}
          <div className="canvas-container">
            <GalagaCanvas
              gameState={gameState}
              width={GAME_CONFIG.WIDTH}
              height={GAME_CONFIG.HEIGHT}
              className="main-canvas"
            />
            
            {/* UI Overlay */}
            <div className="ui-overlay">
              <GameUI
                gameState={gameState}
                debugInfo={getDebugInfo()}
                showDebug={showDebug}
              />
            </div>
          </div>

          {/* Game Controls */}
          {gameState?.phase === GamePhase.READY && (
            <div className="start-controls">
              <button 
                className="start-button"
                onClick={handleStartGame}
              >
                🚀 INICIAR JUEGO
              </button>
            </div>
          )}

          {gameState?.phase === GamePhase.GAME_OVER && (
            <div className="game-over-controls">
              <button 
                className="restart-button"
                onClick={handleRestartGame}
              >
                🔄 JUGAR DE NUEVO
              </button>
              <button 
                className="menu-button"
                onClick={handleReturnHome}
              >
                🏠 MENÚ PRINCIPAL
              </button>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="side-panel">
          {/* Game Information */}
          <div className="info-panel">
            <h3 className="panel-title">GALAGA</h3>
            <div className="game-description">
              <p>
                Defiende la galaxia de la invasión alienígena. Dispara a las naves enemigas 
                y evita ser capturado por el rayo tractor de Galaga.
              </p>
            </div>

            <div className="enemy-guide">
              <h4>Enemigos:</h4>
              <div className="enemy-info">
                <div className="enemy-item">
                  <span className="enemy-icon galaga">🦋</span>
                  <span className="enemy-name">Galaga</span>
                  <span className="enemy-points">400 pts</span>
                </div>
                <div className="enemy-item">
                  <span className="enemy-icon goei">🚁</span>
                  <span className="enemy-name">Goei</span>
                  <span className="enemy-points">160 pts</span>
                </div>
                <div className="enemy-item">
                  <span className="enemy-icon zako">⭕</span>
                  <span className="enemy-name">Zako</span>
                  <span className="enemy-points">50 pts</span>
                </div>
              </div>
            </div>

            <div className="controls-guide">
              <h4>Controles:</h4>
              <div className="control-list">
                <div className="control-item">
                  <span className="control-key">← →</span>
                  <span className="control-action">Mover nave</span>
                </div>
                <div className="control-item">
                  <span className="control-key">ESPACIO</span>
                  <span className="control-action">Disparar</span>
                </div>
                <div className="control-item">
                  <span className="control-key">P</span>
                  <span className="control-action">Pausar</span>
                </div>
              </div>
            </div>

            <div className="special-features">
              <h4>Características Especiales:</h4>
              <ul>
                <li>🎯 Mecánica única de captura de Galaga</li>
                <li>🚀 Modo doble nave tras rescate</li>
                <li>⭐ Bonus por etapa perfecta</li>
                <li>🌀 Patrones de ataque complejos</li>
                <li>🏆 Sistema de puntuación arcade</li>
              </ul>
            </div>
          </div>

          {/* Debug Panel Toggle */}
          <div className="debug-controls">
            <button 
              className={`debug-toggle ${showDebug ? 'active' : ''}`}
              onClick={handleToggleDebug}
            >
              {showDebug ? '🔧 Ocultar Debug' : '🔧 Mostrar Debug'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="game-footer">
        <div className="credits">
          <p>🎮 Galaga Arcade Clone - Plataforma de Juegos Retro</p>
          <p>Inspirado en el clásico arcade de Namco (1981)</p>
        </div>
      </div>
    </div>
  );
};

export default GalagaPage; 