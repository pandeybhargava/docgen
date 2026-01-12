import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ChangeRequestService, ChangeRequest } from '../../service/change-request.service';

@Component({
  selector: 'app-change-request-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './change-request-list.component.html',
  styleUrls: ['./change-request-list.component.css']
})
export class ChangeRequestListComponent implements OnInit {
  changeRequests: ChangeRequest[] = [];
  filteredRequests: ChangeRequest[] = [];
  searchTerm: string = '';
  filterStatus: string = 'all';
  filterPriority: string = 'all';
  currentUser: any;

  // Summary counts
  totalCount: number = 0;
  inProgressCount: number = 0;
  approvedCount: number = 0;
  criticalCount: number = 0;

  constructor(
    private crService: ChangeRequestService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadChangeRequests();
  }

  loadChangeRequests(): void {
    this.changeRequests = this.crService.getChangeRequests();
    this.applyFilters();
    this.updateSummaryCounts();
  }

  applyFilters(): void {
    this.filteredRequests = this.changeRequests.filter(cr => {
      const matchesSearch = !this.searchTerm || 
        cr.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cr.crNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cr.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.filterStatus === 'all' || cr.status === this.filterStatus;
      const matchesPriority = this.filterPriority === 'all' || cr.priority === this.filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  updateSummaryCounts(): void {
    this.totalCount = this.changeRequests.length;
    
    this.inProgressCount = this.changeRequests.filter(cr => 
      ['Submitted', 'Under Review', 'Approved'].includes(cr.status)
    ).length;

    this.approvedCount = this.changeRequests.filter(cr => 
      cr.status === 'Approved'
    ).length;

    this.criticalCount = this.changeRequests.filter(cr => 
      cr.priority === 'Critical'
    ).length;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Draft': 'status-draft',
      'Submitted': 'status-submitted',
      'Under Review': 'status-review',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'Implemented': 'status-implemented',
      'Closed': 'status-closed'
    };
    return classes[status] || 'status-default';
  }

  getPriorityClass(priority: string): string {
    const classes: Record<string, string> = {
      'Low': 'priority-low',
      'Medium': 'priority-medium',
      'High': 'priority-high',
      'Critical': 'priority-critical'
    };
    return classes[priority] || 'priority-default';
  }

  deleteChangeRequest(id: string): void {
    if (confirm('Are you sure you want to delete this change request?')) {
      this.crService.deleteChangeRequest(id);
      this.loadChangeRequests();
    }
  }

  exportToWord(cr: ChangeRequest): void {
    this.crService.exportToWord(cr);
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      'Draft': '📝',
      'Submitted': '📤',
      'Under Review': '🔍',
      'Approved': '✅',
      'Rejected': '❌',
      'Implemented': '🛠️',
      'Closed': '🔒'
    };
    return icons[status] || '📄';
  }

  logout(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}