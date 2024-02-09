import { createContext, ReactNode, useReducer } from "react";
import { GameAction, GameStateType } from "../types";
import gameReducer from "./reducer";
import { validateGameState } from "./validateState";
import { generateTavern } from "../generationFunctions/generateTavern";

type GameContextType = {
  state: GameStateType;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const GameProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(gameReducer, null, initializeGame);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

const initializeGame = () => {
  const savedState = localStorage.getItem("gameState");
  if (savedState) {
    const parsedState = JSON.parse(savedState) as GameStateType;
    if (validateGameState(parsedState)) {
      return parsedState;
    } else {
      return generateFakeGame();
    }
  } else {
    return generateFakeGame();
  }
};

const generateFakeGame = () => {
  return {
    player: {
      firstName: "REDIRECT_COMMAND",
      lastName: "Karnos",
      currentHp: 10,
      maxHp: 10,
      mana: 0,
      gold: 10,
      exp: 0,
      inventory: [],
      currentLocation: 1,
    },
    narrative: {
      mainNarrative: [{
        text: "You should not be seeing this. Please redirect to the home page and generate a new world.",
        colour: "darkred",
      }],
      notifications: [],
    },
    options: [],
    npcs: [],
    locations: [generateTavern()],
  } as GameStateType;
};

export default GameContext;
