export type GameStateType = {
  player: PlayerType;
  npcs: NpcType[];
  locations: Location[];
}

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
}

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
}

export interface LocationType {
  id: number;
  name: string;
  options: OptionType[];
}

export interface TavernType extends LocationType{
  size: SizeKeys;
  rooms: number;
  feature: string;
};

export type ItemType = {
  name: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
}

export type OptionType = {
  description: string;
  action:(...args: any[]) => any;
}

export const ancestriesRecord: Record<AncestryKeys, AncestryType> = {
  Human: {
    name: 'Human',
    adj: 'human',
    baseMaxHp: 10,
  },
  Elf: {
    name: 'Elf',
    adj: 'elven',
    baseMaxHp: 12,
  },
  Dwarf: {
    name: 'Dwarf',
    adj: 'dwarven',
    baseMaxHp: 12,
  },
  Gnome: {
    name: 'Gnome',
    adj: 'gnomish',
    baseMaxHp: 7,
  }
}

export type AncestryKeys = 'Human' | 'Elf' | 'Dwarf' | 'Gnome';

export type AncestryType = {
  name: string;
  adj: string;
  baseMaxHp: number;
};

export const professionsRecord: Record<ProfessionKeys, ProfessionType> = {
  Bartender: {
    name: 'Bartender',
    incomeFactor: 4
  },
  Carpenter: {
    name: 'Carpenter',
    incomeFactor: 4
  },
  Deserter: {
    name: 'Deserter',
    incomeFactor: 1
  },
  Gambler: {
    name: 'Gambler',
    incomeFactor: 3
  }
}

export type ProfessionKeys = 'Bartender' | 'Carpenter' | 'Deserter' | 'Gambler';

export type ProfessionType = {
  name: string;
  incomeFactor: number;
}

export const personalitiesRecord: Record<PersonalityKeys, PersonalityType> = {
  cautious: {
    name: 'cautious',
  },
  cheerful: {
    name: 'cheerful',
  },
  curious: {
    name: 'curious',
  },
  gloomy: {
    name: 'gloomy',
  }
}

export type PersonalityKeys = 'cautious' | 'cheerful' | 'curious' | 'gloomy';

export type PersonalityType = {
  name: string;
}

export type SizeKeys = 'small' | 'medium' | 'large' | 'huge';
