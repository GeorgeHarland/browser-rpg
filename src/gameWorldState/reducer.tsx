import { GameAction, GameStateType } from "../types";

const gameReducer = (state: GameStateType, action: GameAction): GameStateType => {
  switch (action.type) {
    case "LOAD_STATE":
      return action.stateToLoad;
    case "SAVE_OPTIONS_TO_STATE":
      return {
        ...state,
        options: { ...action.optionsToAdd },
      };
    case "UPDATE_GOLD":
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold + action.amount },
      };
    case "UPDATE_MAIN_NARRATIVE":
      if (!action.reset) {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [...state.narrative.mainNarrative, action.newNarrative],
          },
        };
      } else {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [action.newNarrative],
          },
        };
      }
    case "UPDATE_NPC_GOLD":
      return {
        ...state,
        npcs: state.npcs.map((npc) => {
          if (npc.id === action.npcId) {
            return {
              ...npc,
              gold: npc.gold + action.amount,
            };
          } else {
            return npc;
          }
        }),
      };
    case "UPDATE_PLAYER_HP":
      return {
        ...state,
        player: {
          ...state.player,
          currentHp: state.player.currentHp + action.amount,
        },
      };
    case "UPDATE_SUBTITLE":
      return {
        ...state,
        narrative: {
          ...state.narrative,
          subtitle: action.newSubtitle,
        },
      };
    default:
      return state;
  }
};

export default gameReducer;
