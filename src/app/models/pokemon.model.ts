import { PokemonService } from "../services/pokemon.service";
import { Item } from "./item.model";
import { Team } from "./team.model";
import { Type, Weakness } from "./type.model";
import { Move } from "./move.model";
import { Ability } from "./ability.model";

// pokemon.model.ts
export interface Pokemon {
  id: number;
  name: string;
  type: Type[];
  baseStats: { [key: string]: number };
  moves: Move[];
  ability: Ability;
  item: any;
  sprites: {
    front_default: string; // Sprite frontal por defecto
    back_default: string; // Sprite de espalda por defecto
    // Puedes agregar más sprites según necesites
  };
  image: string;
  weakness: Weakness[]
  }
  export const createPokemonFromJson = (jsonData: any): Pokemon => {
    const types = [jsonData[2]];
  if (jsonData[3]) {
    types.push(jsonData[3]);
  }

  // Extraer estadísticas base en el formato adecuado
  const baseStats = {
    hp: jsonData[4],
    Atk: jsonData[5],
    def: jsonData[6],
    SpA: jsonData[7],
    SpD: jsonData[8],
    Spe: jsonData[9]
  };

  // Extraer movimientos
  const moves = [({name: jsonData[11], type:{}}) as Move, ({name: jsonData[12], type:{}}) as Move, ({name: jsonData[13], type:{}}) as Move, ({name: jsonData[14], type:{}}) as Move];
    const newPokemon: Pokemon = {
      id: jsonData[0],
      name: jsonData[1],
      type: types,
      baseStats: baseStats,
      moves: moves,
      ability: {
        name: jsonData[10],
        id: 0,
        effect_entries: []
      },
      item: jsonData[15],
      sprites: {front_default:'',back_default:''},
      image: "",
      weakness: []
    };
    return newPokemon;
  }
  