// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { User, createUserFromJson } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];
 workbook!: XLSX.WorkBook;

  constructor(private http: HttpClient) {
    this.loadExcelFile();
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
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets['Users'];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    this.users = jsonData.map((jsonData: any) => createUserFromJson(jsonData));
      console.log('Usuarios cargados desde JSON:', this.users);
    console.log('Datos del archivo Excel:', jsonData);
    // Aquí puedes procesar los datos del archivo Excel según tus necesidades
  }

  login(username: string, password: string): Observable<any> {
    debugger;
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      return of({ success: true, user });
    } else {
      return of({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  }

  registerUser(newUserJson: any): void {
    const newUser = createUserFromJson(newUserJson);
    // Aquí podrías enviar el nuevo usuario a tu API o agregarlo a tu base de datos local
    this.users.push(newUser); // Agregarlo localmente a la lista de usuarios
  }

  saveUsers() {
    const worksheet = XLSX.utils.json_to_sheet(this.users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users.xlsx');
  }
}
