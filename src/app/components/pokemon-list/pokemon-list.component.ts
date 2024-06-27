// src/app/components/pokemon-list/pokemon-list.component.ts
import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  pokemons: any[] = [];
  selectedPokemon: any = null;

  constructor(private pokemonService: PokemonService) {}

  async ngOnInit() {
    this.pokemons = await this.pokemonService.getAllPokemon();
  }

  async selectPokemon(name: string) {
    this.selectedPokemon = await this.pokemonService.getPokemonByName(name);
  }
}
