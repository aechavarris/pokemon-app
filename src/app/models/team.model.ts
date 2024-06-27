import { Pokemon } from "./pokemon.model";
  // team.model.ts
  export interface Team {
    id: number;
    name: string;
    pokemons: Pokemon[];
  }