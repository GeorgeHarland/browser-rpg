import { GameStateType, NpcType, TileType } from "../types";
import { generateNpc } from "./generateNpc";
import { generateTavern } from "./generateTavern";

// Accepts optional player name arguments

export const generateNewGame = (
  playerFirstName: string = "Tom",
  playerLastName: string = "Karnos"
): GameStateType => {
  const worldSize = 100;
  const taverns: TileType[] = [];
  const npcs: NpcType[] = [];
  const worldGrid: TileType[][] = [[],[]];

  // generate world grid - either wastelands or taverns
  for (let i = 0; i < worldSize; i++) {
    worldGrid[i] = [];
    for (let j = 0; j < worldSize; j++) {
      const randomNumber = Math.random();
      if(randomNumber > 0.01) {
        worldGrid[i][j] = {
          id: Math.floor(Math.random() * 1000000),
          name: 'Plains',
          locationType: "plains",
          x: i,
          y: j,
        };
      } else if(randomNumber > 0.005) {
        worldGrid[i][j] = {
          id: Math.floor(Math.random() * 1000000),
          name: 'Ruins',
          locationType: "ruins",
          x: i,
          y: j,
        };
      } else {
        worldGrid[i][j] = generateTavern(i, j);
        taverns.push(worldGrid[i][j]);
      }
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
  taverns.forEach(tavern => {
    if(tavern.locationType !== "tavern") return;
    let npcCount = 0;
    switch(tavern.size) {
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
    for(let i = 0; i < npcCount; i++) {
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
      if(tile.locationType === "tavern") {
        const isStartingTavern = tile.x === startingTavern.x && tile.y === startingTavern.y;
        rowString += isStartingTavern ? "T" : "t";
      } else {
        rowString += tile.locationType === "ruins" ? "r" : "_";
      }
    });
    console.log(rowString);
  });

  return {
    player: player,
    narrative: {
      mainNarrative: [{
        text: `Welcome to the game! Narrative text will be written here. You start at the ${startingTavern.name} Tavern. You can interact with the world using the options on the left.
        There are ${npcs.length} NPCs in the world, and ${taverns.length} taverns.`,
        colour: "black",
      }],
      notifications: [],
    },
    options: [],
    npcs: npcs,
    tiles: worldGrid,
    otherInfo: {
      startingTavern: startingTavern,
    }
  } as GameStateType;
};
