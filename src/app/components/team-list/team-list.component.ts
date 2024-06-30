import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { read, utils } from 'xlsx';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Team, createTeamFromJson } from '../../models/team.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent implements OnInit {

  teams: Team[] = [];
  expandedTeamIndex: number | null = null;
  loggedUser: User | null = null;
  physicalAttackIconUrl: SafeResourceUrl;
  statusIconUrl: SafeResourceUrl;

  constructor(
    private http: HttpClient,
    private pokemonService: PokemonService,
    private _sanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    this.physicalAttackIconUrl = this._sanitizer.bypassSecurityTrustResourceUrl('assets/icon/power.png');
    this.statusIconUrl = this._sanitizer.bypassSecurityTrustResourceUrl('assets/icon/status.png');
  }

  ngOnInit(): void {
    this.loadExcelFile();
  }

  loadExcelFile() {
    this.http.get('assets/data/pokemon_app_data.xlsx', { responseType: 'arraybuffer' })
      .subscribe((data: ArrayBuffer) => {
        this.authService.loggedUser$.subscribe(user => {
          this.loggedUser = user;
          if (this.loggedUser) {
            this.processExcel(data);
          } else {
            console.error('Usuario no logueado.');
          }
        });
      }, error => {
        console.error('Error al cargar el archivo Excel:', error);
      });
  }

  processExcel(data: ArrayBuffer) {
    const workbook = read(data, { type: 'array' });
    const worksheet = workbook.Sheets['Teams'];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

    if (!this.loggedUser) {
      console.error('Usuario no logueado.');
      return;
    }
    const teamsForUser = jsonData.filter((json: any) => json[1] === this.loggedUser!.id);
    const teamPromises = teamsForUser.map((jsonData: any) => createTeamFromJson(jsonData, this.pokemonService));

    Promise.all(teamPromises)
      .then((teams: Team[]) => {
        this.teams = teams;
        console.log('Equipos cargados desde JSON:', this.teams);
        this.fetchPokemonDetails();
      })
      .catch((error) => {
        console.error('Error creando equipos:', error);
      });
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

  getStatColor(value: number): string {
    if (value < 40) {
      return '#3498db'; // Azul
    } else if (value < 80) {
      return '#2ecc71'; // Verde
    } else if (value < 120) {
      return '#f1c40f'; // Amarillo
    } else if (value < 160) {
      return '#f39c12'; // Naranja
    } else {
      return '#e74c3c'; // Rojo
    }
  }

  toggleTeamDetails(index: number): void {
    if (this.expandedTeamIndex === index) {
      this.expandedTeamIndex = null;
    } else {
      this.expandedTeamIndex = index;
    }
  }

  getDetailImageSize(): string {
    return '60%'; // Tamaño de imagen reducido al 60% del original
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  getIonIconName(typeName: string): string {
    return `src/assets/icon/${typeName.toLowerCase()}.svg`;
  }
}
