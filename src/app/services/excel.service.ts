import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  // Función para cargar datos de un archivo XLSX
  public loadExcelFile(file: File): Observable<any> {
    return from(new Observable(observer => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const result = {
          teams: this.extractData(workbook, 'Teams'),
          tournaments: this.extractData(workbook, 'Tournaments'),
          matches: this.extractData(workbook, 'Matches'),
          users: this.extractData(workbook, 'Users'),
          pokemon: this.extractData(workbook, 'Pokemon')
        };

        observer.next(result);
        observer.complete();
      };

      fileReader.onerror = (error) => {
        observer.error(error);
      };
    }));
  }

  // Función para extraer datos de una hoja específica
  private extractData(workbook: XLSX.WorkBook, sheetName: string): any[] {
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  }
}
