// GameContext.js
import { createContext, useState, useEffect, ReactNode } from 'react';

const GameContext = createContext({});

type Props = {
  children: ReactNode;
}

export const GameProvider = ({ children }: Props) => {
  const [gameState, setGameState] = useState({});

  return (
    <GameContext.Provider value={[gameState, setGameState]}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
