import React from 'react';
import GamePlaceholder from '../../components/GamePlaceholder';

const GalagaPage: React.FC = () => {
  return (
    <GamePlaceholder
      gameName="Galaga"
      gameIcon="🚀"
      gameColor="#ff00ff"
      description="Defiende la galaxia disparando a las naves enemigas en este shooter espacial clásico. Esquiva los ataques y rescata tu nave capturada para duplicar tu poder de fuego."
    />
  );
};

export default GalagaPage;
