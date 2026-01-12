import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule,RouterLinkActive } from '@angular/router'; // Make sure this is imported
import { DocumentService, DocumentRequirement, ReleaseType, ReleaseConfiguration } from '../../service/document.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './configuration.html',
  styleUrls: ['./configuration.scss']
})
export class ConfigurationComponent {
  releaseTypes: ReleaseType[] = [];
  selectedReleaseType: string = 'Major Upgrade';
  documents: DocumentRequirement[] = [];
  showAllDocuments: boolean = true;

  constructor(private documentService: DocumentService, public authService: AuthService) {
    this.releaseTypes = this.documentService.getReleaseTypes();
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documents = this.documentService.getDocumentsForRelease(this.selectedReleaseType);
  }

  onReleaseTypeChange(): void {
    this.loadDocuments();
  }

  toggleDocument(document: DocumentRequirement): void {
    document.enabled = !document.enabled;
  }

  toggleAllDocuments(): void {
    const allEnabled = this.documents.every(doc => doc.enabled);
    this.documents.forEach(doc => {
      doc.enabled = !allEnabled;
    });
  }

  saveConfiguration(): void {
    const config: ReleaseConfiguration = {
      releaseType: this.selectedReleaseType,
      documents: this.documents
    };
    
    this.documentService.saveConfiguration(config);
    alert(`Configuration saved for ${this.selectedReleaseType}`);
  }

  resetToDefault(): void {
    if (confirm('Are you sure you want to reset to default configuration?')) {
      this.documentService.resetToDefault(this.selectedReleaseType);
      this.loadDocuments();
      alert('Configuration reset to default');
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
    } else if (doc.docUpVersion.includes('Up-version') || doc.docUpVersion.includes('upversion')) {
      actions.push('Update version of existing document');
    } else if (doc.docUpVersion === 'NA' || doc.docUpVersion === 'NCC') {
      return 'Not applicable';
    } else if (doc.docUpVersion.includes('New if')) {
      actions.push('Create new document if needed');
    }

    if (doc.docId === 'New') {
      actions.push('Generate new document ID');
    } else if (doc.docId.includes('Same Doc ID')) {
      actions.push('Keep same document ID, update version only');
    } else if (doc.docId.includes('New if')) {
      actions.push('Create new document ID if needed');
    } else if (doc.docId.includes('same project code')) {
      actions.push('Use same project code with new document ID');
    }

    if (doc.docHistory === 'Yes') {
      actions.push('Update document history');
    } else if (doc.docHistory === 'No') {
      actions.push('No history update required');
    }

    return actions.length > 0 ? actions.join(' | ') : 'Review requirements';
  }
}