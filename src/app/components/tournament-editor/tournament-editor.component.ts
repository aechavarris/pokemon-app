// src/app/components/tournament-editor/tournament-editor.component.ts
import { Component } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament.model';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss'],
})
export class TournamentEditorComponent {
  tournaments: Tournament[] = [];
  selectedTournament: Tournament | null = null;
  participants: number[] = [];

  constructor(private tournamentService: TournamentService, private excelService: ExcelService) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.excelService.loadExcelFile(file).subscribe({
        next: (data: any) => {
          // Aquí puedes manejar los datos cargados
          console.log(data.teams);
          console.log(data.tournaments);
          console.log(data.matches);
          console.log(data.users);
          console.log(data.pokemon);
        },
        error: (error) => {
          console.error('Error al cargar el archivo:', error);
        }
      });
    }
  }
  
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
  startTournament() {
    // Logic to start the tournament
    console.log('Tournament started');
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
