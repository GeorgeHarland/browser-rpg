import { ItemType } from "../types";

export const potions: {[key: string]: ItemType} = {
  100001: {
    id: 100001,
    name: "Minor Healing Potion",
    description: "A potion that heals the drinker",
    basePrice: 10,
  },
  100002: {
    id: 100002,
    name: "Minor Mana Potion",
    description: "A potion that grants 1 mana point",
    basePrice: 10,
  }
};
