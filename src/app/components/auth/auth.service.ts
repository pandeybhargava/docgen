import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  username: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginRecord {
  username: string;
  timestamp: string;
  status: 'success' | 'failed';
  ip?: string;
  userAgent?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private readonly validUsers: User[] = [
    { username: 'admin', name: 'Administrator', role: 'admin' },
    { username: 'user1', name: 'John Doe', role: 'user' },
    { username: 'user2', name: 'Jane Smith', role: 'user' },
    { username: 'qa', name: 'QA Tester', role: 'user' }
  ];
  
  private readonly storageKey = 'docgen-auth';
  private readonly logFileName = 'login_log.txt';

  constructor(private router: Router) {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem(this.storageKey);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(username: string, password: string): boolean {
    // Simple authentication - in real app, this would call an API
    // Default password for all users is "password123"
    const isValidPassword = password === 'password123';
    const user = this.validUsers.find(u => u.username === username);
    
    if (user && isValidPassword) {
      this.currentUser = user;
      localStorage.setItem(this.storageKey, JSON.stringify(user));
      
      // Log successful login
      this.logLogin(username, 'success');
      return true;
    }
    
    // Log failed login
    this.logLogin(username, 'failed');
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  private async logLogin(username: string, status: 'success' | 'failed'): Promise<void> {
    try {
      const record: LoginRecord = {
        username,
        timestamp: new Date().toISOString(),
        status,
        ip: await this.getClientIP(),
        userAgent: navigator.userAgent
      };

      // Format log entry
      const logEntry = this.formatLogEntry(record);
      
      // Save to localStorage as backup
      this.saveToLocalStorage(record);
      
      // Create downloadable log file
      this.saveToLogFile(logEntry);
      
    } catch (error) {
      console.error('Failed to log login:', error);
    }
  }

  private formatLogEntry(record: LoginRecord): string {
    const date = new Date(record.timestamp).toLocaleString();
    return `[${date}] ${record.status.toUpperCase()} login attempt - User: ${record.username}, IP: ${record.ip}, Browser: ${record.userAgent?.substring(0, 50)}...\n`;
  }

  private saveToLocalStorage(record: LoginRecord): void {
    try {
      const logsKey = 'login_logs';
      const existingLogs = localStorage.getItem(logsKey);
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      
      // Keep only last 100 logs
      logs.push(record);
      if (logs.length > 100) {
        logs.shift();
      }
      
      localStorage.setItem(logsKey, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save log to localStorage:', error);
    }
  }

  private saveToLogFile(logEntry: string): void {
    try {
      // For security reasons, we can't directly write to filesystem
      // So we'll create a blob and simulate file download on first login
      const existingLogs = localStorage.getItem(this.logFileName) || '';
      const updatedLogs = existingLogs + logEntry;
      localStorage.setItem(this.logFileName, updatedLogs);
      
    } catch (error) {
      console.error('Failed to save log file:', error);
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      // Try to get IP from a free API
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  downloadLoginLogs(): void {
    const logs = localStorage.getItem(this.logFileName) || 'No login logs available.';
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `login_log_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getLoginLogs(): LoginRecord[] {
    const logsKey = 'login_logs';
    const logs = localStorage.getItem(logsKey);
    return logs ? JSON.parse(logs) : [];
  }

  clearLoginLogs(): void {
    localStorage.removeItem('login_logs');
    localStorage.removeItem(this.logFileName);
  }
}