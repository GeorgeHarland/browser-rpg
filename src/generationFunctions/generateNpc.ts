import {
  AncestryKeys,
  NpcType,
  PersonalityKeys,
  ProfessionKeys,
  ancestriesRecord,
  personalitiesRecord,
  professionsRecord,
} from "../types";
import { getRandomElement, getRandomKey } from "../utils/arrayFunctions";

const firstNames = [
  "Alison",
  "Annie",
  "Elian",
  "Grum",
  "Ilia",
  "Jerrick",
  "Merrick",
  "Pila",
  "Rolf",
  "Saran",
  "Semand",
  "Thormak",
  "Ulfrid",
  "Weslin",
  "Zaylin",
];

const secondNames = [
  "Altan",
  "Brambleshack",
  "Cravenwood",
  "Elkland",
  "Elnak",
  "Espelian",
  "Fearsprig",
  "Helmrock",
  "Humbletree",
  "Tintann",
  "Underhill",
];

export const generateNpc = (): NpcType => {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(secondNames);
  const ancestry = getRandomKey(ancestriesRecord) as AncestryKeys;
  const profession = getRandomKey(professionsRecord) as ProfessionKeys;
  const personality = getRandomKey(personalitiesRecord) as PersonalityKeys;
  return {
    firstName,
    lastName,
    ancestry,
    profession,
    personality,
    currentHp: ancestriesRecord[ancestry].baseMaxHp,
    maxHp: ancestriesRecord[ancestry].baseMaxHp,
    mana: 0,
    gold: Math.floor(
      Math.random() * professionsRecord[profession].incomeFactor
    ),
    inventory: [],
    currentLocation: 1,
  };
};
