import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { read, utils } from 'xlsx';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Team, createTeamFromJson } from '../../models/team.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TeamService } from 'src/app/services/team.service';

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
    private authService: AuthService,
    private teamService: TeamService
  ) {
    this.physicalAttackIconUrl = this._sanitizer.bypassSecurityTrustResourceUrl('assets/icon/power.png');
    this.statusIconUrl = this._sanitizer.bypassSecurityTrustResourceUrl('assets/icon/status.png');
  }

  async ngOnInit(): Promise<void> {
    this.teams = await this.teamService.getTeams();
    console.log('Equipos cargados correctamente ' + this.teams)
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

  deleteTeam(team: Team) {
    this.teamService.deleteTeam(team);
  }

  editTeam(team: Team) {
    this.teamService.deleteTeam(team);
  }

  duplicateTeam(team: Team) {
    this.teamService.duplicateTeam(team);
  }

}
