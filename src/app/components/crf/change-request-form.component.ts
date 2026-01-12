import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ChangeRequestService, ChangeRequest } from '../../service/change-request.service';

@Component({
  selector: 'app-change-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-request-form.component.html',
  styleUrls: ['./change-request-form.component.css']
})
export class ChangeRequestFormComponent implements OnInit {
  isEditMode: boolean = false;
  changeRequest: ChangeRequest = this.getEmptyChangeRequest();
  currentUser: any;
  
  // Form options
  priorityOptions: string[] = [];
  typeOptions: string[] = [];
  releaseTypeOptions: string[] = [];
  statusOptions: string[] = [];
  
  // Multi-select for documents
  selectedDocuments: string[] = [];
  availableDocuments: string[] = [];
  allDocuments: string[] = [];
  
  // Stakeholder management
  stakeholders: any[] = [];
  newStakeholder: any = { name: '', role: '', department: '' };
  
  // File upload
  uploadedFiles: any[] = [];
  
  // Validation
  formErrors: string[] = [];

  constructor(
    private crService: ChangeRequestService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    // Load options
    this.priorityOptions = this.crService.getPriorityOptions();
    this.typeOptions = this.crService.getTypeOptions();
    this.releaseTypeOptions = this.crService.getReleaseTypeOptions();
    this.statusOptions = this.crService.getStatusOptions();
    this.allDocuments = this.crService.getDocumentsByReleaseType('Major Upgrade');
    
    // Check if edit mode
    const id = this.route.snapshot.params['id'];
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.loadChangeRequest(id);
    } else {
      // Generate new CR number and set defaults
      this.changeRequest.crNumber = this.crService.generateCRNumber();
      this.changeRequest.requestedBy = this.currentUser?.name || 'Unknown';
      this.changeRequest.requestedDate = new Date();
      this.changeRequest.status = 'Draft';
      
      // Load default stakeholders
      this.loadDefaultStakeholders();
      
      // Set default release type documents
      this.onReleaseTypeChange();
    }
  }

  getEmptyChangeRequest(): ChangeRequest {
    return {
      id: this.generateId(),
      crNumber: '',
      title: '',
      description: '',
      priority: 'Medium',
      type: 'Enhancement',
      releaseType: 'Minor Upgrade',
      status: 'Draft',
      requestedBy: '',
      requestedDate: new Date(),
      targetVersion: '',
      documentsRequired: [],
      impactedDocuments: [],
      stakeholders: [],
      history: [],
      attachments: [],
      riskAssessment: {
        riskLevel: 'Medium',
        impact: '',
        probability: '',
        mitigation: ''
      }
    };
  }

  generateId(): string {
    return 'cr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  loadChangeRequest(id: string): void {
    const cr = this.crService.getChangeRequestById(id);
    if (cr) {
      this.changeRequest = cr;
      this.selectedDocuments = [...cr.documentsRequired];
      this.stakeholders = [...cr.stakeholders];
      this.availableDocuments = this.crService.getDocumentsByReleaseType(cr.releaseType);
      this.uploadedFiles = [...cr.attachments];
    } else {
      alert('Change Request not found!');
      this.router.navigate(['/change-requests']);
    }
  }

  loadDefaultStakeholders(): void {
    this.stakeholders = this.crService.getStakeholderTemplates().map(s => ({
      ...s,
      status: 'Pending',
      comments: '',
      date: null
    }));
  }

  onReleaseTypeChange(): void {
    this.availableDocuments = this.crService.getDocumentsByReleaseType(this.changeRequest.releaseType);
    // Auto-select all documents for the selected release type
    this.selectedDocuments = [...this.availableDocuments];
  }

  toggleDocument(document: string): void {
    const index = this.selectedDocuments.indexOf(document);
    if (index > -1) {
      this.selectedDocuments.splice(index, 1);
    } else {
      this.selectedDocuments.push(document);
    }
  }

  isDocumentSelected(document: string): boolean {
    return this.selectedDocuments.includes(document);
  }

  selectAllDocuments(): void {
    this.selectedDocuments = [...this.availableDocuments];
  }

  deselectAllDocuments(): void {
    this.selectedDocuments = [];
  }

  addStakeholder(): void {
    if (this.newStakeholder.name && this.newStakeholder.role) {
      this.stakeholders.push({
        ...this.newStakeholder,
        status: 'Pending',
        comments: '',
        date: null
      });
      this.newStakeholder = { name: '', role: '', department: '' };
    }
  }

  removeStakeholder(index: number): void {
    this.stakeholders.splice(index, 1);
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadedFiles.push({
        name: file.name,
        size: this.formatFileSize(file.size),
        type: file.type,
        file: file,
        uploadedBy: this.currentUser?.name || 'Unknown',
        date: new Date()
      });
    }
    event.target.value = ''; // Reset file input
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  validateForm(): boolean {
    this.formErrors = [];

    if (!this.changeRequest.title.trim()) {
      this.formErrors.push('Title is required');
    }

    if (!this.changeRequest.description.trim()) {
      this.formErrors.push('Description is required');
    }

    if (this.selectedDocuments.length === 0) {
      this.formErrors.push('At least one document must be selected');
    }

    if (!this.changeRequest.targetVersion.trim()) {
      this.formErrors.push('Target version is required');
    }

    if (!this.changeRequest.riskAssessment.impact.trim()) {
      this.formErrors.push('Risk impact assessment is required');
    }

    if (!this.changeRequest.riskAssessment.probability.trim()) {
      this.formErrors.push('Risk probability assessment is required');
    }

    if (!this.changeRequest.riskAssessment.mitigation.trim()) {
      this.formErrors.push('Risk mitigation strategy is required');
    }

    return this.formErrors.length === 0;
  }

  saveDraft(): void {
    this.changeRequest.status = 'Draft';
    this.saveChangeRequest('Saved as Draft');
  }

  submitForReview(): void {
    if (this.validateForm()) {
      this.changeRequest.status = 'Submitted';
      this.saveChangeRequest('Submitted for Review');
    } else {
      alert('Please fix the following errors:\n\n' + this.formErrors.join('\n'));
    }
  }

  private saveChangeRequest(action: string): void {
    // Update change request data
    this.changeRequest.documentsRequired = [...this.selectedDocuments];
    this.changeRequest.stakeholders = [...this.stakeholders];
    
    // Create impacted documents if not exists
    if (this.changeRequest.impactedDocuments.length === 0) {
      this.changeRequest.impactedDocuments = this.selectedDocuments.map(doc => ({
        documentName: doc,
        action: 'Create/Update',
        status: 'Not Started'
      }));
    }

    // Update attachments
    this.changeRequest.attachments = this.uploadedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: file.uploadedBy,
      date: file.date
    }));

    // Add to history
    this.changeRequest.history.push({
      date: new Date(),
      user: this.currentUser?.name || 'Unknown',
      action: action,
      comments: ''
    });

    // Save to service
    this.crService.saveChangeRequest(this.changeRequest);
    
    // Log the action
    this.crService.addHistoryEntry(
      this.changeRequest.id,
      this.currentUser?.name || 'Unknown',
      action,
      ''
    );

    // Show success message and redirect
    const message = this.isEditMode 
      ? `Change Request ${this.changeRequest.crNumber} updated successfully!`
      : `Change Request ${this.changeRequest.crNumber} created successfully!`;
    
    alert(message);
    this.router.navigate(['/change-requests', this.changeRequest.id]);
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      this.router.navigate(['/change-requests']);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getFileIcon(type: string): string {
    if (type.includes('pdf')) return '📕';
    if (type.includes('word') || type.includes('document')) return '📘';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📗';
    if (type.includes('image')) return '🖼️';
    if (type.includes('zip') || type.includes('compressed')) return '🗜️';
    return '📄';
  }

  getStakeholderStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Pending': 'stakeholder-pending',
      'Approved': 'stakeholder-approved',
      'Rejected': 'stakeholder-rejected'
    };
    return classes[status] || 'stakeholder-default';
  }
}