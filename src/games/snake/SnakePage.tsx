import type { FC } from 'react';
import GamePlaceholder from '../../components/GamePlaceholder';

const SnakePage: FC = () => {
  return (
    <GamePlaceholder
      gameName="Viborita"
      gameIcon="🐍"
      gameColor="#00ff00"
      description="Controla la serpiente para comer y crecer sin chocar contigo mismo. Un juego simple pero adictivo que pone a prueba tus reflejos y estrategia."
    />
  );
};

export default SnakePage;
