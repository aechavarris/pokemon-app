// src/app/components/team-list/team-list.component.ts
import { TeamService } from '../../services/team.service';
import { Team, createTeamFromJson } from '../../models/team.model';
import { HttpClient } from '@angular/common/http';
import { read, utils } from 'xlsx';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, catchError, map } from 'rxjs';
@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent implements OnInit {

  teams: Team[] = [];
  expandedPokemonDetails: any[] = [];
  pokemonImages: string[] = [];
  expandedTeamIndex: number | null = null;
  pokemonTypes: { name: string }[] = [
    { name: 'normal' },
    { name: 'fire' },
    { name: 'water' },
    { name: 'electric' },
    { name: 'grass' },
    { name: 'ice' },
    { name: 'fighting' },
    { name: 'poison' },
    { name: 'ground' },
    { name: 'flying' },
    { name: 'psychic' },
    { name: 'bug' },
    { name: 'rock' },
    { name: 'ghost' },
    { name: 'dragon' },
    { name: 'dark' },
    { name: 'steel' },
    { name: 'fairy' }
  ];
  typeImageUrls: { name: string, url: Observable<SafeResourceUrl> }[] = [];
  constructor(private http: HttpClient, private router: Router, private pokemonService: PokemonService,private _sanitizer: DomSanitizer) {
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
        this.fetchPokemonImages();
      })
      .catch((error) => {
        console.error('Error creando equipos:', error);
      });
  }

  openTeam(team: Team){
    this.router.navigate(['/team-editor/{' + team.id + '}']);
  }

  fetchPokemonImages(): void {
    
    this.teams.forEach(team =>{
      team.pokemons.forEach(pokemon => {
        this.pokemonService.getPokemonByName(pokemon.name).then(
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

  getSVGImageUrl(typeName: string): Observable<SafeResourceUrl> {
    const svgUrl = `/assets/icon/${typeName}.svg`;

    return this.http.get(svgUrl, { responseType: 'text' }).pipe(
      map(svg => {
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
      }),
      catchError(err => {
        console.error('Error loading SVG:', err);
        throw err;
      })
    );
  }
}
