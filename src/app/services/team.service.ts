import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { read, utils, WorkBook, write, writeFile, writeFileXLSX } from 'xlsx';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Team, createTeamFromJson } from '../models/team.model';
import { PokemonService } from './pokemon.service';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teams: Team[] = [];
  private teamsSheetName: string = 'Teams';
  private workbook!: WorkBook;
  private loggedUser: User | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private pokemonService: PokemonService
  ) {
    this.loadExcelFile();
    this.authService.loggedUser$.subscribe(user => {
      this.loggedUser = user;
    });
  }

  async loadExcelFile(): Promise<void> {
    try {
      const data: any = await this.http.get('assets/data/pokemon_app_data.xlsx', { responseType: 'arraybuffer' }).toPromise();
      this.workbook = read(data, { type: 'array' });
      console.log('Workbook cargado exitosamente.');
    } catch (error) {
      console.error('Error al cargar el archivo Excel:', error);
    }
  }

  async getTeams(): Promise<Team[]> {
    await this.loadExcelFile(); // Espera a que el archivo se cargue antes de continuar
    const worksheet = this.workbook.Sheets[this.teamsSheetName];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

    if (!this.loggedUser) {
      console.error('Usuario no logueado.');
      return [];
    }

    const teamsForUser = jsonData.filter((json: any) => json[1] === this.loggedUser!.id);
    const teamPromises = teamsForUser.map((jsonData: any) => createTeamFromJson(jsonData, this.pokemonService));

    try {
      const teams = await Promise.all(teamPromises);
      this.teams = teams;
      console.log('Equipos cargados desde JSON:', this.teams);
      this.fetchPokemonDetails();
      return this.teams;
    } catch (error) {
      console.error('Error creando equipos:', error);
      return [];
    }
  }

  async registerTeam(newTeamJson: any): Promise<void> {
    const newTeam = await createTeamFromJson(newTeamJson, this.pokemonService);
    this.teams.push(newTeam);
    this.saveTeamsToFile(); // Guardar el equipo al archivo
  }

  saveTeam(team: Team): void {
    const worksheet = this.workbook.Sheets[this.teamsSheetName];
    const teamJson = {
      id: team.id,
      userId: team.userId,
      name: team.name,
      pokemons: team.pokemons.map(pokemon => pokemon.name) // Solo guardamos el nombre de los pokemons
    };
    utils.sheet_add_json(worksheet, [teamJson], { header: ['id', 'userId', 'name', 'pokemons'], skipHeader: true });
    this.saveTeamsToFile(); // Guardar los cambios al archivo
  }

  deleteTeam(team: Team): void {
    this.teams = this.teams.filter(t => t.id !== team.id);
    this.saveTeamsToFile(); // Guardar los cambios al archivo
  }

  duplicateTeam(team: Team): void {
    const teamToDuplicate = this.teams.find(t => t.id === team.id);
    if (teamToDuplicate) {
      const duplicatedTeam = { ...teamToDuplicate };
      duplicatedTeam.id = this.getNextId();
      duplicatedTeam.name += '_copy'; // Añadir '_copy' al nombre del equipo duplicado
      this.teams.push(duplicatedTeam);
      this.saveTeamsToFile(); // Guardar los cambios al archivo
    }
  }

  private async saveTeamsToFile(): Promise<void> {
    const worksheet = this.workbook.Sheets[this.teamsSheetName];
    const teamsJson = this.teams.map(team => ({
      id: team.id,
      userId: team.userId,
      name: team.name,
      pokemons: team.pokemons.map(pokemon => pokemon.name) // Solo guardamos el nombre de los pokemons
    }));

    // Primero eliminamos todas las filas existentes en la hoja de cálculo
    let range = utils.decode_range(worksheet['!ref']!);
    for (let rowNum = range.s.r + 1; rowNum <= range.e.r; ++rowNum) {
      const row = String.fromCharCode(65) + rowNum; // 'A1', 'A2', etc.
      delete worksheet[row];
    }

    // Luego agregamos los nuevos datos
    utils.sheet_add_json(worksheet, teamsJson, { header: ['id', 'userId', 'name', 'pokemons'], skipHeader: true });
    
    // Escribir el archivo XLSX
    const arrayBuffer = write(this.workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    
    // Guardar el archivo como descarga controlada
    this.saveBlobToFile(blob);
  }

  private saveBlobToFile(blob: Blob): void {
      const file = new File([blob], "/assets/data/pokemon_app_data.xlsx", {type: "xlsx"});
      FileSaver.saveAs(file);
  }


  private getNextId(): number {
    return this.teams.length > 0 ? Math.max(...this.teams.map(team => team.id)) + 1 : 1;
  }

  fetchPokemonDetails(): void {
    this.teams.forEach(team => {
      team.pokemons.forEach(async pokemon => {
        try {
          const pokemonData = await this.pokemonService.getPokemonByName(pokemon.name);
          pokemon.image = pokemonData.sprites.front_default;
          const item = await this.pokemonService.getItemByName(pokemon.item.name);
          pokemon.item = item;
          console.log('Detalles cargados para:', pokemon.name);
        } catch (error) {
          console.error('Error al cargar detalles de:', pokemon.name, error);
        }
      });
    });
  }
}
