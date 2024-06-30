import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service'

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnInit {

  pokemonId!: number;
  pokemon: any;
  moves!: any[];
  abilities!: any[];
  equipableItems!: any[];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pokemonId = params['id'];
      this.fetchPokemonDetails();
    });
  }

  fetchPokemonDetails(): void {
    this.pokemonService.getPokemonById(this.pokemonId).subscribe(
      pokemonData => {
        this.pokemon = pokemonData;
      },
      error => {
        console.error('Error al obtener información del Pokémon', error);
      }
    );

    this.pokemonService.getPokemonAbilities(this.pokemonId).subscribe(
      abilitiesData => {
        this.abilities = abilitiesData;
      },
      error => {
        console.error('Error al obtener habilidades del Pokémon', error);
      }
    );

    this.pokemonService.getEquipableItems().then(
      itemsData => {
        this.equipableItems = itemsData;
      },
      error => {
        console.error('Error al obtener objetos equipables', error);
      }
    );
  }

}
