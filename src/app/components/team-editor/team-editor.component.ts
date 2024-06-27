// src/app/components/team-editor/team-editor.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';
import { Pokemon } from 'src/app/models/pokemon.model';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss'],
})
export class TeamEditorComponent implements OnInit {
  @Input() team!: Team;
  selectedTeam: Team | null = null;
  availablePokemon!: Pokemon[];
  selectedPokemon: Pokemon | null = null;

  constructor(private pokemonService: PokemonService, private teamService: TeamService) {}

  async ngOnInit() {
    this.pokemonService.getAllPokemon().subscribe(data => this.availablePokemon = data);
    // Obtener equipos del usuario (puedes agregar lógica para obtener el ID del usuario actual)
  }

  selectTeam(team: Team) {
    this.selectedTeam = team;
  }

  addPokemonToTeam(pokemon: Pokemon) {
    if (this.selectedTeam && this.selectedTeam.pokemons.length < 10) {
      this.selectedTeam.pokemons.push(pokemon);
    }
  }

  saveTeam() {
    if (this.selectedTeam) {
      this.teamService.saveTeam(this.selectedTeam);
    }
  }
}
