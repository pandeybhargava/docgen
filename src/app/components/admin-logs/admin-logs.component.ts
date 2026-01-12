import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import
import { RouterModule,RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService,LoginRecord } from '../auth/auth.service';

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RouterLink , RouterLinkActive],
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.css']
})
export class AdminLogsComponent {
  loginLogs: LoginRecord[] = [];
  filteredLogs: LoginRecord[] = [];
  filterStatus: string = 'all';
  filterUser: string = '';

  constructor(public  authService: AuthService) {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loginLogs = this.authService.getLoginLogs().reverse(); // Show latest first
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredLogs = this.loginLogs.filter(log => {
      const statusMatch = this.filterStatus === 'all' || log.status === this.filterStatus;
      const userMatch = !this.filterUser || log.username.toLowerCase().includes(this.filterUser.toLowerCase());
      return statusMatch && userMatch;
    });
  }

  clearLogs(): void {
    if (confirm('Are you sure you want to clear all login logs?')) {
      this.authService.clearLoginLogs();
      this.loadLogs();
    }
  }

  downloadLogs(): void {
    this.authService.downloadLoginLogs();
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }

  getStatusClass(status: string): string {
    return status === 'success' ? 'status-success' : 'status-failed';
  }

  getStatusIcon(status: string): string {
    return status === 'success' ? '✅' : '❌';
  }
}