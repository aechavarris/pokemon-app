// auth.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: any[] = [];

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    const workbook = XLSX.readFile('users.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    this.users = XLSX.utils.sheet_to_json(sheet);
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    return !!user;
  }

  register(username: string, password: string) {
    this.users.push({ username, password });
    this.saveUsers();
  }

  saveUsers() {
    const worksheet = XLSX.utils.json_to_sheet(this.users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users.xlsx');
  }
}
