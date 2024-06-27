// src/app/components/team-list/team-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Team, createTeamFromJson } from '../../models/team.model';
import { HttpClient } from '@angular/common/http';
import { read, utils } from 'xlsx';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent implements OnInit {

  teams: Team[] = [];
  constructor(private http: HttpClient) {
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
    debugger;
    this.teams = jsonData.map((jsonData: any) => createTeamFromJson(jsonData));
      console.log('Usuarios cargados desde JSON:', this.teams);
    console.log('Datos del archivo Excel:', jsonData);
    // Aquí puedes procesar los datos del archivo Excel según tus necesidades
  }

}
