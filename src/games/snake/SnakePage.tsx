import React from 'react';
import { Link } from 'react-router-dom';
import SnakeGame from './SnakeGame';
import './styles/Snake.css';

const SnakePage: React.FC = () => {
  return (
    <div className="snake-page">
      <div className="back-button-container">
        <Link to="/" className="btn btn-back">
          ← Regresar al Menú
        </Link>
      </div>
      <SnakeGame />
    </div>
  );
};

export default SnakePage;
