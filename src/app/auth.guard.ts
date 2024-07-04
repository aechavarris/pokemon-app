import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Observable<boolean> {
    let isLoggedIn = false;
    
    // Check if the user is logged in by subscribing to loggedUser$
    this.authService.loggedUser$.subscribe(user => {
      isLoggedIn = !!user;
    });
    
    if (isLoggedIn) {
      return true;
    } else {
      // Redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
