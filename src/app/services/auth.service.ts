// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
import { User, createUserFromJson } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];
  private loggedUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  loggedUser$ = this.loggedUserSubject.asObservable(); // Observable for components to subscribe

  workbook!: XLSX.WorkBook;

  constructor(private http: HttpClient) {
    this.loadExcelFile();
    this.loadLoggedUserFromLocalStorage();
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
  }

  login(username: string, password: string): Observable<any> {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.loggedUserSubject.next(user);
      this.saveLoggedUserToLocalStorage(user);
      return of({ success: true, user });
    } else {
      return of({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  }

  registerUser(newUserJson: any): void {
    const newUser = createUserFromJson(newUserJson);
    this.users.push(newUser); // Agregarlo localmente a la lista de usuarios
  }

  saveUsers() {
    const worksheet = XLSX.utils.json_to_sheet(this.users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users.xlsx');
  }

  private saveLoggedUserToLocalStorage(user: User): void {
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  private loadLoggedUserFromLocalStorage(): void {
    const userJson = localStorage.getItem('loggedUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.loggedUserSubject.next(user);
    }
  }

  logout(): void {
    this.loggedUserSubject.next(null);
    localStorage.removeItem('loggedUser');
  }
}
