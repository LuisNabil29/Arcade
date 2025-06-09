import React from 'react';
import GamePlaceholder from '../../components/GamePlaceholder';

const TetrisPage: React.FC = () => {
  return (
    <GamePlaceholder
      gameName="Tetris"
      gameIcon="🧩"
      gameColor="#00ffff"
      description="El clásico juego de bloques que caen. Organiza las piezas tetromino para completar líneas horizontales y conseguir la puntuación más alta. Un juego que nunca pasa de moda."
    />
  );
};

export default TetrisPage; 