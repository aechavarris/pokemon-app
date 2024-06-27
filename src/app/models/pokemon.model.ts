import { Type } from "./type.model";

// pokemon.model.ts
export interface Pokemon {
  id: number;
  name: string;
  type: Type[];
  baseStats: { [key: string]: number };
  ivs: { [key: string]: number };
  evs: { [key: string]: number };
  moves: string[];
  ability: string;
  item: string;
  sprites: {
    front_default: string; // Sprite frontal por defecto
    back_default: string; // Sprite de espalda por defecto
    // Puedes agregar más sprites según necesites
  };
  image: string;
  }
  