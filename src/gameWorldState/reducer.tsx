import { GameAction, GameStateType } from "../types";

const gameReducer = (state: GameStateType, action: GameAction): GameStateType => {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.stateToLoad;
    case 'UPDATE_GOLD':
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold + action.amount }
      };
    case 'UPDATE_PLAYER_HP':
      return {
        ...state,
        player: {...state.player, currentHp: state.player.currentHp + action.amount}
      };
    default:
      return state;
  }
};

export default gameReducer;
