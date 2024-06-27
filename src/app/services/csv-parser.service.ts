// csv-parser.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Papa } from 'papaparse';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {

  constructor(private http: HttpClient) { }

  parseUsersFromCsv(csvFilePath: string): Observable<User[]> {
    return this.http.get(csvFilePath, { responseType: 'text' }).pipe(
      map(data => {
        const parsedData = Papa.parse(data, { header: true });
        return parsedData.data as User[];
      })
    );
  }

  // Puedes agregar métodos similares para otros modelos

}
