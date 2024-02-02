// GameContext.js
import { createContext, useEffect, ReactNode, useReducer } from 'react';
import { GameAction, GameStateType } from '../types';
import { generateTavern } from '../generationFunctions/generateTavern';
import { generateNpc } from '../generationFunctions/generateNpc';
import gameReducer from './reducer';

// type GameContextType = [GameStateType | null, React.Dispatch<React.SetStateAction<GameStateType | null>>];
type GameContextType = {
  state: GameStateType;
  dispatch: React.Dispatch<GameAction>;
};

// const GameContext = createContext<GameContextType>([null, () => {}]);
const GameContext = createContext<GameContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
}

export const GameProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(gameReducer, null, generateNewGame);
  // const [gameState, setGameState] = useState<GameStateType | null>(null);

  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const parsedState = JSON.parse(savedState) as GameStateType;
      if (isValidGameState(parsedState)) {
        dispatch({type: 'LOAD_STATE', stateToLoad: parsedState})
      } else {
        const newGame = generateNewGame();
        dispatch({type: 'LOAD_STATE', stateToLoad: newGame})
      }
    } else {
      const newGame = generateNewGame();
      dispatch({type: 'LOAD_STATE', stateToLoad: newGame})
    }
  }, []);

  return (
    <GameContext.Provider value={{state, dispatch}}>
      {children}
    </GameContext.Provider>
  );
};

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

const isValidGameState = (parsedState: GameStateType) => {
  return false;
}

export default GameContext;
