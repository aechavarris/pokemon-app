// src/app/components/tournament-editor/tournament-editor.component.ts
import { Component } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { Tournament, Match } from '../../models/tournament.model';

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss'],
})
export class TournamentEditorComponent {
  tournaments: Tournament[] = [];
  selectedTournament: Tournament | null = null;
  participants: number[] = [];

  constructor(private tournamentService: TournamentService) {}

  createTournament(name: string, type: 'group' | 'double-elimination') {
    const newTournament: Tournament = {
      id: Date.now(),
      name,
      type,
      participants: this.participants,
      matches: [],
    };
    this.tournamentService.createTournament(newTournament);
    this.tournaments = this.tournamentService.getTournaments();
  }

  addParticipant(participantId: number) {
    if (this.selectedTournament && !this.selectedTournament.participants.includes(participantId)) {
      this.selectedTournament.participants.push(participantId);
    }
  }

  saveTournament() {
    if (this.selectedTournament) {
      this.tournamentService.updateTournament(this.selectedTournament);
    }
  }
}
