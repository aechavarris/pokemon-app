// src/app/components/team-editor/team-editor.component.ts
import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { TeamService } from '../../services/team.service';
import { Pokemon, Team } from '../../models/team.model';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss'],
})
export class TeamEditorComponent implements OnInit {
  teams: Team[] = [];
  selectedTeam: Team | null = null;
  availablePokemon: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null;

  constructor(private pokemonService: PokemonService, private teamService: TeamService) {}

  async ngOnInit() {
    this.availablePokemon = await this.pokemonService.getAllPokemon();
    // Obtener equipos del usuario (puedes agregar lógica para obtener el ID del usuario actual)
    this.teams = this.teamService.getTeams();
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
