// team-ban.component.ts
import { Component, Input } from '@angular/core';
import { Team } from '../../models/team.model';
import { Match } from '../../models/tournament.model';

@Component({
  selector: 'app-team-ban',
  templateUrl: './team-ban.component.html'
})
export class TeamBanComponent {
  @Input() teams: Team[];
  @Input() match: Match;

  banTeam(teamId: number) {
    // Lógica para banear equipos
  }
}
