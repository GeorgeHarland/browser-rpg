import { GameAction, GameStateType } from "../types";

const gameReducer = (state: GameStateType, action: GameAction): GameStateType => {
  switch (action.type) {
    case "BUY_ITEM":
      if (state.player.gold < action.cost) {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [
              {
                text: "You don't have enough gold for that.",
              },
            ],
          },
        };
      } else {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [
              {
                text: `You have bought the item for ${action.cost} gold.`,
              },
            ],
          },
          player: {
            ...state.player,
            gold: state.player.gold - action.cost,
            inventory: [...state.player.inventory, action.itemId],
          },
          npcs: state.npcs.map((npc) => {
            if (npc.id === action.npcId) {
              npc.inventory = npc.inventory.filter((item) => item !== action.itemId);
            }
            return npc;
          })
        }
      }
    case "LOAD_STATE":
      return action.stateToLoad;
    case "PLAYER_ENTERS_AREA":
      return {
        ...state,
        player: {
          ...state.player,
          locationId: action.id,
          locationType: action.localeType,
        },
      };
    case "PLAYER_LEAVES_AREA":
      return {
        ...state,
        player: {
          ...state.player,
          locationId: null,
          locationType: null,
        },
      };
    case "SAVE_OPTIONS_TO_STATE":
      return {
        ...state,
        options: { ...action.optionsToAdd },
      };
    case "UPDATE_GOLD":
      if (
        state.narrative.mainNarrative[0].text ===
        `Your gold has changed again. (${action.amount >= 0 ? "+" + action.amount : action.amount})`
      ) {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [{ text: "Your gold has changed. Again." }],
          },
          player: { ...state.player, gold: state.player.gold + action.amount },
        };
      } else {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [{ text: `Your gold has changed.` }],
          },
          player: { ...state.player, gold: state.player.gold + action.amount },
        };
      }
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
