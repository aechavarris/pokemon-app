// src/app/components/tournament-list/tournament-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament.model';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.scss'],
})
export class TournamentListComponent implements OnInit {
  tournaments: Tournament[] = [];

  constructor(private tournamentService: TournamentService) {}

  ngOnInit() {
    this.tournaments = this.tournamentService.getTournaments();
  }
}
