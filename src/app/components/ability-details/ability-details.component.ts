import { Component, OnInit } from '@angular/core';
import { Ability } from 'src/app/models/ability.model';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-ability-details',
  templateUrl: './ability-details.component.html',
  styleUrls: ['./ability-details.component.css']
})
export class AbilityDetailsComponent implements OnInit {

  ability: Ability | undefined;
  abilityName = 'intimidate'; // Nombre de la habilidad que deseas obtener

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadAbilityDetails();
  }

  loadAbilityDetails() {
    this.pokemonService.getAbilityByName(this.abilityName).then(
      (      ability: any) => {
        this.ability = ability;
        console.log('Detalles de la habilidad:', ability);
      },
      (      error: any) => {
        console.error('Error al cargar detalles de la habilidad:', error);
        // Manejar el error según tus necesidades
      }
    );
  }

}
