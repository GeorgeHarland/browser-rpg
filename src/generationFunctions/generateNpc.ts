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

const openers = [
  "Greetings traveller.",
  "Ah, a new face. What brings you here",
  "Have you heard any interesting rumors lately?",
  "Hm. A new face. I'm not sure I like it.",
  "Hello there.",
  "What do you want?",
  "I'm busy. What do you want?",
  "I'm not in the mood for talking. What do you want?",
]

const closers = [
  "I was busy anyway.",
  "Goodbye.",
  "...",
  "Okay...",
  "See you.",
  "Well that was a waste of time..."
]

export const generateNpc = (): NpcType => {
  const id = Math.floor(Math.random() * 1000000);
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(secondNames);
  const ancestry = getRandomKey(ancestriesRecord) as AncestryKeys;
  const profession = getRandomKey(professionsRecord) as ProfessionKeys;
  const personality = getRandomKey(personalitiesRecord) as PersonalityKeys;
  return {
    id,
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
    dialogue: {
      defaultOpener: getRandomElement(openers),
      defaultCloser: getRandomElement(closers),
    },
  };
};
