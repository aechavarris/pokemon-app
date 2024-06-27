// team.service.ts
import { Injectable } from '@angular/core';
import { Team } from './team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teams: Team[] = [];

  getTeams(userId: number): Team[] {
    return this.teams.filter(team => team.userId === userId);
  }

  saveTeam(userId: number, team: Team) {
    this.teams.push({ ...team, userId });
    // Guardar en archivo Excel
  }
}
