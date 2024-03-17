// combine books and potions nested objects
import { ItemType } from "../types";
import { books } from "./books";
import { potions } from "./potions";

export const allItems: {[key: string]: ItemType} = { ...books, ...potions}