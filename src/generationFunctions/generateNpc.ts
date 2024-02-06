import {
  AncestryKeys,
  NpcType,
  PersonalityKeys,
  ProfessionKeys,
  ancestriesRecord,
  professionsRecord,
} from "../types";

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
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomSecond =
    secondNames[Math.floor(Math.random() * secondNames.length)];

  const ansKeys = Object.keys(ancestriesRecord);
  const randomAnIndex = Math.floor(Math.random() * ansKeys.length);
  const randomAncestry: AncestryKeys = ansKeys[randomAnIndex] as AncestryKeys;

  const profKeys = Object.keys(professionsRecord);
  const randomPrIndex = Math.floor(Math.random() * profKeys.length);
  const randomProfession: ProfessionKeys = profKeys[
    randomPrIndex
  ] as ProfessionKeys;

  const perKeys = Object.keys(ancestriesRecord);
  const randomPeIndex = Math.floor(Math.random() * perKeys.length);
  const randomPersonality: PersonalityKeys = ansKeys[
    randomPeIndex
  ] as PersonalityKeys;

  return {
    firstName: randomFirst,
    lastName: randomSecond,
    ancestry: randomAncestry,
    profession: randomProfession,
    personality: randomPersonality,
    currentHp: ancestriesRecord[randomAncestry].baseMaxHp,
    maxHp: ancestriesRecord[randomAncestry].baseMaxHp,
    mana: 0,
    gold: Math.floor(
      Math.random() * professionsRecord[randomProfession].incomeFactor
    ),
    inventory: [],
    currentLocation: 1,
  };
};
