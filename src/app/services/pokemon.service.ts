// src/app/services/pokemon.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { Pokemon, createPokemonFromJson } from '../models/pokemon.model';
import { Observable, throwError } from 'rxjs';
import { read, utils } from 'xlsx';
import { createTeamFromJson, Team } from '../models/team.model';
import { Injectable } from '@angular/core';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  
  private baseUrl = 'https://pokeapi.co/api/v2';
  
  constructor(private http: HttpClient) { }

  getAllPokemon(): Observable<Pokemon[]> {
    const url = `${this.baseUrl}/pokemon?limit=100000`;
    const params = new HttpParams().set('language', 'es');
    return this.http.get<Pokemon[]>(url, {params})
      .pipe(
        catchError(error => {
          console.error('Error al obtener información del Pokémon', error);
          throw error;
        })
      );
  }
  getPokemonById(pokemonId: number): Observable<any> {
    const url = `${this.baseUrl}/pokemon/${pokemonId}`;
    const params = new HttpParams().set('language', 'es');
    return this.http.get<any>(url,{params})
      .pipe(
        catchError(error => {
          console.error('Error al obtener información del Pokémon', error);
          throw error;
        })
      );
  }

  async searchPokemonById(id: number): Promise<Pokemon> {
    try {
      const data: any = await this.http.get('assets/data/pokemon_app_data.xlsx', { responseType: 'arraybuffer' }).toPromise();
      const workbook = read(data, { type: 'array' });
      const worksheet = workbook.Sheets['Pokemons'];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
  
      let pokemon: Pokemon | undefined;
      const pokemonPromises: Pokemon[] = jsonData.map((json: any) => createPokemonFromJson(json));
  
      const pokemons: Pokemon[] = await Promise.all(pokemonPromises);
      pokemon = pokemons.find(p => p.id === id);
  
      if (!pokemon) {
        pokemon = {
          id: 0,
          name: "MISSINGNO",
          type: [],
          baseStats: {},
          moves: [],
          ability: '',
          item: ({name:'None', url:''}),
          sprites: { front_default: '', back_default: '' },
          image: ""
        };
      }
  
      return pokemon;
    } catch (error) {
      console.error('Error buscando Pokémon por ID:', error);
      throw error; // Propagar el error para manejarlo más adelante si es necesario
    }
  }
  

  getPokemonByName(name: string): Promise<Pokemon> {
    const url = `${this.baseUrl}/pokemon/${name.toLowerCase()}`;
    const params = new HttpParams().set('language', 'es');
    return this.http.get<any>(url,{params}).pipe(
      map(pokemonData => {
        if (!pokemonData) {
          throw new Error('Pokemon data not found');
        }
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          type: pokemonData.types,
          sprites: pokemonData.sprites,
          baseStats: {
            hp: pokemonData.stats[0].base_stat,
            Atk: pokemonData.stats[1].base_stat,
            def: pokemonData.stats[2].base_stat,
            SpA: pokemonData.stats[3].base_stat,
            SpD: pokemonData.stats[4].base_stat,
            Spe: pokemonData.stats[5].base_stat
          },
          moves: pokemonData.moves,
          ability: pokemonData.abilities,
          item: ({name: 'None',url:''}), // Definir el ítem según tu lógica
          image: pokemonData.sprites.front_default // Obtener la URL de la imagen del Pokémon
        } as Pokemon;
      }),
      catchError(error => {
        console.error('Error al obtener información del Pokémon', error);
        return throwError(() => new Error('Error al obtener información del Pokémon')); // Lanzar un error
      })
    ).toPromise() as Promise<Pokemon>; // Asegura el tipo de retorno como Promise<Pokemon>
  }

  getPokemonMoves(pokemonId: number): Observable<any> {
    const url = `${this.baseUrl}/pokemon/${pokemonId}/moves`;
    const params = new HttpParams().set('language', 'es');
    return this.http.get<any>(url,{params})
      .pipe(
        catchError(error => {
          console.error('Error al obtener movimientos del Pokémon', error);
          throw error;
        })
      );
  }

  getPokemonAbilities(pokemonId: number): Observable<any> {
    const url = `${this.baseUrl}/pokemon/${pokemonId}/abilities`;
    const params = new HttpParams().set('language', 'es');
    return this.http.get<any>(url,{params})
      .pipe(
        catchError(error => {
          console.error('Error al obtener habilidades del Pokémon', error);
          throw error;
        })
      );
  }

  getEquipableItems(): Promise<any[]> {
    const url = `${this.baseUrl}/item?offset=0&limit=1000`; // Ajusta el límite según tus necesidades
    const params = new HttpParams().set('language', 'es');
    return this.http.get<any>(url,{params})
      .pipe(
        catchError(error => {
          console.error('Error al obtener objetos equipables', error);
          return throwError(() => new Error('Error al obtener objetos equipables'));
        })
      )
      .toPromise();
  }
  
  getItemByName(name: string): Promise<Item> {
    const url = `${this.baseUrl}/item/${name.toLowerCase().replace(' ','-')}`;
    const params = new HttpParams().set('language', 'es');
    return this.http.get<any>(url,{params})
      .pipe(
        catchError(error => {
          console.error(`Error al obtener el item ${name}`, error);
          return throwError(() => new Error(`Error al obtener el item ${name}`));
        })
      )
      .toPromise();
  }

  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}

  // Puedes agregar más métodos para obtener habilidades, movimientos, etc.
