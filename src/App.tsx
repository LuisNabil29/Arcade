import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import TetrisPage from './games/tetris/TetrisPage';
import SnakePage from './games/snake/SnakePage';
import PacmanPage from './games/pacman/PacmanPage';
import GalagaPage from './games/galaga/GalagaPage';
import PinballPage from './games/pinball/PinballPage';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<HomePage />} />
          
          {/* Páginas de juegos (placeholders) */}
          <Route path="/tetris" element={<TetrisPage />} />
          <Route path="/snake" element={<SnakePage />} />
          <Route path="/pacman" element={<PacmanPage />} />
          <Route path="/galaga" element={<GalagaPage />} />
          <Route path="/pinball" element={<PinballPage />} />
          
          {/* Ruta por defecto - redirige a home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
