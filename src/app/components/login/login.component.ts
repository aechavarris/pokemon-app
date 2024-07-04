import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loggedUser$.subscribe(user => {
      if (user) {
        // Usuario está autenticado, redirigir a la página de equipos
        this.router.navigate(['/teams']);
      }else{
        
      }
    });
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/teams']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        console.error('Error en el inicio de sesión:', error);
      }
    });
  }
}
