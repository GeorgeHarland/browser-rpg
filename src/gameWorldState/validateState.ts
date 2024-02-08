import { GameStateType, NpcType } from "../types";

export const validateGameState = (parsedState: GameStateType) => {
  if (!parsedState) return false;

  const validPlayer =
    parsedState.player &&
    typeof parsedState.player.firstName === "string" &&
    typeof parsedState.player.lastName === "string" &&
    typeof parsedState.player.currentHp === "number" &&
    typeof parsedState.player.maxHp === "number" &&
    Array.isArray(parsedState.player.inventory);

  const validNpcs =
    Array.isArray(parsedState.npcs) &&
    parsedState.npcs.every(
      (npc: NpcType) =>
        npc.firstName &&
        typeof npc.lastName === "string" &&
        typeof npc.ancestry === "string" &&
        typeof npc.profession === "string"
    );

  const validLocations =
    Array.isArray(parsedState.locations) &&
    parsedState.locations.every(
      (loc: any) =>
        typeof loc.id === "number" &&
        typeof loc.name === "string" &&
        typeof loc.locationType === "string"
    );
  console.log(
    "Validation check on generation: ",
    validPlayer,
    validNpcs,
    validLocations
  );
  console.log("Validation: ", validPlayer && validNpcs && validLocations);
  return validPlayer && validNpcs && validLocations;
};
