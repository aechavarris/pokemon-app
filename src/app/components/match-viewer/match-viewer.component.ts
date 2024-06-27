// src/app/components/match-viewer/match-viewer.component.ts
import { Component, Input } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { Tournament, Match } from '../../models/tournament.model';

@Component({
  selector: 'app-match-viewer',
  templateUrl: './match-viewer.component.html',
  styleUrls: ['./match-viewer.component.scss'],
})
export class MatchViewerComponent {
  @Input() tournament: Tournament;

  constructor(private tournamentService: TournamentService) {}

  banTeam(match: Match, teamId: number) {
    // Lógica para banear un equipo
  }

  declareWinner(match: Match, winnerId: number) {
    match.winner = winnerId;
    match.loser = match.player1 === winnerId ? match.player2 : match.player1;
    this.tournamentService.updateTournament(this.tournament);
  }
}
