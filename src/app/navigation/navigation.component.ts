import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkAuthStatus();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.isLoggedIn = false;
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  private checkAuthStatus() {
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isLoggedIn = isAuth;
    });
  }
}
