import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DocumentService, DocumentRequirement, ReleaseType, ReleaseConfiguration } from '../../service/document.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './configuration.html',
  styleUrls: ['./configuration.scss']
})
export class ConfigurationComponent {
  releaseTypes: ReleaseType[] = [];
  selectedReleaseType: string = 'Major Upgrade';
  documents: DocumentRequirement[] = [];
  filteredDocuments: DocumentRequirement[] = [];
  showAllDocuments: boolean = true;
  hasUnsavedChanges: boolean = false;
  searchTerm: string = '';

  constructor(private documentService: DocumentService, public authService: AuthService) {
    this.releaseTypes = this.documentService.getReleaseTypes();
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documents = this.documentService.getDocumentsForRelease(this.selectedReleaseType);
    this.filteredDocuments = [...this.documents];
    this.hasUnsavedChanges = false;
  }

  onReleaseTypeChange(): void {
    this.loadDocuments();
  }

  toggleDocument(document: DocumentRequirement): void {
    document.enabled = !document.enabled;
    this.hasUnsavedChanges = true;
  }

  toggleAllDocuments(): void {
    const allEnabled = this.documents.every(doc => doc.enabled);
    this.documents.forEach(doc => {
      if (doc.docUpVersion !== 'NA' && doc.docUpVersion !== 'NCC') {
        doc.enabled = !allEnabled;
      }
    });
    this.filterDocuments();
    this.hasUnsavedChanges = true;
  }

  saveConfiguration(): void {
    const config: ReleaseConfiguration = {
      releaseType: this.selectedReleaseType,
      documents: this.documents
    };
    
    this.documentService.saveConfiguration(config);
    this.hasUnsavedChanges = false;
    
    // Show success message (you can replace with a toast notification)
    this.showNotification('Configuration saved successfully');
  }

  resetToDefault(): void {
    if (confirm('Are you sure you want to reset to default configuration?')) {
      this.documentService.resetToDefault(this.selectedReleaseType);
      this.loadDocuments();
      this.showNotification('Configuration reset to default');
    }
  }

  filterDocuments(event?: any): void {
    if (event) {
      this.searchTerm = event.target.value.toLowerCase();
    }
    
    if (!this.searchTerm) {
      this.filteredDocuments = [...this.documents];
    } else {
      this.filteredDocuments = this.documents.filter(doc => 
        doc.documentName.toLowerCase().includes(this.searchTerm) ||
        doc.docId.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  getEnabledCount(): number {
    return this.documents.filter(doc => doc.enabled).length;
  }

  getTotalCount(): number {
    return this.documents.length;
  }

  getActionDescription(doc: DocumentRequirement): string {
    const actions = [];
    
    if (doc.docUpVersion === 'New doc' || doc.docUpVersion === 'New Doc') {
      actions.push('Create new document');
    } else if (doc.docUpVersion.includes('Up-version')) {
      actions.push('Update version');
    } else if (doc.docUpVersion === 'NA' || doc.docUpVersion === 'NCC') {
      return 'Not applicable';
    }

    if (doc.docId === 'New') {
      actions.push('New ID');
    } else if (doc.docId.includes('Same Doc ID')) {
      actions.push('Keep existing ID');
    }

    if (doc.docHistory === 'Yes') {
      actions.push('Update history');
    }

    return actions.length > 0 ? actions.join(' • ') : 'Review requirements';
  }

  getRequirementClass(version: string): string {
    if (version.includes('New')) return 'new-doc';
    if (version.includes('Up-version')) return 'up-version';
    if (version === 'NA' || version === 'NCC') return 'na';
    return '';
  }

  private showNotification(message: string): void {
    // Simple alert for now - you can replace with a proper toast component
    alert(message);
  }
}