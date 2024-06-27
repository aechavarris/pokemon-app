// team-strength.component.ts
import { Component, Input } from '@angular/core';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-team-strength',
  templateUrl: './team-strength.component.html'
})
export class TeamStrengthComponent {
  @Input() team: Team;

  // Lógica para calcular fortalezas y debilidades
}
