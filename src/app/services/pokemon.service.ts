// src/app/services/pokemon.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { catchError, map } from 'rxjs/operators';
import { Pokemon, createPokemonFromJson } from '../models/pokemon.model';
import { Observable } from 'rxjs';
import { read, utils } from 'xlsx';
import { createTeamFromJson, Team } from '../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  getAllPokemon(): Observable<Pokemon[]> {
    const url = `${this.baseUrl}/pokemon?limit=100000`;
    return this.http.get<Pokemon[]>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener información del Pokémon', error);
          throw error;
        })
      );
  }
  getPokemonById(pokemonId: number): Observable<any> {
    const url = `${this.baseUrl}/pokemon/${pokemonId}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener información del Pokémon', error);
          throw error;
        })
      );
  }

  searchPokemonById(id: number): Promise<Pokemon> {
    return new Promise((resolve, reject) => {
      this.http.get('assets/data/pokemon_app_data.xlsx', { responseType: 'arraybuffer' })
        .subscribe(async (data: ArrayBuffer) => {
          try {
            const workbook = read(data, { type: 'array' });
            const worksheet = workbook.Sheets['Pokemons'];
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

            // Mapear el array de jsonData a un array de objetos Pokemon
            const pokemonPromises = jsonData.map((data: any) => createPokemonFromJson(data));

            // Esperar a que todas las promesas se resuelvan usando Promise.all
            const pokemons = await Promise.all(pokemonPromises);

            // Buscar el pokemon por su id
            const pokemon = pokemons.find(p => p.id === id);
            debugger;

            if (pokemon) {
              resolve(pokemon);
            } else {
              reject(new Error(`No se encontró ningún Pokémon con id ${id}`));
            }
          } catch (error) {
            reject(error); // Manejar errores al leer el archivo Excel
          }
        }, error => {
          reject(new Error(`Error al cargar el archivo Excel: ${error}`));
        });
    });
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    const url = `${this.baseUrl}/pokemon/${name.toLowerCase()}`;
    return this.http.get<any>(url).pipe(
      map(pokemonData => ({
        id: pokemonData.id,
        name: pokemonData.name,
        type: pokemonData.types,
        sprites: pokemonData.sprites,
        baseStats: {
          hp: pokemonData.stats[0].base_stat,
          attack: pokemonData.stats[1].base_stat,
          defense: pokemonData.stats[2].base_stat,
          specialAttack: pokemonData.stats[3].base_stat,
          specialDefense: pokemonData.stats[4].base_stat,
          speed: pokemonData.stats[5].base_stat
        },
        moves: pokemonData.moves.map((move: any) => move.move.name),
        ability: pokemonData.abilities[0].ability.name,
        item: 'None', // Definir el ítem según tu lógica
        image: pokemonData.sprites.front_default // Obtener la URL de la imagen del Pokémon
      })),
      catchError(error => {
        console.error('Error al obtener información del Pokémon', error);
        throw error;
      })
    );
  }

  getPokemonMoves(pokemonId: number): Observable<any> {
    const url = `${this.baseUrl}/pokemon/${pokemonId}/moves`;
    return this.http.get<any>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener movimientos del Pokémon', error);
          throw error;
        })
      );
  }

  getPokemonAbilities(pokemonId: number): Observable<any> {
    const url = `${this.baseUrl}/pokemon/${pokemonId}/abilities`;
    return this.http.get<any>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener habilidades del Pokémon', error);
          throw error;
        })
      );
  }

  getEquipableItems(): Observable<any> {
    const url = `${this.baseUrl}/items/equipable`;
    return this.http.get<any>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener objetos equipables', error);
          throw error;
        })
      );
  }
  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}

  // Puedes agregar más métodos para obtener habilidades, movimientos, etc.
