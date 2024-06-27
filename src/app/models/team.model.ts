import { Observable, forkJoin, map } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon, createPokemonFromJson } from './pokemon.model'; // Asegúrate de importar el modelo de Pokemon
import { Item } from './item.model';
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
    const user = jsonData[1];
    // Obtener los nombres de los Pokémon a partir de los índices 3 al 12 en jsonData
    const pokemonIndices = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Índices de los nombres de los Pokémon
    const pokemonIds = pokemonIndices.map(index => jsonData[index]);

    // Obtener las promesas de los Pokémon completos usando pokemonService
    const pokemonPromises: Promise<Pokemon>[] = pokemonIds.map(async id => {
      try {
        const poke: Pokemon = await pokemonService.searchPokemonById(id);
        const pokeApi: Pokemon = await pokemonService.getPokemonByName(poke.name);
        
        // Obtener el item equipable del Pokémon
        const item: any = (await pokemonService.getItemByName(poke.item));
        
        // Combinar la información obtenida del getPokemonByName con el searchPokemonById
        poke.type = [];
        pokeApi.type.forEach((type : any) =>{
          poke.type.push(({name:type.type.name, url:type.type.url}))
        });
        poke.image = pokeApi.image;
        poke.sprites = pokeApi.sprites;
        poke.item = ({name:item.name.replace('-', ' '), sprite:item.sprites.default}); // Asignar el item equipable
        
        return poke;
      } catch (error) {
        console.error('Error obteniendo Pokémon:', error);
        throw error; // Propagar el error para manejarlo más adelante si es necesario
      }
    });
    

    // Usar Promise.all para combinar todas las promesas en una sola y manejar la respuesta
    Promise.all(pokemonPromises)
      .then(pokemons => {
        const newTeam: Team = {
          id: newId,
          user: user,
          name: teamName,
          pokemons: pokemons
        };
        // Hacer algo con el nuevo equipo
        resolve(newTeam);
      })
      .catch(error => {
        console.error('Error creando equipo:', error);
      });
    });
  }
