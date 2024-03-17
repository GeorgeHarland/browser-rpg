import { GameStateType, NpcType, PointOfInterest, TileType } from "../types";
import { generateNpc } from "./generateNpc";
import { generateTavern } from "./generateTavern";

// Accepts optional player name arguments

export const generateNewGame = (playerFirstName: string = "Tom", playerLastName: string = "Karnos"): GameStateType => {
  const worldSize = 65;
  const taverns: PointOfInterest[] = [];
  const npcs: NpcType[] = [];
  const worldGrid: TileType[][] = [[], []];
  const tiles2DArray = [];

  // generate world grid
  for (let i = 0; i < worldSize; i++) {
    worldGrid[i] = [];
    let previousXTile = "forest";
    let previousYTile = "forest";
    for (let j = 0; j < worldSize; j++) {
      const randomNumber = Math.random();
      if (i > 0) previousYTile = worldGrid[i - 1][j].terrainType;
      let matchPreviousRandomFactor = Math.random();
      let tileType = "forest";

      if (matchPreviousRandomFactor > 0.15 && previousXTile != "unique" && previousYTile != "unique")
        tileType = Math.random() > 0.5 ? previousXTile : previousYTile;
      else if (randomNumber > 0.75)
        tileType = "forest"; // x2 chance
      else if (randomNumber > 0.625) tileType = "plains";
      else if (randomNumber > 0.5) tileType = "hills";
      else if (randomNumber > 0.375) tileType = "mountain";
      else if (randomNumber > 0.25) tileType = "desert";
      else if (randomNumber > 0.125) tileType = "tundra";
      else tileType = "swamp";

      const placeOfInterest = Math.random() > 0.98;
      if (placeOfInterest) {
        tileType = Math.random() > 0.5 ? "ruins" : "tavern";
      }

      switch (tileType) {
        case "plains":
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Plains",
            terrainType: "plains",
            pointsOfInterest: [],
            x: i,
            y: j,
          };
          break;
        case "forest":
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Forest",
            terrainType: "forest",
            pointsOfInterest: [],
            x: i,
            y: j,
          };
          break;
        case "mountain":
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Mountain",
            terrainType: "mountain",
            pointsOfInterest: [],
            x: i,
            y: j,
          };
          break;
        case "swamp":
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Swamp",
            terrainType: "swamp",
            pointsOfInterest: [],
            x: i,
            y: j,
          };
          break;
        case "hills":
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Hills",
            terrainType: "hills",
            pointsOfInterest: [],
            x: i,
            y: j,
          };
          break;
        case "desert":
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Desert",
            terrainType: "desert",
            pointsOfInterest: [],
            x: i,
            y: j,
          };
          break;
        case "tundra":
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Tundra",
            terrainType: "tundra",
            pointsOfInterest: [],
            x: i,
            y: j,
          };
          break;
        default:
          worldGrid[i][j] = {
            id: Math.floor(Math.random() * 1000000),
            name: "Forest",
            terrainType: "forest",
            pointsOfInterest: [],
            x: i,
            y: j,
          };
      }
      if (tileType === "tavern" || tileType === "ruins") previousXTile = "unique";
      else previousXTile = tileType;
      tiles2DArray.push(worldGrid[i][j]);
    }
  }

  let ruinsCount = 0;
  let ironMinesCount = 0;
  // for each tile, fill points of interest - 2-5 each
  tiles2DArray.forEach((tile) => {
    for (let i = 0; i < Math.floor(Math.random() * 4 + 2); i++) {
      switch (tile.terrainType) {
        case "forest":
          if (Math.random() > 0.98) {
            const tavern = generateTavern(tile);
            tile.pointsOfInterest.push(tavern);
            taverns.push(tavern);
          } else {
            tile.pointsOfInterest.push({
              id: Math.floor(Math.random() * 100000),
              tileX: tile.x,
              tileY: tile.y,
              tileId: tile.id,
              tileTerrainType: tile.terrainType,
              name: "Ruins",
              type: "ruins",
              playerSeen: false,
            });
            ruinsCount++;
          }
          break;
        case "mountain":
          if (Math.random() > 0.98) {
            tile.pointsOfInterest.push({
              id: Math.floor(Math.random() * 100000),
              tileX: tile.x,
              tileY: tile.y,
              tileId: tile.id,
              tileTerrainType: tile.terrainType,
              name: "Iron Mine",
              type: "ironMine",
              playerSeen: false,
            });
            ironMinesCount++;
          } else {
            tile.pointsOfInterest.push({
              id: Math.floor(Math.random() * 100000),
              tileX: tile.x,
              tileY: tile.y,
              tileId: tile.id,
              tileTerrainType: tile.terrainType,
              name: "Ruins",
              type: "ruins",
              playerSeen: false,
            });
            ruinsCount++;
          }
          break;
        default:
          tile.pointsOfInterest.push({
            id: Math.floor(Math.random() * 100000),
            tileX: tile.x,
            tileY: tile.y,
            tileId: tile.id,
            tileTerrainType: tile.terrainType,
            name: "Ruins",
            type: "ruins",
            playerSeen: false,
          });
          ruinsCount++;
          break;
      }
    }
  });

  // at least one tavern must exist
  if (taverns.length === 0) {
    const tile = tiles2DArray[Math.floor(Math.random() * tiles2DArray.length)];
    const tavern = generateTavern(tile);
    worldGrid[tile.x][tile.y].pointsOfInterest.push(tavern);
    taverns.push(tavern);
  }

  const startingTavern = taverns[Math.floor(Math.random() * taverns.length)];
  if (startingTavern.type === "tavern") {
    startingTavern.playerSeen = true;
    startingTavern.size = "medium";
    startingTavern.rooms = Math.floor(Math.random() * 4) + 5; // 5-8
  }

  // set NPCs in each tavern
  taverns.forEach((tavern) => {
    if (tavern.type !== "tavern") return;
    let npcCount = 0;
    switch (tavern.size) {
      case "small":
        npcCount = Math.floor(Math.random() * 2) + 2; // 2-3
        break;
      case "medium":
        npcCount = Math.floor(Math.random() * 3) + 3; // 3-5
        break;
      case "large":
        npcCount = Math.floor(Math.random() * 3) + 5; // 5-7
        break;
      case "huge":
        npcCount = Math.floor(Math.random() * 6) + 7; // 7-12
        break;
    }
    for (let i = 0; i < npcCount; i++) {
      const npc = generateNpc(tavern.id, tavern.type, tavern.tileX, tavern.tileY);
      npcs.push(npc);
    }
  });

  // set npc inventories
  npcs.forEach((npc) => {
    if (npc.profession === "Herbalist") {
      const inventory = [];
      inventory.push(100001); // 1 Minor Healing Potion
      Math.random() > 0.5 && inventory.push(100001); // 50% chance of a second Minor Healing Potion
      Math.random() > 0.5 && inventory.push(100002); // 50% chance of 1 Minor Mana Potion

      npc.inventory = inventory;
    }
  });

  const player = {
    firstName: playerFirstName,
    lastName: playerLastName,
    currentHp: 10,
    maxHp: 10,
    mana: 0,
    gold: 10,
    exp: 0,
    inventory: [],
    locationId: startingTavern.id,
    locationType: "tavern",
    tileId: startingTavern.tileId,
    x: startingTavern.tileX,
    y: startingTavern.tileY,
  };

  console.log("World Grid Visualization:");
  worldGrid.forEach((row) => {
    let rowString = "";
    row.forEach((tile) => {
      switch (tile.terrainType) {
        case "plains":
          rowString += "p";
          break;
        case "forest":
          rowString += "f";
          break;
        case "hills":
          rowString += "h";
          break;
        case "mountain":
          rowString += "m";
          break;
        case "desert":
          rowString += "d";
          break;
        case "tundra":
          rowString += "t";
          break;
        case "swamp":
          rowString += "s";
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
          text: `Welcome to the game! Narrative text will be written here. You will start at ${startingTavern.name} Tavern. You can interact with the world using the options on the left.
        The world has been generated with: ${tiles2DArray.length} terrain tiles, ${ruinsCount} ruins, ${ironMinesCount} iron mines, ${taverns.length} taverns, and ${npcs.length} total NPCs.`,
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
