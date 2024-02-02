// GameContext.js
import { createContext, useState, useEffect, ReactNode } from 'react';
import { GameStateType } from '../types';
import { generateTavern } from '../generationFunctions/generateTavern';
import { generateNpc } from '../generationFunctions/generateNpc';

type GameContextType = [GameStateType | null, React.Dispatch<React.SetStateAction<GameStateType | null>>];

const GameContext = createContext<GameContextType>([null, () => {}]);

type Props = {
  children: ReactNode;
}

export const GameProvider = ({ children }: Props) => {
  const [gameState, setGameState] = useState<GameStateType | null>(null);

  const isValidGameState = (parsedState: GameStateType) => {
    return false;
  }

  const generateNewGame = (): GameStateType => {
    // gen locations inc. starting location
    const locations = []
    locations.push(generateTavern());
    // gen player, set loc to tavern
    const player = {
      firstName: 'Tom',
      lastName: 'Karnos',
      currentHp: 10,
      maxHp: 10,
      mana: 0,
      gold: 10,
      exp: 0,
      inventory: [],
      currentLocation: 1,
    }
    // gen npcs, set loc to tavern
    const npcs = [];
    for(let i = 0; i < 3; i++) npcs.push(generateNpc());
    // setGameState
    return {
      player: player,
      npcs: npcs,
      locations: locations,
    };
  }

  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (isValidGameState(parsedState)) {
        setGameState(parsedState);
      } else {
        setGameState(generateNewGame);
      }
    } else {
      setGameState(generateNewGame);
    }
  }, []);

  return (
    <GameContext.Provider value={[gameState, setGameState]}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
