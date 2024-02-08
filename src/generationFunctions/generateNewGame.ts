import { GameStateType } from "../types";
import { generateNpc } from "./generateNpc";
import { generateTavern } from "./generateTavern";

export const generateNewGame = (): GameStateType => {
  const locations = [];
  locations.push(generateTavern());

  const player = {
    firstName: "Tom",
    lastName: "Karnos",
    currentHp: 10,
    maxHp: 10,
    mana: 0,
    gold: 10,
    exp: 0,
    inventory: [],
    currentLocation: 1,
  };

  const npcs = [];
  for (let i = 0; i < 3; i++) npcs.push(generateNpc());

  return {
    player: player,
    narrative: {
      mainNarrative: {
        text: "Welcome to the game! Narrative text will be written here.",
        colour: "black",
      },
      notifications: [
        {
          text: "second line test!",
          colour: "red",
        },
        {
          text: "third line test!",
          colour: "blue",
        },
      ],
    },
    options: [],
    npcs: npcs,
    locations: locations,
  } as GameStateType;
};