import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  returnUrl: string = '/generator';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/generator';
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call delay
    setTimeout(() => {
      const isAuthenticated = this.authService.login(this.username, this.password);
      
      if (isAuthenticated) {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.errorMessage = 'Invalid username or password';
        this.password = '';
      }
      
      this.isLoading = false;
    }, 500);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  getDemoCredentials(): { username: string, password: string, role: string }[] {
    return [
      { username: 'admin', password: 'password123', role: 'Administrator' },
      { username: 'user1', password: 'password123', role: 'Regular User' },
      { username: 'qa', password: 'password123', role: 'QA Tester' }
    ];
  }
}