import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="app-sidebar">
      <ul>
        <li><a routerLink="/generator" routerLinkActive="active">Generator</a></li>
        <li><a routerLink="/config" routerLinkActive="active">Configuration</a></li>
        <li><a routerLink="/change-requests" routerLinkActive="active">Change Requests</a></li>
        <li><a routerLink="/admin/logs" routerLinkActive="active">Admin Logs</a></li>
        <li><a routerLink="/login" routerLinkActive="active">Login</a></li>
      </ul>
    </nav>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {}
