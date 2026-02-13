import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  collapsed = false;
  isMobileView = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.checkViewport();
  }

  @HostListener('window:resize')
  checkViewport() {
    this.isMobileView = window.innerWidth < 900;
    if (this.isMobileView) {
      this.collapsed = true;
    }
  }

  toggleCollapse() {
    if (!this.isMobileView) {
      this.collapsed = !this.collapsed;
    }
  }
}