import { Team, createTeamFromJson } from '../models/team.model';
import { WorkBook, read, utils, writeFile, writeXLSX } from 'xlsx';
import { PokemonService } from './pokemon.service';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teams: Team[] = [];
  private teamsSheetName: string = 'Teams'; // Nombre de la hoja para equipos en el archivo XLSX
  private workbook!: WorkBook;
  loggedUser: User | null = null;
  constructor(
    private pokemonService: PokemonService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.authService.loggedUser$.subscribe(user => {
      this.loggedUser = user;
      if (this.loggedUser) {
        this.loadExcelFile()
      } else {
        console.error('Usuario no logueado.');
      }
    });
  }

  async loadExcelFile(): Promise<void> {
    try {
      const data: any = await this.http.get('assets/data/pokemon_app_data.xlsx', { responseType: 'arraybuffer' }).toPromise();
      const user = await this.authService.loggedUser$.toPromise();
      if (user) {
        this.loggedUser = user;
        this.workbook = read(data, { type: 'array' });
        console.log('Workbook cargado exitosamente.');
      } else {
        console.error('Usuario no logueado.');
      }
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

  fetchPokemonDetails(): void {
    this.teams.forEach(team => {
      team.pokemons.map(async pokemon => {
        const promises: Promise<any>[] = [];
        const imagePromise = this.pokemonService.getPokemonByName(pokemon.name)
          .then(pokemonData => {
            pokemon.image = pokemonData.sprites.front_default;
          })
          .catch(error => {
            console.error(`Error al obtener imagen de ${pokemon.name}`, error);
          });

        const itemPromise = this.pokemonService.getItemByName(pokemon.item.name)
          .then(item => {
            pokemon.item = item;
          })
          .catch(error => {
            console.error(`Error al obtener objeto de ${pokemon.name}`, error);
          });

        promises.push(imagePromise, itemPromise);

        await Promise.all(promises)
          .then(() => {
            console.log('Detalles cargados:', this.teams);
          })
          .catch(error => {
            console.error('Error al cargar detalles de los Pokémon:', error);
          });
      });
    });
  }

  saveTeam(team: Team): void {
    const worksheet = this.workbook.Sheets[this.teamsSheetName];
    const teamJson = {
      id: team.id,
      userId: team.userId,
      name: team.name,
      pokemons: team.pokemons
    };
    utils.sheet_add_json(worksheet, [teamJson], { header: ['id', 'name', 'pokemon1', 'pokemon2', 'pokemon3', 'pokemon4', 'pokemon5', 'pokemon6', 'ability', 'moves', 'stats', 'item'], skipHeader: true });
    // Lógica para guardar en el archivo XLSX o base de datos
    // ...
  }

  async registerTeam(newTeamJson: any): Promise<void> {
    const newTeam = await createTeamFromJson(newTeamJson, this.pokemonService);
    this.teams.push(newTeam);
    this.saveTeam(newTeam);
  }

  // Función para borrar un equipo
  deleteTeam(teamId: number): void {
    this.teams = this.teams.filter(team => team.id !== teamId);
    this.updateWorksheet();
  }

  // Función para duplicar un equipo
  duplicateTeam(teamId: number): void {
    const teamToDuplicate = this.teams.find(team => team.id === teamId);
    if (teamToDuplicate) {
      const newTeam = { ...teamToDuplicate, id: this.getNextId() };
      this.teams.push(newTeam);
      this.saveTeam(newTeam);
    }
  }

  // Obtener el siguiente ID disponible
  private getNextId(): number {
    return this.teams.length > 0 ? Math.max(...this.teams.map(team => team.id)) + 1 : 1;
  }

  // Actualizar la hoja de cálculo después de borrar un equipo
  private updateWorksheet(): void {
    const worksheet = this.workbook.Sheets[this.teamsSheetName];
    const teamsJson : Team[] = this.teams.map((team : Team)=> ({
      id: team.id,
      userId: team.userId,
      name: team.name,
      pokemons: team.pokemons
    }) as Team);
    // Limpiar la hoja antes de actualizar
    utils.sheet_add_json(worksheet, [], { header: ['id', 'name', 'pokemon1', 'pokemon2', 'pokemon3', 'pokemon4', 'pokemon5', 'pokemon6', 'ability', 'moves', 'stats', 'item'], skipHeader: true });
    // Añadir los equipos actualizados
    utils.sheet_add_json(worksheet, teamsJson, { header: ['id', 'name', 'pokemon1', 'pokemon2', 'pokemon3', 'pokemon4', 'pokemon5', 'pokemon6', 'ability', 'moves', 'stats', 'item'], skipHeader: true });
    writeFile(this.workbook, 'assets/data/pokemon_app_data.xlsx'); 
  }
}
