import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header">
      <div class="brand">
        <h1>Documentation Requirements Generator</h1>
        <p class="subtitle">Generate documentation requirements for your product releases</p>
      </div>

      <nav class="top-nav">
        <a routerLink="/generator" routerLinkActive="active">📋 Generator</a>
        <a routerLink="/config" routerLinkActive="active">⚙️ Configuration</a>
        <a routerLink="/change-requests" routerLinkActive="active">📝 Change Requests</a>
        <a *ngIf="authService.isAdmin()" routerLink="/admin/logs" routerLinkActive="active">🔒 Admin Logs</a>
        <a class="logout" *ngIf="authService.getCurrentUser()" (click)="logout()">🚪 Logout ({{ authService.getCurrentUser()?.name }})</a>
        <a class="login" *ngIf="!authService.getCurrentUser()" routerLink="/login">🔑 Login</a>
      </nav>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
