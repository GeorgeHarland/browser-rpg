// When changing GameState types, make sure to update the validateState function
// in src/gameWorldState/validateState.ts
export type GameStateType = {
  player: PlayerType;
  narrative: NarrativeType;
  options: OptionType[];
  npcs: NpcType[];
  locations: LocationType[];
};

export type GameAction =
  | { type: "LOAD_STATE"; stateToLoad: GameStateType }
  | { type: "SAVE_OPTIONS_TO_STATE"; optionsToAdd: OptionType[] }
  | { type: "SPEAK_TO_NPC"; npcDialogue: string }
  | { type: "UPDATE_GOLD"; amount: number }
  | { type: "UPDATE_MAIN_NARRATIVE"; newNarrative: NarrativeLine }
  | { type: "UPDATE_PLAYER_HP"; amount: number };

export type PlayerType = {
  firstName: string;
  lastName: string;
  currentHp: number;
  maxHp: number;
  mana: number;
  gold: number;
  exp: number;
  inventory: ItemType[];
  currentLocation: number;
};

export type NarrativeType = {
  mainNarrative: NarrativeLine;
  notifications: NarrativeLine[];
};

export type NarrativeLine = {
  text: string;
  colour?: "blue" | "black" | "red";
};

export type NpcType = {
  firstName: string;
  lastName: string;
  ancestry: AncestryKeys;
  profession: ProfessionKeys;
  personality: PersonalityKeys;
  currentHp: number;
  maxHp: number;
  mana: number;
  gold: number;
  inventory: ItemType[];
  currentLocation: number;
};

export type LocationType =
  | { id: number; name: string; locationType: "generic" }
  | {
      id: number;
      name: string;
      locationType: "tavern";
      size: SizeKeys;
      rooms: number;
      feature: string;
    };

export type ItemType = {
  name: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
};

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
    baseMaxHp: 12,
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
    incomeFactor: 20,
  },
  Carpenter: {
    name: "Carpenter",
    incomeFactor: 8,
  },
  Deserter: {
    name: "Deserter",
    incomeFactor: 3,
  },
  Gambler: {
    name: "Gambler",
    incomeFactor: 8,
  },
};

export type ProfessionKeys = "Bartender" | "Carpenter" | "Deserter" | "Gambler";

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
