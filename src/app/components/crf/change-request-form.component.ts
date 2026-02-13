import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ChangeRequestService, ChangeRequest } from '../../service/change-request.service';
import { DocumentService } from '../../service/document.service';

@Component({
  selector: 'app-change-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
  allGeneratorDocuments: string[] = [];
  
  // Stakeholder management
  stakeholders: any[] = [];
  newStakeholder: any = { name: '', role: '', department: '' };
  
  // File upload
  uploadedFiles: any[] = [];
  
  // Validation
  formErrors: string[] = [];

  // Document search and filter
  documentSearch: string = '';
  filteredDocuments: any[] = [];
  recommendedDocuments = [
    'Over-arching Change Request',
    'Risk Assessment',
    'Impact Assessment - Argus versions',
    'Test Plan',
    'Test Summary Report',
    'Validation Plan',
    'Validation Summary Report'
  ];

  constructor(
    private crService: ChangeRequestService,
    private authService: AuthService,
    private documentService: DocumentService,
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
    
    // Load all documents from Generator
    this.allGeneratorDocuments = this.documentService.getAllDocumentNames();

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

  filterDocuments(): void {
    if (!this.documentSearch.trim()) {
      this.filteredDocuments = this.availableDocuments.map(doc => ({
        id: this.generateDocumentId(doc),
        name: doc,
        isRecommended: this.recommendedDocuments.includes(doc),
        type: this.getDocumentCategory(doc)
      }));
      return;
    }

    const searchTerm = this.documentSearch.toLowerCase();
    this.filteredDocuments = this.availableDocuments
      .filter(doc => doc.toLowerCase().includes(searchTerm))
      .map(doc => ({
        id: this.generateDocumentId(doc),
        name: doc,
        isRecommended: this.recommendedDocuments.includes(doc),
        type: this.getDocumentCategory(doc)
      }));
  }

  clearDocumentSearch(): void {
    this.documentSearch = '';
    this.filterDocuments();
  }

  generateDocumentId(docName: string): string {
    return docName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  getDocumentCategory(docName: string): string {
    if (docName.includes('Requirement') || docName.includes('UFRS')) return 'Requirements';
    if (docName.includes('Assessment')) return 'Assessment';
    if (docName.includes('Plan')) return 'Planning';
    if (docName.includes('Test')) return 'Testing';
    if (docName.includes('Validation')) return 'Validation';
    if (docName.includes('Traceability')) return 'Traceability';
    if (docName.includes('Manual') || docName.includes('Guide')) return 'User Documentation';
    if (docName.includes('Report')) return 'Reporting';
    if (docName.includes('Release')) return 'Release';
    return 'Documentation';
  }

  getDocumentAction(docName: string): string {
    if (docName === 'Over-arching Change Request') return 'Create New';
    if (this.changeRequest.releaseType === 'Major Upgrade') {
      if (docName.includes('Assessment')) return 'Create New';
      if (docName.includes('Plan')) return 'Create New';
    }
    return 'Update Existing';
  }

  getDocumentTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'Requirements': 'type-requirements',
      'Assessment': 'type-assessment',
      'Planning': 'type-planning',
      'Testing': 'type-testing',
      'Validation': 'type-validation',
      'Traceability': 'type-traceability',
      'User Documentation': 'type-user-doc',
      'Reporting': 'type-reporting',
      'Release': 'type-release',
      'Documentation': 'type-documentation'
    };
    return classes[type] || 'type-default';
  }

  selectRecommended(): void {
    this.selectedDocuments = this.availableDocuments.filter(doc => 
      this.recommendedDocuments.includes(doc)
    );
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
      this.filterDocuments();
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
    // Get documents for the selected release type from Generator
    this.availableDocuments = this.documentService
      .getDocumentsByReleaseTypeFromGenerator(this.changeRequest.releaseType);
    
    // Auto-select documents that are typically required for CRs
    this.autoSelectCommonDocuments();
    this.filterDocuments();
  }
  
  autoSelectCommonDocuments(): void {
    // Common documents that are usually required for change requests
    const commonCRDocuments = [
      'Over-arching Change Request',
      'Risk Assessment',
      'Impact Assessment - Argus versions',
      'Test Plan',
      'Test Summary Report',
      'Validation Plan',
      'Validation Summary Report',
      'Traceability Matrix (Application)',
      'Traceability Matrix (Mart)'
    ];

    // Auto-select common documents that are available for this release type
    this.selectedDocuments = this.availableDocuments.filter(doc => 
      commonCRDocuments.includes(doc)
    );
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

    if (!this.changeRequest.title?.trim()) {
      this.formErrors.push('Title is required');
    }

    if (!this.changeRequest.description?.trim()) {
      this.formErrors.push('Description is required');
    }

    if (this.selectedDocuments.length === 0) {
      this.formErrors.push('At least one document must be selected');
    }

    if (!this.changeRequest.targetVersion?.trim()) {
      this.formErrors.push('Target version is required');
    }

    if (!this.changeRequest.riskAssessment?.impact?.trim()) {
      this.formErrors.push('Risk impact assessment is required');
    }

    if (!this.changeRequest.riskAssessment?.probability?.trim()) {
      this.formErrors.push('Risk probability assessment is required');
    }

    if (!this.changeRequest.riskAssessment?.mitigation?.trim()) {
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
      // Scroll to error section
      setTimeout(() => {
        const errorElement = document.querySelector('.error-card');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  private saveChangeRequest(action: string): void {
    try {
      // Update change request data
      this.changeRequest.documentsRequired = [...this.selectedDocuments];
      this.changeRequest.stakeholders = [...this.stakeholders];
      
      // Create impacted documents if not exists
      if (!this.changeRequest.impactedDocuments || this.changeRequest.impactedDocuments.length === 0) {
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
        uploadedDate: file.date
      }));

      // Add to history
      if (!this.changeRequest.history) {
        this.changeRequest.history = [];
      }
      
      this.changeRequest.history.push({
        date: new Date(),
        user: this.currentUser?.name || 'System',
        action: action,
        comments: ''
      });

      // Save to service
      this.crService.saveChangeRequest(this.changeRequest);
      
      // Show success message
      const message = this.isEditMode 
        ? `Change Request ${this.changeRequest.crNumber} updated successfully!`
        : `Change Request ${this.changeRequest.crNumber} created successfully!`;
      
      alert(message);
      
      // Navigate back to the list page
      this.router.navigate(['/change-requests']);
      
    } catch (error) {
      console.error('Error saving change request:', error);
      alert('An error occurred while saving. Please check console for details.');
    }
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
}