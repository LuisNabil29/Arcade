import type { FC } from 'react';
import GameCard from './GameCard';
import './GameGrid.css';

// Datos de los juegos
const gamesData = [
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'El clásico juego de bloques que caen. Organiza las piezas para completar líneas.',
    route: '/tetris',
    isAvailable: false, // Por ahora todos son placeholders
    color: '#00ffff', // Cyan neón
    icon: '🧩'
  },
  {
    id: 'snake',
    title: 'Viborita',
    description: 'Controla la serpiente para comer y crecer sin chocar contigo mismo.',
    route: '/snake',
    isAvailable: false,
    color: '#00ff00', // Verde neón
    icon: '🐍'
  },
  {
    id: 'pacman',
    title: 'Pac-Man',
    description: 'Navega por el laberinto comiendo puntos y evitando a los fantasmas.',
    route: '/pacman',
    isAvailable: false,
    color: '#ffff00', // Amarillo neón
    icon: '👻'
  },
  {
    id: 'galaga',
    title: 'Galaga',
    description: 'Defiende la galaxia disparando a las naves enemigas en este shooter espacial.',
    route: '/galaga',
    isAvailable: false,
    color: '#ff00ff', // Magenta neón
    icon: '🚀'
  },
  {
    id: 'pinball',
    title: 'Pinball',
    description: 'Mantén la pelota en juego y consigue la puntuación más alta posible.',
    route: '/pinball',
    isAvailable: false,
    color: '#ff8000', // Naranja neón
    icon: '⚡'
  }
];

const GameGrid: FC = () => {
  return (
    <section className="game-grid-section">
      <div className="container">
        <h2 className="grid-title">Selecciona tu Juego</h2>
        <div className="game-grid">
          {gamesData.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              route={game.route}
              isAvailable={game.isAvailable}
              color={game.color}
              icon={game.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameGrid; 