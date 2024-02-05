import { createContext, useEffect, ReactNode, useReducer } from 'react';
import { GameAction, GameStateType, NpcType } from '../types';
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
  const locations = []
  locations.push(generateTavern());

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
  
  const npcs = [];
  for(let i = 0; i < 3; i++) npcs.push(generateNpc());

  return {
    player: player,
    narrative: {
      mainNarrative: {
        text: 'Welcome to the game! Narrative text will be written here.',
        colour: 'black'
      },
      notifications: [{
        text:'second line test!',
        colour: 'red'},{
          text: 'third line test!',
          colour: 'blue'
        }]
    },
    options: [],
    npcs: npcs,
    locations: locations,
  } as GameStateType;
}

const isValidGameState = (parsedState: GameStateType) => {
  if (!parsedState) return false;

  const validPlayer = parsedState.player &&
    typeof parsedState.player.firstName === 'string' &&
    typeof parsedState.player.lastName === 'string' &&
    typeof parsedState.player.currentHp === 'number' &&
    typeof parsedState.player.maxHp === 'number' &&
    Array.isArray(parsedState.player.inventory);

  const validNpcs = Array.isArray(parsedState.npcs) &&
    parsedState.npcs.every((npc: NpcType) => 
    npc.firstName &&
    typeof npc.lastName === 'string' &&
    typeof npc.ancestry === 'string' &&
    typeof npc.profession === 'string');

  const validLocations = Array.isArray(parsedState.locations) &&
    parsedState.locations.every((loc: any) => 
    typeof loc.id === 'number' &&
    typeof loc.name === 'string' &&
    Array.isArray(loc.options));

    return validPlayer && validNpcs && validLocations;
}

// const generateOptions = (gameState: GameStateType): OptionType[] => {
//   // current player options: general (always allowed) + location specific + talk to any npc in the location
//   const {player, npcs, locations} = gameState;
//   const playerLocation = locations.find(loc => loc.id === player.currentLocation);
//   const npcsInLocation = npcs.filter(npc => npc.currentLocation === player.currentLocation);
//   const locationOptions = playerLocation?.options || [];
//   const npcOptions = npcsInLocation.map(npc => ({
//     type: 'npc',
//     description: `Speak to ${npc.firstName} ${npc.lastName}, a ${ancestriesRecord[npc.ancestry].adj}${' '}
//     ${npc.profession}`,
//     action: (dispatch: React.Dispatch<GameAction>) => () => dispatch({type: 'SPEAK_TO_NPC', npcDialogue: "I don't want to talk right now."})
//   }));
//   const spacer = {
//     type: 'spacer',
//     description: '',
//   } 
//   const askGold = {
//     type: 'gold',
//     description: 'Ask for 1 gold',
//     action: (dispatch: React.Dispatch<GameAction>) => () => dispatch({type: 'UPDATE_GOLD', amount: 1})
//   }
//   const giveGold = {
//     type: 'gold',
//     description: 'Give away 1 gold',
//     action: (dispatch: React.Dispatch<GameAction>) => () => dispatch({type: 'UPDATE_GOLD', amount: -1})
//   }
//   return [askGold, giveGold, spacer, ...npcOptions, spacer, ...locationOptions];
// }

export default GameContext;
