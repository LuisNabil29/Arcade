import React from 'react';
import GamePlaceholder from '../../components/GamePlaceholder';

const PacmanPage: React.FC = () => {
  return (
    <GamePlaceholder
      gameName="Pac-Man"
      gameIcon="👻"
      gameColor="#ffff00"
      description="Navega por el laberinto comiendo puntos y evitando a los fantasmas. Usa las píldoras de poder para convertirte en el cazador. ¡Waka-waka!"
    />
  );
};

export default PacmanPage; 