// src/app/services/pokemon.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor() {}

  async getPokemonById(id: number): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/pokemon/${id}`);
    return response.data;
  }

  async getAllPokemon(): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/pokemon?limit=100000`);
    return response.data.results;
  }

  async getPokemonByName(name: string): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/pokemon/${name}`);
    return response.data;
  }

  // Puedes agregar más métodos para obtener habilidades, movimientos, etc.
}
