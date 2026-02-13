import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  searchTerm: string = '';
  filterStatus: string = 'all';
  filterPriority: string = 'all';
  lastUpdated: Date = new Date();
  
  changeRequests: ChangeRequest[] = [];
  filteredRequests: ChangeRequest[] = [];
  totalCount: number = 0;
  inProgressCount: number = 0;
  approvedCount: number = 0;
  criticalCount: number = 0;
  lastWeekCount: number = 0;

  constructor(
    private crService: ChangeRequestService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChangeRequests();
    
    // Subscribe to router events to reload when navigating back to this page
    this.router.events.subscribe((event) => {
      if (event.constructor.name === 'NavigationEnd') {
        // Check if we're on the list page
        if (this.router.url === '/change-requests') {
          this.loadChangeRequests();
        }
      }
    });
  }

  loadChangeRequests(): void {
    // Get fresh data from service (which reads from localStorage)
    this.changeRequests = this.crService.getChangeRequests();
    this.filteredRequests = [...this.changeRequests];
    this.updateSummaryCounts();
    this.applyFilters();
    this.lastUpdated = new Date();
    
    console.log('Loaded change requests:', this.changeRequests.length); // Debug log
  }

  updateSummaryCounts(): void {
    this.totalCount = this.changeRequests.length;
    
    this.inProgressCount = this.changeRequests.filter(cr => 
      ['In Progress', 'Submitted', 'Under Review'].includes(cr.status)
    ).length;

    this.approvedCount = this.changeRequests.filter(cr => 
      cr.status === 'Approved'
    ).length;

    this.criticalCount = this.changeRequests.filter(cr => 
      cr.priority === 'Critical'
    ).length;

    // Calculate last week's new requests
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    this.lastWeekCount = this.changeRequests.filter(cr => 
      new Date(cr.requestedDate) >= oneWeekAgo
    ).length;
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

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatus = 'all';
    this.filterPriority = 'all';
    this.applyFilters();
  }

  isFilterActive(): boolean {
    return !!(this.searchTerm || this.filterStatus !== 'all' || this.filterPriority !== 'all');
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Draft': 'status-draft',
      'Submitted': 'status-submitted',
      'Under Review': 'status-review',
      'In Progress': 'status-in-progress',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'Implemented': 'status-implemented',
      'Closed': 'status-closed'
    };
    return classes[status] || 'status-draft';
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'Low': 'priority-low',
      'Medium': 'priority-medium',
      'High': 'priority-high',
      'Critical': 'priority-critical'
    };
    return classes[priority] || 'priority-medium';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'Draft': '📝',
      'Submitted': '📤',
      'Under Review': '🔍',
      'In Progress': '🔄',
      'Approved': '✅',
      'Rejected': '❌',
      'Implemented': '🛠️',
      'Closed': '🔒'
    };
    return icons[status] || '📄';
  }

  getPriorityIcon(priority: string): string {
    const icons: { [key: string]: string } = {
      'Low': '🟢',
      'Medium': '🟡',
      'High': '🟠',
      'Critical': '🔴'
    };
    return icons[priority] || '⚪';
  }

  getRelativeDate(date: Date): string {
    const now = new Date();
    const then = new Date(date);
    const diffDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  deleteChangeRequest(id: string): void {
    if (confirm('Are you sure you want to delete this change request? This action cannot be undone.')) {
      this.crService.deleteChangeRequest(id);
      this.loadChangeRequests(); // Reload the list
    }
  }

  exportToWord(cr: ChangeRequest): void {
    this.crService.exportToWord(cr);
  }

  exportAllToExcel(): void {
    console.log('Exporting all to Excel');
    alert('Export feature coming soon!');
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Debug methods - remove in production
  testLocalStorage(): void {
    const data = localStorage.getItem('change_requests');
    console.log('Raw localStorage data:', data);
    
    if (data) {
      const requests = JSON.parse(data);
      alert(`Found ${requests.length} change requests in storage. Check console for details.`);
    } else {
      alert('No data found in localStorage');
    }
  }

  clearAllData(): void {
    if (confirm('Are you sure you want to clear ALL change requests?')) {
      localStorage.removeItem('change_requests');
      this.loadChangeRequests();
      alert('All data cleared');
    }
  }
}