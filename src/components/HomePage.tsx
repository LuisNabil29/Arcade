import type { FC } from 'react';
import GameGrid from './GameGrid';
import './HomePage.css';

const HomePage: FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Arcade</h1>
            <p className="hero-subtitle">
              Revive la era dorada de los videojuegos
            </p>
            <p className="hero-description">
              Disfruta de cinco juegos clásicos de arcade en una experiencia 
              moderna y nostálgica. Desde Tetris hasta Pinball, todos tus 
              favoritos en un solo lugar.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Juegos Clásicos</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Diversión</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Nostalgia</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Efectos visuales de fondo */}
        <div className="hero-effects">
          <div className="floating-shapes">
            <div className="shape shape-1">🎮</div>
            <div className="shape shape-2">👾</div>
            <div className="shape shape-3">🕹️</div>
            <div className="shape shape-4">⭐</div>
            <div className="shape shape-5">💫</div>
          </div>
        </div>
      </section>

      {/* Game Grid Section */}
      <GameGrid />

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-content">
            <p className="footer-text">
              Hecho con ❤️ para los amantes de los juegos retro
            </p>
            <div className="footer-links">
              <span className="footer-link">Arcade Platform 2025</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 