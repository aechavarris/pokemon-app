import { Observable, forkJoin, map } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon, createPokemonFromJson } from './pokemon.model'; // Asegúrate de importar el modelo de Pokemon
import { Item } from './item.model';
import { Move } from './move.model';
import { Ability, Effect } from './ability.model';
import { Type, Weakness, typeEffectiveness } from './type.model';
let lastGeneratedTeamId = 0;
export interface Team {
  userId: number; // Ajusta el tipo según tu modelo de usuario
  id: number;
  name: string;
  pokemons: Pokemon[]; // Utiliza un array de Pokemon en lugar de simplemente strings
}

// Implementa la exportación de createTeamFromJson
export const createTeamFromJson = (jsonData: any, pokemonService: PokemonService): Promise<Team> => {
  return new Promise<Team>((resolve, reject) => {
    const newId = ++lastGeneratedTeamId;
    const teamName = jsonData[2];
    const userId = jsonData[1];
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
        const ability: Ability = (await pokemonService.getAbilityByName(poke.ability.name.replace(/ /g, '-')));
        ability.effect_entries = [ability.effect_entries.find((effect: any) => effect.language.name === 'en') as Effect]
        const moves: Move[] = (await pokemonService.getMovesDetailsByNames(
          poke.moves.map(move => move.name.replace(/ /g, '-'))
        )).map(move => ({
          ...move,
          name: move.name.replace(/-/g, ' ')  // Sustituir guiones por espacios en blanco
        }));
        
        // Combinar la información obtenida del getPokemonByName con el searchPokemonById
        poke.type = [];
        pokeApi.type.forEach((type : any) =>{
          poke.type.push(({name:type, url:''}))
        });
        const effectivenessMap: { [key: string]: number } = {};
        
        poke.type.forEach(type => {
          const typeInfo = typeEffectiveness[type.name.toLowerCase()];
          if (typeInfo) {
            for (const [targetType, multiplier] of Object.entries(typeInfo)) {
              if (effectivenessMap[targetType] !== undefined) {
                effectivenessMap[targetType] *= multiplier;
              } else {
                effectivenessMap[targetType] = multiplier;
              }
            }
          }
        });
    
        const resultWeakness: Weakness[] = [];
        for (const [type, effectiveness] of Object.entries(effectivenessMap)) {
          if (effectiveness !== 1) { // Ignorar valores de efectividad de 1
            resultWeakness.push({
              type: { name: type, url: `url_to_${type}_info` }, // Reemplaza `url_to_${type}_info` con la URL correcta
              weakness: effectiveness
            });
          }
        }
        poke.weakness = resultWeakness;
        poke.image = pokeApi.image;
        poke.sprites = pokeApi.sprites;
        poke.item = ({name:item.name.replace('-', ' '), sprite:item.sprites.default}); // Asignar el item equipable
        poke.moves = moves;
        poke.ability = ability;
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
          userId: userId,
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
