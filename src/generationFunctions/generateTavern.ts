import { SizeKeys, LocationType } from "../types";

const tavernNameAdjectives = [
  "Crimson",
  "Emerald",
  "Sapphire",
  "Topaz",
  "Golden",
];

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

export const generateTavern = (): LocationType => {
  const randomAdjective =
    tavernNameAdjectives[
      Math.floor(Math.random() * tavernNameAdjectives.length)
    ];
  const randomNoun =
    tavernNameNouns[Math.floor(Math.random() * tavernNameNouns.length)];
  const randomName = `The ${randomAdjective} ${randomNoun}`;

  const randomFeature =
    tavernFeatures[Math.floor(Math.random() * tavernFeatures.length)];

  const randomSize =
    tavernSizes[Math.floor(Math.random() * tavernSizes.length)];
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

  return {
    id: 1,
    name: randomName,
    locationType: "tavern",
    size: randomSize,
    rooms: roomAmount,
    feature: randomFeature,
  };
};
