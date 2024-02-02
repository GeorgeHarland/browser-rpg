import { AncestryKeys, NpcType, PersonalityKeys, ProfessionKeys, ancestriesRecord, professionsRecord } from "../types";

const firstNames = [
  'Rolf',
  'Ilia',
  'Semand',
  'Pila',
  'Grum',
  'Alison',
  'Elian',
  'Ulfrid',
  'Weslin',
];

const secondNames = [
  'Elnak',
  'Cravenwood',
  'Helmrock',
  'Altan',
  'Fearsprig',
  'Underhill',
  'Elkland',
  'Humbletree',
  'Espelian',
];

export const generateNpc = (): NpcType => {
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomSecond =
    secondNames[Math.floor(Math.random() * secondNames.length)];

  // let professionObj;
  // if (profession) {
  //   professionObj = professions[profession];
  // } else {
  //   const profKeys = Object.keys(professions);
  //   professionObj =
  //     professions[profKeys[Math.floor(Math.random() * profKeys.length)]];
  // }

  const ansKeys = Object.keys(ancestriesRecord);
  const randomAnIndex = Math.floor(Math.random() * ansKeys.length);
  const randomAncestry: AncestryKeys = ansKeys[randomAnIndex] as AncestryKeys;

  const profKeys = Object.keys(professionsRecord);
  const randomPrIndex = Math.floor(Math.random() * profKeys.length);
  const randomProfession: ProfessionKeys = profKeys[randomPrIndex] as ProfessionKeys;

  const perKeys = Object.keys(ancestriesRecord);
  const randomPeIndex = Math.floor(Math.random() * perKeys.length);
  const randomPersonality: PersonalityKeys = ansKeys[randomPeIndex] as PersonalityKeys;

  return {
    firstName: randomFirst,
    lastName: randomSecond,
    ancestry: randomAncestry,
    profession: randomProfession,
    personality: randomPersonality,
    currentHp: ancestriesRecord[randomAncestry].baseMaxHp,
    maxHp: ancestriesRecord[randomAncestry].baseMaxHp,
    mana: 0,
    gold: 0,
    inventory: [],
    currentLocation: 1,
  };
};
