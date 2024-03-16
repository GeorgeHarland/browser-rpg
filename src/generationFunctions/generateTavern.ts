import { books } from "../data/books";
import { ItemType, PointOfInterest, SizeKeys } from "../types";

const tavernNameAdjectives = ["Crimson", "Emerald", "Sapphire", "Topaz", "Golden"];

const tavernNameNouns = ["Gryphon", "Dragon", "Zombie", "Hedgehog", "Gnome"];

const tavernSizes: SizeKeys[] = ["small", "medium", "large", "huge"];

const tavernFeatures = [
  "Elven Architecture",
  "Dwarvish Architecture",
  "Famous Owner",
  "Famous Chef",
  "Rare Meats",
  "Historical Significance",
  "Talking Parrots",
];

export const generateTavern = (tileX: number, tileY: number, tileId: number, startingTavern: boolean): PointOfInterest => {
  const randomAdjective = tavernNameAdjectives[Math.floor(Math.random() * tavernNameAdjectives.length)];
  const randomNoun = tavernNameNouns[Math.floor(Math.random() * tavernNameNouns.length)];
  const randomName = `The ${randomAdjective} ${randomNoun}`;

  const randomFeature = tavernFeatures[Math.floor(Math.random() * tavernFeatures.length)];

  const randomSize = tavernSizes[Math.floor(Math.random() * tavernSizes.length)];
  let roomAmount = 0;
  switch (randomSize) {
    case "small":
      roomAmount = Math.floor(Math.random() * 3) + 3; // 3-5
      break;
    case "medium":
      roomAmount = Math.floor(Math.random() * 4) + 5; // 5-8
      break;
    case "large":
      roomAmount = Math.floor(Math.random() * 4) + 7; // 7-10
      break;
    case "huge":
      roomAmount = Math.floor(Math.random() * 6) + 11; // 11-16
      break;
    default:
      roomAmount = 10;
  }

  let bookshelf: ItemType[] | null = null;
  if (Math.random() > 0.5) {
    bookshelf = [];
    const bookCount = Math.floor(Math.random() * 3) + 1; // 1-3
    for (let i = 0; i < bookCount; i++) {
      const randomBook = books[Math.floor(Math.random() * books.length)];
      bookshelf.push(randomBook);
    }
  }

  return {
    id: Math.floor(Math.random() * 1000000),
    tileX: tileX,
    tileY: tileY,
    tileId: tileId,
    name: randomName,
    type: "tavern",
    playerSeen: startingTavern ? true : false,
    size: randomSize,
    rooms: roomAmount,
    flavor: randomFeature,
    bookshelf: bookshelf || null,
  };
};
