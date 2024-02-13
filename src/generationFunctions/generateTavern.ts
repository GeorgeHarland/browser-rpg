import { ItemType, SizeKeys, TileType } from "../types";

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

const books: ItemType[] = [
  {
    name: "The Art of Magic",
    description: "A book on magic theory",
    buyPrice: 10,
    sellPrice: 5,
  },
  {
    name: "The Art of War",
    description: "A book on military strategy",
    buyPrice: 10,
    sellPrice: 5,
  },
  {
    name: "The Art of Peace",
    description: "A book on diplomacy",
    buyPrice: 10,
    sellPrice: 5,
  },
  {
    name: "The Trials of the Soul",
    description: "A book on the nature of the soul",
    buyPrice: 10,
    sellPrice: 5,
  },
  {
    name: "The Trials of the Body",
    description: "A book on the nature of the body",
    buyPrice: 10,
    sellPrice: 5,
  },
  {
    name: "The Trials of the Mind",
    description: "A book on the nature of the mind",
    buyPrice: 10,
    sellPrice: 5,
  },
  {
    name: "The Trials of the Heart",
    description: "A book on the nature of the heart",
    buyPrice: 10,
    sellPrice: 5,
  },
  {
    name: "The Trials of the Spirit",
    description: "A book on the nature of the spirit",
    buyPrice: 10,
    sellPrice: 5,
  },
  {
    name: "The Trials of the World",
    description: "A book on the nature of the world",
    buyPrice: 10,
    sellPrice: 5,
  },
];

export const generateTavern = (x: number, y: number): TileType => {
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

  const bookshelf: ItemType[] = [];
  if (Math.random() > 0.5) {
    const bookCount = Math.floor(Math.random() * 3) + 1; // 1-3
    for (let i = 0; i < bookCount; i++) {
      const randomBook = books[Math.floor(Math.random() * books.length)];
      bookshelf.push(randomBook);
    }
  }

  return {
    id: Math.floor(Math.random() * 1000000),
    name: randomName,
    locationType: "tavern",
    size: randomSize,
    rooms: roomAmount,
    flavor: randomFeature,
    bookshelf: bookshelf,
    x: x,
    y: y,
  };
};
