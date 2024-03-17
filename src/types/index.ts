// When changing GameState types, make sure to update the validateState function
// in src/gameWorldState/validateState.ts

export type GameStateType = {
  player: PlayerType;
  narrative: NarrativeType;
  options: OptionType[];
  npcs: NpcType[];
  tiles: TileType[][];
  otherInfo: {
    startingTavern: PointOfInterest;
  };
};

export type GameAction =
  | { type: "BUY_ITEM"; itemId: number; npcId: number; cost: number }
  | { type: "LOAD_STATE"; stateToLoad: GameStateType }
  | { type: "PLAY_DICE_GAME"; npc: NpcType }
  | { type: "PLAYER_ENTERS_AREA"; id: number; localeType: string }
  | { type: "PLAYER_LEAVES_AREA" }
  | { type: "SAVE_OPTIONS_TO_STATE"; optionsToAdd: OptionType[] }
  | { type: "UPDATE_GOLD"; amount: number; reset: boolean }
  | {
      type: "UPDATE_MAIN_NARRATIVE";
      newNarrative: NarrativeLine;
      reset?: boolean;
    }
  | { type: "UPDATE_NPC_GOLD"; npcId: number; amount: number }
  | { type: "UPDATE_PLAYER_HP"; amount: number }
  | { type: "UPDATE_SUBTITLE"; newSubtitle: NarrativeLine };

export type PlayerType = {
  firstName: string;
  lastName: string;
  currentHp: number;
  maxHp: number;
  mana: number;
  gold: number;
  exp: number;
  inventory: number[];
  locationId: number | null;
  locationType: string | null;
  tileId: number;
  x: number;
  y: number;
};

export type NarrativeType = {
  subtitle?: NarrativeLine;
  mainNarrative: NarrativeLine[];
  notifications: NarrativeLine[];
};

export type NarrativeLine = {
  text: string;
  colour?: "black" | "darkred";
};

export type NpcType = {
  id: number;
  firstName: string;
  lastName: string;
  ancestry: AncestryKeys;
  profession: ProfessionKeys;
  personality: PersonalityKeys;
  currentHp: number;
  maxHp: number;
  mana: number;
  gold: number;
  inventory: number[];
  currentLocation: number;
  dialogue: NpcDialogueType;
  locationId: number;
  locationType: string;
  tileX: number;
  tileY: number;
};

type NpcDialogueType = {
  defaultOpener: string;
  defaultCloser: string;
};

export type TileType = {
  id: number;
  name: string;
  terrainType: TerrainType;
  pointsOfInterest: PointOfInterest[];
  x: number;
  y: number;
};

export type TerrainType = "plains" | "mountain" | "forest" | "tundra" | "desert" | "swamp" | "hills";

export type PointOfInterest =
  | {
      id: number;
      tileId: number;
      tileX: number;
      tileY: number;
      tileTerrainType: TerrainType;
      name: string;
      type: "tavern";
      playerSeen: boolean;
      size: SizeKeys;
      rooms: number;
      flavor: string;
      bookshelf: string[] | null;
    }
  | {
      id: number;
      tileId: number;
      tileX: number;
      tileY: number;
      tileTerrainType: TerrainType;
      name: string;
      type: "ruins" | "ironMine";
      playerSeen: boolean;
    };

export type ItemType = {
  id: number;
  name: string;
  description: string;
  bookText?: string;
  basePrice: number;
};

export type MonsterType = {
  id: number;
  name: string;
  description: string;
  minHp: number;
  maxHp: number;
  baseAtk: number;
  baseExp: number;
  baseGold: number;
  lootTables: lootTable[];
};

export type lootTable = "basic-beast" | "basic-goblin";

export type OptionType = {
  type: string;
  description: string;
  action?: (...args: any[]) => any;
};

export const ancestriesRecord: Record<AncestryKeys, AncestryType> = {
  Human: {
    name: "Human",
    adj: "Human",
    baseMaxHp: 10,
  },
  Elf: {
    name: "Elf",
    adj: "Elven",
    baseMaxHp: 9,
  },
  Dwarf: {
    name: "Dwarf",
    adj: "Dwarven",
    baseMaxHp: 12,
  },
  Gnome: {
    name: "Gnome",
    adj: "Gnomish",
    baseMaxHp: 7,
  },
};

export type AncestryKeys = "Human" | "Elf" | "Dwarf" | "Gnome";

export type AncestryType = {
  name: string;
  adj: string;
  baseMaxHp: number;
};

export const professionsRecord: Record<ProfessionKeys, ProfessionType> = {
  Bartender: {
    name: "Bartender",
    incomeFactor: 18,
  },
  Deserter: {
    name: "Deserter",
    incomeFactor: 3,
  },
  Gambler: {
    name: "Gambler",
    incomeFactor: 7,
  },
  Herbalist: {
    name: "Herbalist",
    incomeFactor: 10,
  },
};

export type ProfessionKeys = "Bartender" | "Deserter" | "Gambler" | "Herbalist";

export type ProfessionType = {
  name: string;
  incomeFactor: number;
};

export const personalitiesRecord: Record<PersonalityKeys, PersonalityType> = {
  cautious: {
    name: "cautious",
  },
  cheerful: {
    name: "cheerful",
  },
  curious: {
    name: "curious",
  },
  gloomy: {
    name: "gloomy",
  },
};

export type PersonalityKeys = "cautious" | "cheerful" | "curious" | "gloomy";

export type PersonalityType = {
  name: string;
};

export type SizeKeys = "small" | "medium" | "large" | "huge";

export type ActivityType = "dialogue" | "combat" | "location" | "explore";

export type EncounterDetails = {
  name: string;
  monsterId: number | null;
};
