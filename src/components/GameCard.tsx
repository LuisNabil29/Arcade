import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';

interface GameCardProps {
  title: string;
  description: string;
  route: string;
  isAvailable: boolean;
  color: string; // Color neón específico para cada juego
  icon: string; // Emoji o símbolo para representar el juego
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  route,
  isAvailable,
  color,
  icon
}) => {
  return (
    <div className={`game-card ${!isAvailable ? 'disabled' : ''}`} style={{ '--game-color': color } as React.CSSProperties}>
      <div className="game-card-inner">
        {/* Icono del juego */}
        <div className="game-icon">
          {icon}
        </div>
        
        {/* Contenido de la tarjeta */}
        <div className="game-content">
          <h3 className="game-title">{title}</h3>
          <p className="game-description">{description}</p>
        </div>
        
        {/* Botón de acción */}
        <div className="game-action">
          {isAvailable ? (
            <Link to={route} className="btn btn-game">
              Jugar
            </Link>
          ) : (
            <button className="btn btn-game disabled" disabled>
              Próximamente
            </button>
          )}
        </div>
        
        {/* Efecto de brillo en hover */}
        <div className="game-glow"></div>
      </div>
    </div>
  );
};

export default GameCard; 