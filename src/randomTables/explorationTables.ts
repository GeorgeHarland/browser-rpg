import { EncounterDetails } from "../types";

export const rollForestEncounter = (): EncounterDetails => {
  const roll = Math.floor(Math.random() * 4) + 1;
  switch (roll) {
    case 1:
      return {
        name: "Uneventful",
        monsterId: null,
      };
    case 2:
      return {
        name: "Suspicious Mushrooms",
        monsterId: null,
      };
    case 3:
      return {
        name: "Goblin",
        monsterId: 100001,
      };
    case 4:
      return {
        name: "Giant Spider",
        monsterId: 100002,
      };
    default:
      return {
        name: "Uneventful",
        monsterId: null,
      };
  }
};
