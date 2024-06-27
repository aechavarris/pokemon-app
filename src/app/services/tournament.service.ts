// tournament.service.ts
import { Injectable } from '@angular/core';
import { Tournament } from '../models/tournament.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private tournaments: Tournament[] = [];

  getTournaments(): Tournament[] {
    return this.tournaments;
  }

  createTournament(tournament: Tournament) {
    this.tournaments.push(tournament);
    // Guardar en archivo Excel
  }

  updateTournament(tournament: Tournament) {
    const index = this.tournaments.findIndex(t => t.id === tournament.id);
    if (index !== -1) {
      this.tournaments[index] = tournament;
      // Guardar en archivo Excel
    }
  }
}
