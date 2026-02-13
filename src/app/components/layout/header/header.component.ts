import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  showUserMenu: boolean = false;
  pendingChangeRequests: number = 3; // This would come from a service

  constructor(public authService: AuthService, private router: Router) {}

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.showUserMenu = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showUserMenu = false;
  }
}