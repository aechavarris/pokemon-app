// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username: string;
  password: string;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.username, this.password);
    this.router.navigate(['/login']);
  }
}
