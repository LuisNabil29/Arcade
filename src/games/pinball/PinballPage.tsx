import type { FC } from 'react';
import GamePlaceholder from '../../components/GamePlaceholder';

const PinballPage: FC = () => {
  return (
    <GamePlaceholder
      gameName="Pinball"
      gameIcon="⚡"
      gameColor="#ff8000"
      description="Mantén la pelota en juego y consigue la puntuación más alta posible. Usa los flippers para dirigir la pelota hacia objetivos especiales y activar bonificaciones."
    />
  );
};

export default PinballPage;
