import { GameAction, GameStateType } from "../types";

const gameReducer = (
  state: GameStateType,
  action: GameAction
): GameStateType => {
  switch (action.type) {
    case "ADD_OPTIONS_TO_STATE":
      return {
        ...state,
        options: { ...state.options, ...action.optionsToAdd },
      };
    case "LOAD_STATE":
      return action.stateToLoad;
    case "SPEAK_TO_NPC":
      return {
        ...state,
        narrative: {
          ...state.narrative,
          mainNarrative: { text: action.npcDialogue, colour: "black" },
        },
      };
    case "UPDATE_GOLD":
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold + action.amount },
      };
    case "UPDATE_MAIN_NARRATIVE":
      return {
        ...state,
        narrative: { ...state.narrative, mainNarrative: action.newNarrative },
      };
    case "UPDATE_PLAYER_HP":
      return {
        ...state,
        player: {
          ...state.player,
          currentHp: state.player.currentHp + action.amount,
        },
      };
    default:
      return state;
  }
};

// const updateGold = (changeAmount: number) => {
//   dispatch?.({type: 'UPDATE_GOLD', amount: changeAmount});
//   if (narrative.mainNarrative.text.includes('Your gold has changed.')) {
//     dispatch?.({type: 'UPDATE_MAIN_NARRATIVE', newNarrative: {text: 'Your gold has changed. Again.', colour: 'black'}});
//   } else {
//     dispatch?.({type: 'UPDATE_MAIN_NARRATIVE', newNarrative: {text: 'Your gold has changed.', colour: 'black'}});
//   }
// };

export default gameReducer;
