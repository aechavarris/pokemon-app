import { PokemonService } from '../services/pokemon.service';
import { Pokemon, createPokemonFromJson } from './pokemon.model'; // Asegúrate de importar el modelo de Pokemon
let lastGeneratedTeamId = 0;
export interface Team {
  user: string; // Ajusta el tipo según tu modelo de usuario
  id: number;
  name: string;
  pokemons: Pokemon[]; // Utiliza un array de Pokemon en lugar de simplemente strings
}

// Implementa la exportación de createTeamFromJson
export const createTeamFromJson = (jsonData: any, pokemonService: PokemonService): Promise<Team> => {
  return new Promise<Team>((resolve, reject) => {
    const newId = ++lastGeneratedTeamId;
    const teamName = jsonData[2];
    const user = jsonData[1]
    // Obtener los nombres de los Pokémon a partir de los índices 3 al 12 en jsonData
    const pokemonIndices = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Índices de los nombres de los Pokémon
    const pokemonIds = pokemonIndices.map(index => jsonData[index]);

    // Obtener los Pokemon completos a partir de los nombres usando pokemonService
    const pokemonPromises: Promise<Pokemon>[] = pokemonIds.map((id: number) => {
      return pokemonService.searchPokemonById(id);
    });

    Promise.all(pokemonPromises)
      .then((pokemons: Pokemon[]) => {
        const newTeam: Team = {
          id: newId,
          user: user,
          name: teamName,
          pokemons: pokemons
        };
        resolve(newTeam);
      })
      .catch((error) => reject(error));
  });

};