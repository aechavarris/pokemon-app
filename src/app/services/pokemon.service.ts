// src/app/services/pokemon.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { catchError, map } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon.model';
import { Observable } from 'rxjs';

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
        ivs: { // Definir los IVs según tu estructura
          hp: 0,
          attack: 0,
          defense: 0,
          specialAttack: 0,
          specialDefense: 0,
          speed: 0
        },
        evs: { // Definir los EVs según tu estructura
          hp: 0,
          attack: 0,
          defense: 0,
          specialAttack: 0,
          specialDefense: 0,
          speed: 0
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
