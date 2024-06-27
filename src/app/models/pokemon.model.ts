// pokemon.model.ts
export interface Pokemon {
    id: number;
    name: string;
    type: string[];
    baseStats: { [key: string]: number };
    ivs: { [key: string]: number };
    evs: { [key: string]: number };
    moves: string[];
    ability: string;
    item: string;
  }
  