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
  size: 'small' | 'medium' | 'large' | 'huge'
  rooms: number;
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