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
  "Bran",
  "Cedric",
  "Dain",
  "Elian",
  "Grom",
  "Grum",
  "Ilia",
  "Jerrick",
  "Kael",
  "Kerriss",
  "Lorin",
  "Marin",
  "Merrick",
  "Pila",
  "Quinn",
  "Rolf",
  "Saran",
  "Semand",
  "Talin",
  "Thormak",
  "Ulfrid",
  "Vilma",
  "Weslin",
  "Zaylin",
];

const secondNames = [
  "Altan",
  "Brambleshack",
  "Briarwood",
  "Cravenwood",
  "Dawnstrider",
  "Echoleaf",
  "Elkland",
  "Elnak",
  "Espelian",
  "Fearsprig",
  "Glimmerwood",
  "Helmrock",
  "Humbletree",
  "Tintann",
  "Tumblebrush",
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
];

const closers = ["I was busy anyway.", "Goodbye.", "...", "Okay...", "See you.", "Well that was a waste of time..."];

export const generateNpc = (x: number, y: number): NpcType => {
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
    gold: Math.floor(Math.random() * professionsRecord[profession].incomeFactor),
    inventory: [],
    currentLocation: 1,
    dialogue: {
      defaultOpener: getRandomElement(openers),
      defaultCloser: getRandomElement(closers),
    },
    x: x,
    y: y,
  };
};
