import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  returnUrl: string = '/generator';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  showDemo: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/generator';
    
    // Check for saved username
    const savedUsername = localStorage.getItem('remembered_username');
    if (savedUsername) {
      this.username = savedUsername;
      this.rememberMe = true;
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Save username if remember me is checked
    if (this.rememberMe) {
      localStorage.setItem('remembered_username', this.username);
    } else {
      localStorage.removeItem('remembered_username');
    }

    // Simulate API call
    setTimeout(() => {
      const isAuthenticated = this.authService.login(this.username, this.password);
      
      if (isAuthenticated) {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.errorMessage = 'Invalid username or password';
        this.password = '';
      }
      
      this.isLoading = false;
    }, 800);
  }

  getDemoCredentials(): { username: string, password: string, role: string }[] {
    return [
      { username: 'admin', password: 'admin123', role: 'Admin' },
      { username: 'emma.wilson', password: 'demo123', role: 'Manager' },
      { username: 'michael.chen', password: 'demo123', role: 'Writer' }
    ];
  }
}