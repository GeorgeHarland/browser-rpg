import { MonsterType } from "../types";

export const monsters: { [key: string]: MonsterType } = {
  100001: {
    id: 100001,
    name: "Goblin",
    description: "A small, green creature. You would think it was friendly if you didn't know better.",
    minHp: 5,
    maxHp: 7,
    baseExp: 3,
    baseGold: 3,
    lootTables: ['basic-goblin'],
  },
  10000: {
    id: 100002,
    name: "Giant Spider",
    description: "A large, hairy spider.",
    minHp: 4,
    maxHp: 6,
    baseExp: 3,
    baseGold: 0,
    lootTables: ['basic-beast'],
  },
}