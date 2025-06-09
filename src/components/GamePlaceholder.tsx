import React from 'react';
import { Link } from 'react-router-dom';
import './GamePlaceholder.css';

interface GamePlaceholderProps {
  gameName: string;
  gameIcon: string;
  gameColor: string;
  description: string;
}

const GamePlaceholder: React.FC<GamePlaceholderProps> = ({
  gameName,
  gameIcon,
  gameColor,
  description
}) => {
  return (
    <div className="game-placeholder" style={{ '--game-color': gameColor } as React.CSSProperties}>
      <div className="placeholder-container">
        <div className="container">
          {/* Botón de regreso */}
          <div className="back-button-container">
            <Link to="/" className="btn btn-back">
              ← Regresar al Menú
            </Link>
          </div>

          {/* Contenido principal */}
          <div className="placeholder-content">
            <div className="game-icon-large">
              {gameIcon}
            </div>
            
            <h1 className="game-title-large">{gameName}</h1>
            
            <div className="coming-soon-badge">
              <span className="badge-text">Próximamente</span>
            </div>
            
            <p className="game-description-large">
              {description}
            </p>
            
            <div className="development-info">
              <h3>🚧 En Desarrollo</h3>
              <p>
                Este juego está siendo desarrollado con mucho cariño. 
                Pronto podrás disfrutar de la experiencia completa.
              </p>
              
              <div className="features-preview">
                <h4>Características que incluirá:</h4>
                <ul>
                  <li>✨ Gráficos retro auténticos</li>
                  <li>🎵 Efectos de sonido clásicos</li>
                  <li>🏆 Sistema de puntuación</li>
                  <li>📱 Compatible con móviles</li>
                  <li>⌨️ Controles personalizables</li>
                </ul>
              </div>
            </div>
            
            <div className="action-buttons">
              <Link to="/" className="btn btn-primary">
                Explorar Otros Juegos
              </Link>
            </div>
          </div>
        </div>
        
        {/* Efectos visuales de fondo */}
        <div className="placeholder-effects">
          <div className="floating-icons">
            <div className="floating-icon icon-1">{gameIcon}</div>
            <div className="floating-icon icon-2">{gameIcon}</div>
            <div className="floating-icon icon-3">{gameIcon}</div>
          </div>
          
          <div className="grid-pattern"></div>
        </div>
      </div>
    </div>
  );
};

export default GamePlaceholder; 