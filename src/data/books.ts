import { ItemType } from "../types";

export const books: { [key: string]: ItemType } = {
  200001: {
    id: 200001,
    name: "The Art of Magic I: The Basics",
    description: "A book on magic theory",
    bookText: "To start learning magic, you must collect mana crystals. These crystals are found around the world and can be used to cast spells, enchant items and more.",
    basePrice: 10,
  },
  200002: {
    id: 200002,
    name: "Mountains of the World",
    description: "A book on geography",
    bookText: "The mountains of the world are vast and varied. Some contain Iron or Copper mines, while others are home to dangerous creatures such as goblins and wretched elves",
    basePrice: 10,
  },
  200003: {
    id: 200003,
    name: "Elven Technology",
    description: "A book on elven technology",
    bookText: "Elven technology is advanced and magical. They use crystals to power their machines and have created flying ships and magical firearms.",
    basePrice: 10,
  },
  200004: {
    id: 200004,
    name: "A Primer on Airships",
    description: "A book on airships",
    bookText: "Airships are a relatively new invention, but they have already revolutionized travel and trade. They are powered by crystals and can travel at great speeds.",
    basePrice: 10,
  },
  200005: {
    id: 200005,
    name: "The Art of Magic II: Scrolls",
    description: "A book on magic scrolls",
    bookText: "Magic scrolls are a way to cast spells without using mana. They are one-time use and can be found in dungeons or purchased from magic shops.",
    basePrice: 10,
  },
  200006: {
    id: 200006,
    name: "A Prophecy of Darkness",
    description: "A book about a world-ending prophecy",
    bookText: "The prophecy of darkness tells of a great evil will devour the stars one by one, until the warmth of the universe is extinguised.",
    basePrice: 10,
  },
};