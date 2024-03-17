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
          }),
        };
      }
    case "LOAD_STATE":
      return action.stateToLoad;
    case "PLAY_DICE_GAME":
      const playerRoll1 = Math.floor(Math.random() * 6) + 1;
      const playerRoll2 = Math.floor(Math.random() * 6) + 1;
      const pTotal = playerRoll1 + playerRoll2;

      // dispatch?.({
      //   type: "UPDATE_MAIN_NARRATIVE",
      //   newNarrative: {
      //     text: ``,
      //   },
      //   reset: true,
      // });
  
      const opponentRoll1 = Math.floor(Math.random() * 6) + 1;
      const opponentRoll2 = Math.floor(Math.random() * 6) + 1;
      const oTotal = opponentRoll1 + opponentRoll2;
  
      // dispatch?.({
      //   type: "UPDATE_MAIN_NARRATIVE",
      //   newNarrative: {
      //     text: ``,
      //   },
      // });
      if(state.player.gold < 1) {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [{ text: `You don't have enough gold to play.` }],
          },
        };
      }
      if((state.npcs.find((npc) => npc.id === action.npc.id)?.gold ?? 0) < 1) {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [{ text: `${action.npc.firstName} doesn't have enough gold to play.` }],
          },
        };
      }
      if (pTotal > oTotal) {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [
              { text: `You rolled a ${playerRoll1} and a ${playerRoll2}, totaling ${pTotal}.` },
              { text: `${action.npc.firstName} rolled a ${opponentRoll1} and a ${opponentRoll2}, totaling ${oTotal}.` },
              { text: `You win!` }
            ],
          },
          player: { ...state.player, gold: state.player.gold + 1 },
          npcs: state.npcs.map((npc) => {
            if (npc.id === action.npc.id) {
              return { ...npc, gold: npc.gold - 1 };
            } else {
              return npc;
            }
          })
        };
      } else if (pTotal < oTotal) {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [
              { text: `You rolled a ${playerRoll1} and a ${playerRoll2}, totaling ${pTotal}.` },
              { text: `${action.npc.firstName} rolled a ${opponentRoll1} and a ${opponentRoll2}, totaling ${oTotal}.` },
              { text: `You lost!` }
            ],
          },
          player: { ...state.player, gold: state.player.gold - 1 },
          npcs: state.npcs.map((npc) => {
            if (npc.id === action.npc.id) {
              return { ...npc, gold: npc.gold + 1 };
            } else {
              return npc;
            }
          })
        };
      } else {
        return {
          ...state,
          narrative: {
            ...state.narrative,
            mainNarrative: [{ text: `You both draw!` }],
          },
        };
      } 
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
