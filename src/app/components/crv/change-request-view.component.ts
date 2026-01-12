import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ChangeRequestService, ChangeRequest } from '../../service/change-request.service';

@Component({
  selector: 'app-change-request-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-request-view.component.html',
  styleUrls: ['./change-request-view.component.css']
})
export class ChangeRequestViewComponent implements OnInit {
  changeRequest: ChangeRequest | null = null;
  currentUser: any;
  isLoading: boolean = true;
  errorMessage: string = '';
  
  // Tabs
  activeTab: string = 'overview';
  
  // Comments
  newComment: string = '';
  approvalComment: string = '';
  
  // Status change
  newStatus: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Implemented' | 'Closed' = 'Draft';
  statusChangeComment: string = '';

  constructor(
    private crService: ChangeRequestService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadChangeRequest(id);
    } else {
      this.router.navigate(['/change-requests']);
    }
  }

  loadChangeRequest(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Remove setTimeout and load immediately
    const cr = this.crService.getChangeRequestById(id);
    
    if (cr) {
      this.changeRequest = cr;
      this.newStatus = cr.status;
      this.isLoading = false;
    } else {
      this.errorMessage = 'Change Request not found!';
      this.isLoading = false;
      setTimeout(() => {
        this.router.navigate(['/change-requests']);
      }, 2000);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  addComment(): void {
    if (this.newComment.trim() && this.changeRequest) {
      this.changeRequest.history.push({
        date: new Date(),
        user: this.currentUser?.name || 'Unknown',
        action: 'Comment Added',
        comments: this.newComment
      });
      
      this.crService.saveChangeRequest(this.changeRequest);
      this.newComment = '';
      
      // Add to service history
      this.crService.addHistoryEntry(
        this.changeRequest.id,
        this.currentUser?.name || 'Unknown',
        'Comment Added',
        this.newComment
      );
    }
  }

  approveChangeRequest(): void {
    if (this.changeRequest && this.approvalComment.trim()) {
      this.changeRequest.status = 'Approved';
      this.newStatus = 'Approved';
      
      // Update stakeholder status
      const userStakeholder = this.changeRequest.stakeholders.find(
        s => s.name === this.currentUser?.name
      );
      if (userStakeholder) {
        userStakeholder.status = 'Approved';
        userStakeholder.comments = this.approvalComment;
        userStakeholder.date = new Date();
      }
      
      // Add to history
      this.changeRequest.history.push({
        date: new Date(),
        user: this.currentUser?.name || 'Unknown',
        action: 'Change Request Approved',
        comments: this.approvalComment
      });
      
      this.crService.saveChangeRequest(this.changeRequest);
      this.approvalComment = '';
      
      alert('Change Request has been approved!');
    }
  }

  rejectChangeRequest(): void {
    if (this.changeRequest && this.approvalComment.trim()) {
      this.changeRequest.status = 'Rejected';
      this.newStatus = 'Rejected';
      
      // Update stakeholder status
      const userStakeholder = this.changeRequest.stakeholders.find(
        s => s.name === this.currentUser?.name
      );
      if (userStakeholder) {
        userStakeholder.status = 'Rejected';
        userStakeholder.comments = this.approvalComment;
        userStakeholder.date = new Date();
      }
      
      // Add to history
      this.changeRequest.history.push({
        date: new Date(),
        user: this.currentUser?.name || 'Unknown',
        action: 'Change Request Rejected',
        comments: this.approvalComment
      });
      
      this.crService.saveChangeRequest(this.changeRequest);
      this.approvalComment = '';
      
      alert('Change Request has been rejected!');
    }
  }

  updateStatus(): void {
    if (this.changeRequest && this.statusChangeComment.trim() && this.newStatus) {
      const oldStatus = this.changeRequest.status;
      this.changeRequest.status = this.newStatus;
      
      // Add to history
      this.changeRequest.history.push({
        date: new Date(),
        user: this.currentUser?.name || 'Unknown',
        action: `Status Changed from ${oldStatus} to ${this.newStatus}`,
        comments: this.statusChangeComment
      });
      
      this.crService.saveChangeRequest(this.changeRequest);
      this.statusChangeComment = '';
      
      alert('Status has been updated!');
    }
  }

  exportToWord(): void {
    if (this.changeRequest) {
      this.crService.exportToWord(this.changeRequest);
    }
  }

  goBack(): void {
    this.router.navigate(['/change-requests']);
  }

  editChangeRequest(): void {
    if (this.changeRequest) {
      this.router.navigate(['/change-requests', this.changeRequest.id, 'edit']);
    }
  }

  deleteChangeRequest(): void {
    if (this.changeRequest && confirm('Are you sure you want to delete this change request?')) {
      this.crService.deleteChangeRequest(this.changeRequest.id);
      alert('Change Request deleted successfully!');
      this.router.navigate(['/change-requests']);
    }
  }

  getDocumentProgress(): number {
    if (!this.changeRequest || this.changeRequest.impactedDocuments.length === 0) {
      return 0;
    }
    const completed = this.changeRequest.impactedDocuments.filter(
      doc => doc.status === 'Completed'
    ).length;
    return (completed / this.changeRequest.impactedDocuments.length) * 100;
  }

  getCompletedDocuments(): number {
    if (!this.changeRequest) return 0;
    return this.changeRequest.impactedDocuments.filter(
      doc => doc.status === 'Completed'
    ).length;
  }

  getApprovalProgress(): number {
    if (!this.changeRequest || this.changeRequest.stakeholders.length === 0) {
      return 0;
    }
    const approved = this.changeRequest.stakeholders.filter(
      s => s.status === 'Approved'
    ).length;
    return (approved / this.changeRequest.stakeholders.length) * 100;
  }

  getApprovedStakeholders(): number {
    if (!this.changeRequest) return 0;
    return this.changeRequest.stakeholders.filter(
      s => s.status === 'Approved'
    ).length;
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

  getStakeholderStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Pending': 'stakeholder-pending',
      'Approved': 'stakeholder-approved',
      'Rejected': 'stakeholder-rejected'
    };
    return classes[status] || 'stakeholder-default';
  }

  getDocumentStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Not Started': 'doc-not-started',
      'In Progress': 'doc-in-progress',
      'Completed': 'doc-completed',
      'Not Required': 'doc-not-required'
    };
    return classes[status] || 'doc-default';
  }

  isApprover(): boolean {
    if (!this.changeRequest || !this.currentUser) return false;
    return this.changeRequest.stakeholders.some(
      s => s.name === this.currentUser.name && s.role === 'Approver'
    );
  }

  canEdit(): boolean {
    return this.changeRequest?.status === 'Draft' || this.authService.isAdmin();
  }

  canDelete(): boolean {
    return this.changeRequest?.status === 'Draft' || this.authService.isAdmin();
  }
}