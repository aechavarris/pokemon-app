// team.service.ts
import { Injectable } from '@angular/core';
import { Team, createTeamFromJson } from '../models/team.model';
import { WorkBook, read, utils } from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teams: Team[] = [];

  private teamsSheetName: string = 'Teams'; // Nombre de la hoja para equipos en el archivo XLSX
  private workbook!: WorkBook;

  loadWorkbook(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        this.workbook = read(data, { type: 'array' });
        resolve();
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  getTeams(): any[] {
    const worksheet = this.workbook.Sheets[this.teamsSheetName];
    return utils.sheet_to_json(worksheet, { header: 1 });
  }

  saveTeam(team: any): void {
    const worksheet = this.workbook.Sheets[this.teamsSheetName];
    utils.sheet_add_json(worksheet, [team], { header: ['id', 'name', 'pokemon1', 'pokemon2', 'pokemon3', 'pokemon4', 'pokemon5', 'pokemon6', 'ability', 'moves', 'stats', 'item'], skipHeader: true });
    // Lógica para guardar en el archivo XLSX o base de datos
    // ...
  }

  registerTeam(newTeamJson: any): void {
    const newTeam = createTeamFromJson(newTeamJson);
    // Aquí podrías enviar el nuevo equipo a tu API o agregarlo a tu base de datos local
    this.teams.push(newTeam); // Agregarlo localmente a la lista de equipos
  }
}
