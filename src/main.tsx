import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import GamePage from './pages/GamePage';
import { GameProvider } from './gameWorldState/gameContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameProvider>
      <GamePage />
    </GameProvider>
  </React.StrictMode>
);
