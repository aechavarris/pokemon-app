// src/app/services/pokemon.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { Pokemon, createPokemonFromJson } from '../models/pokemon.model';
import { Observable, throwError } from 'rxjs';
import { read, utils } from 'xlsx';
import { createTeamFromJson, Team } from '../models/team.model';
import { Injectable } from '@angular/core';
import { Item } from '../models/item.model';
import { Move } from '../models/move.model';
import { Ability } from '../models/ability.model';

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
          ability: {
            id: 0,
            name: '',
            effect_entries: []
          },
          item: { name: 'None', url: '' },
          sprites: { front_default: '', back_default: '' },
          image: "",
          weakness: []
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
    return this.http.get<any>(url, { params }).pipe(
      map(pokemonData => {
        if (!pokemonData) {
          throw new Error('Pokemon data not found');
        }
  
        // Obtener el gif animado de la generación V
        const generationV = pokemonData.sprites.versions['generation-v'];
        const animatedGif = generationV['black-white'].animated.front_default;
  
        // Obtener el sprite de Dream World
        const artwork = pokemonData.sprites.other['official-artwork'].front_default;
  
        // Obtener las habilidades del Pokemon
        const abilities = pokemonData.abilities.map((ability: any) => ability.ability.name);
  
        // Construir el objeto Pokemon
        const pokemon: Pokemon = {
          id: pokemonData.id,
          name: pokemonData.name,
          type: pokemonData.types.map((type: any) => type.type.name),
          sprites: {
            front_default: animatedGif,
            back_default: artwork // Ajustar según tu necesidad
          },
          baseStats: {
            hp: pokemonData.stats.find((stat: any) => stat.stat.name === 'hp').base_stat,
            Atk: pokemonData.stats.find((stat: any) => stat.stat.name === 'attack').base_stat,
            def: pokemonData.stats.find((stat: any) => stat.stat.name === 'defense').base_stat,
            SpA: pokemonData.stats.find((stat: any) => stat.stat.name === 'special-attack').base_stat,
            SpD: pokemonData.stats.find((stat: any) => stat.stat.name === 'special-defense').base_stat,
            Spe: pokemonData.stats.find((stat: any) => stat.stat.name === 'speed').base_stat
          },
          moves: pokemonData.moves.map((move: any) => move.move.name),
          ability: abilities,
          item: { name: 'None', url: '' }, // Definir el ítem según tu lógica
          image: artwork, // Establecer la imagen como el sprite de Dream World
          weakness: []
        };
  
        return pokemon;
      }),
      catchError(error => {
        console.error('Error al obtener información del Pokémon', error);
        return throwError(() => new Error('Error al obtener información del Pokémon')); // Lanzar un error
      })
    ).toPromise() as Promise<Pokemon>; // Asegura el tipo de retorno como Promise<Pokemon>
  }

  private async getMoveByName(name: string): Promise<Move> {
    const url = `${this.baseUrl}/move/${name}`;
    const params = new HttpParams().set('language', 'es');

    try {
      const moveData: Move = await this.http.get<any>(url, { params }).toPromise();
      return moveData;
    } catch (error) {
      console.error(`Error al obtener el movimiento ${name}`, error);
      throw error;
    }
  }

  async getMovesDetailsByNames(moveNames: string[]): Promise<Move[]> {
    try {
      const movesDetails: Move[] = [];

      await Promise.all(
        moveNames.map(async (name) => {
          const moveData: Move = await this.getMoveByName(name.toLowerCase());
          movesDetails.push(moveData);
        })
      );

      return movesDetails;
    } catch (error) {
      console.error('Error al obtener detalles de los movimientos', error);
      throw error;
    }
  }

  getAbilityByName(abilityName: string): Promise<Ability> {
    const url = `${this.baseUrl}/ability/${abilityName.toLowerCase()}`;
    const params = new HttpParams().set('language', 'es');
    return this.http.get<any>(url, { params }).pipe(
      catchError(error => {
        console.error(`Error al obtener la habilidad ${abilityName}`, error);
        return throwError(() => new Error(`Error al obtener la habilidad ${abilityName}`));
      })
    ).toPromise();
  }

  getItemByName(name: string): Promise<Item> {
    const url = `${this.baseUrl}/item/${name.toLowerCase().replace(' ', '-')}`;
    const params = new HttpParams().set('language', 'es');
    return this.http.get<any>(url, { params }).pipe(
      catchError(error => {
        console.error(`Error al obtener el item ${name}`, error);
        return throwError(() => new Error(`Error al obtener el item ${name}`));
      })
    ).toPromise();
  }
}

  // Puedes agregar más métodos para obtener habilidades, movimientos, etc.
