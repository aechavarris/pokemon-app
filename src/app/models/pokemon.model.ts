import { PokemonService } from "../services/pokemon.service";
import { Team } from "./team.model";
import { Type } from "./type.model";

// pokemon.model.ts
export interface Pokemon {
  id: number;
  name: string;
  type: Type[];
  baseStats: { [key: string]: number };
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
  export const createPokemonFromJson = (jsonData: any): Pokemon => {
    const types = [jsonData[2]];
  if (jsonData[3]) {
    types.push(jsonData[3]);
  }

  // Extraer estadísticas base en el formato adecuado
  const baseStats = {
    hp: jsonData[4],
    attack: jsonData[5],
    defense: jsonData[6],
    specialAttack: jsonData[7],
    specialDefense: jsonData[8],
    speed: jsonData[9]
  };

  // Extraer movimientos
  const moves = [jsonData[11], jsonData[12], jsonData[13], jsonData[14]];
  debugger;
    const newPokemon: Pokemon = {
      id: jsonData[0],
      name: jsonData[1],
      type: types,
      baseStats: baseStats,
      moves: moves,
      ability: jsonData[10],
      item: jsonData[15],
      sprites: {front_default:'',back_default:''},
      image: "" // Inicialmente vacío, se llenará más tarde con la llamada a la API
    };
    return newPokemon;
  }
  