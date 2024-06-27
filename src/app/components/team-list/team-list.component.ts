// src/app/components/team-list/team-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Team, createTeamFromJson } from '../../models/team.model';
import { HttpClient } from '@angular/common/http';
import { read, utils } from 'xlsx';
import { Router } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent implements OnInit {

  teams: Team[] = [];
  expandedPokemonDetails: any[] = [];
  constructor(private http: HttpClient, private router: Router, private pokemonService: PokemonService) {
    this.loadExcelFile();
  }
  ngOnInit(): void {
  }

  loadExcelFile() {
    this.http.get('assets/data/pokemon_app_data.xlsx', { responseType: 'arraybuffer' })
      .subscribe((data: ArrayBuffer) => {
        this.processExcel(data);
      }, error => {
        console.error('Error al cargar el archivo Excel:', error);
      });
  }
  
  processExcel(data: ArrayBuffer) {
    const workbook = read(data, { type: 'array' });
    const worksheet = workbook.Sheets['Teams'];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

    // Mapear el array de jsonData a un array de objetos Team
    const teamPromises = jsonData.map((jsonData: any) => createTeamFromJson(jsonData, this.pokemonService));

    // Esperar a que todas las promesas se resuelvan usando Promise.all
    Promise.all(teamPromises)
      .then((teams: Team[]) => {
        this.teams = teams; // Asignar los equipos resueltos a this.teams
        console.log('Equipos cargados desde JSON:', this.teams);
        this.fetchPokemonImages(); // Llamar a fetchPokemonImages después de cargar los equipos
      })
      .catch((error) => {
        console.error('Error creando equipos:', error);
      });
  }

  openTeam(team: Team){
    this.router.navigate(['/teams']);
  }

  fetchPokemonImages(): void {
    debugger;
    this.teams.forEach(team =>{
      team.pokemons.forEach(pokemon => {
        this.pokemonService.getPokemonByName(pokemon.name).subscribe(
          pokemonData => {
            pokemon.image = pokemonData.sprites.front_default;
            // También podrías guardar otros detalles necesarios aquí
          },
          error => {
            console.error(`Error al obtener imagen de ${pokemon.name}`, error);
          }
        );
      });
    });
  }

  togglePokemonDetails(index: number): void {
    if (this.expandedPokemonDetails.includes(index)) {
      this.expandedPokemonDetails = this.expandedPokemonDetails.filter(i => i !== index);
    } else {
      this.expandedPokemonDetails.push(index);
    }
  }
}
