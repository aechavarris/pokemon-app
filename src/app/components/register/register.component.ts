import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  username: string = '';
  password: string = '';
  name: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.registerUser({username: this.username, password: this.password});
      this.router.navigate(['/login']);
  }
}
