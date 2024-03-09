import { GameStateType, NpcType, TileType } from "../types";
import { generateNpc } from "./generateNpc";
import { generateTavern } from "./generateTavern";

// Accepts optional player name arguments

export const generateNewGame = (playerFirstName: string = "Tom", playerLastName: string = "Karnos"): GameStateType => {
  const worldSize = 65;
  const taverns: TileType[] = [];
  const npcs: NpcType[] = [];
  const worldGrid: TileType[][] = [[], []];

  // generate world grid
  for (let i = 0; i < worldSize; i++) {
    worldGrid[i] = [];
    let previousXTile = 'unique';
    let previousYTile = 'unique';
    for (let j = 0; j < worldSize; j++) {
      const randomNumber = Math.random();
      if(j > 0) previousYTile = worldGrid[i][j-1].locationType;
      let matchPreviousRandomFactor = Math.random();
      if (previousXTile === previousYTile) matchPreviousRandomFactor += 0.6;
      let tileType = 'unique'

      if (matchPreviousRandomFactor > 0.85 && previousXTile != 'unique' && previousYTile != 'unique') tileType = Math.random() > 0.5 ? previousXTile : previousYTile;
      else if (randomNumber > 0.75) tileType = "forest"; // x2 chance
      else if (randomNumber > 0.625) tileType = "plains";
      else if (randomNumber > 0.5) tileType = "hilllands";
      else if (randomNumber > 0.375) tileType = "mountain";
      else if (randomNumber > 0.25) tileType = "desert";
      else if (randomNumber > 0.125) tileType = "tundra";
      else tileType = "swamp";

      const placeOfInterest = Math.random() > 0.98;
      if(placeOfInterest) {
        tileType = (Math.random() > 0.5) ? "ruins" : "tavern";
      }

      switch(tileType) {
        case 'plains':
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Plains",
            locationType: "plains",
            x: i,
            y: j,
          };
          break;
        case 'forest':
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Forest",
            locationType: "forest",
            x: i,
            y: j,
          };
          break;
        case 'mountain':
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Mountain",
            locationType: "mountain",
            x: i,
            y: j,
          };
          break;
          case 'swamp':
            worldGrid[i][j] = {
              id: Math.floor(Math.random() * 1000000),
              name: "Swamp",
              locationType: "swamp",
              x: i,
              y: j,
            };
            break;
            case 'hilllands':
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Hilllands",
            locationType: "hilllands",
            x: i,
            y: j,
          };
          break;
          case 'desert':
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Desert",
            locationType: "desert",
            x: i,
            y: j,
          };
          break;
          case 'tundra':
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Tundra",
            locationType: "tundra",
            x: i,
            y: j,
          };
          break;
        case 'ruins':
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Ruins",
            locationType: "ruins",
            x: i,
            y: j,
          };
          break;
        case 'tavern':
          worldGrid[i][j] = generateTavern(i, j);
          taverns.push(worldGrid[i][j]);
          break;
        default:
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Forest",
            locationType: "forest",
            x: i,
            y: j,
          };
      }
      if(tileType === ('tavern' || 'ruins')) previousXTile = 'unique'
      else previousXTile = tileType
    }
  }

  // at least one tavern must exist
  if (taverns.length === 0) {
    const x = Math.floor(Math.random() * worldSize);
    const y = Math.floor(Math.random() * worldSize);
    const tavern = generateTavern(x, y);
    worldGrid[x][y] = tavern;
    taverns.push(tavern);
  }

  // gen NPCs for each tavern, set starting loc to that tavern
  taverns.forEach((tavern) => {
    if (tavern.locationType !== "tavern") return;
    let npcCount = 0;
    switch (tavern.size) {
      case "small":
        npcCount = Math.floor(Math.random() * 3) + 1; // 1-3
        break;
      case "medium":
        npcCount = Math.floor(Math.random() * 3) + 2; // 2-4
        break;
      case "large":
        npcCount = Math.floor(Math.random() * 4) + 3; // 3-6
        break;
      case "huge":
        npcCount = Math.floor(Math.random() * 5) + 4; // 4-8
        break;
    }
    for (let i = 0; i < npcCount; i++) {
      const npc = generateNpc(tavern.x, tavern.y);
      npcs.push(npc);
    }
  });

  const startingTavern = taverns[Math.floor(Math.random() * taverns.length)];

  const player = {
    firstName: playerFirstName,
    lastName: playerLastName,
    currentHp: 10,
    maxHp: 10,
    mana: 0,
    gold: 10,
    exp: 0,
    inventory: [],
    currentLocation: startingTavern.id,
    x: startingTavern.x,
    y: startingTavern.y,
  };

  console.log("World Grid Visualization:");
  worldGrid.forEach((row) => {
    let rowString = "";
    row.forEach((tile) => {
      switch(tile.locationType) {
        case 'plains':
          rowString += "p";
          break;
        case 'forest':
          rowString += "f";
          break;
        case 'hilllands':
          rowString += "h";
          break;
        case 'mountain':
          rowString += "m"
          break;
        case 'desert':
          rowString += "d";
          break;
        case 'tundra':
          rowString += "t";
          break;
        case 'swamp':
          rowString += "s";
          break;
        case 'ruins':
          rowString += "R"
          break;
        case 'tavern':
          const isStartingTavern = tile.x === startingTavern.x && tile.y === startingTavern.y;
          rowString += isStartingTavern ? "*T*" : "T";
          break;
        default:
          rowString += "?";
      }
    });
    console.log(rowString);
  });

  return {
    player: player,
    narrative: {
      mainNarrative: [
        {
          text: `Welcome to the game! Narrative text will be written here. You start at the ${startingTavern.name} Tavern. You can interact with the world using the options on the left.
        There are ${npcs.length} NPCs in the world, and ${taverns.length} taverns.`,
          colour: "black",
        },
      ],
      notifications: [],
    },
    options: [],
    npcs: npcs,
    tiles: worldGrid,
    otherInfo: {
      startingTavern: startingTavern,
    },
  } as GameStateType;
};
