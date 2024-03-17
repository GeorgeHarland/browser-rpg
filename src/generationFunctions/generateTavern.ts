import { books } from "../data/books";
import { PointOfInterest, SizeKeys, TileType } from "../types";

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

export const generateTavern = (tile: TileType): PointOfInterest => {
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
      roomAmount = Math.floor(Math.random() * 5) + 12; // 12-16
      break;
    default:
      roomAmount = 10;
  }

  let bookshelf: string[] | null = null;
  if (Math.random() > 0.5) {
    bookshelf = [];
    const bookCount = Math.floor(Math.random() * 3) + 1; // 1-3
    for (let i = 0; i < bookCount; i++) {
      const randomBook = Object.keys(books)[Math.floor(Math.random() * Object.keys(books).length)];
      bookshelf.push(randomBook);
    }
  }

  return {
    id: Math.floor(Math.random() * 1000000),
    tileX: tile.x,
    tileY: tile.y,
    tileId: tile.id,
    tileTerrainType: tile.terrainType,
    name: randomName,
    type: "tavern",
    playerSeen: false,
    size: randomSize,
    rooms: roomAmount,
    flavor: randomFeature,
    bookshelf: bookshelf || null,
  };
};
