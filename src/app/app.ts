import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService, DocumentRequirement, ReleaseType } from './service/document.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'Documentation Requirements Generator';
  releaseTypes: ReleaseType[] = [];
  allDocuments: DocumentRequirement[] = [];
  filteredDocuments: DocumentRequirement[] = [];
  selectedReleaseType: string = 'Major Upgrade';
  projectCode: string = 'PROJ-001';
  releaseVersion: string = 'v2.0.0';
  showAllDocuments: boolean = false;

  // Computed properties for the template
  totalDocumentsToProcess: number = 0;
  newDocumentsCount: number = 0;
  upVersionDocumentsCount: number = 0;
  notApplicableCount: number = 0;

  constructor(private documentService: DocumentService) {
    this.releaseTypes = this.documentService.getReleaseTypes();
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.allDocuments = this.documentService.getDocumentsForRelease(this.selectedReleaseType);
    this.filterDocuments();
  }

  filterDocuments(): void {
    if (this.showAllDocuments) {
      this.filteredDocuments = this.allDocuments;
    } else {
      this.filteredDocuments = this.allDocuments.filter(doc => 
        doc.docUpVersion !== 'NA' && doc.docUpVersion !== 'NCC'
      );
    }
    this.updateSummaryCounts();
  }

  updateSummaryCounts(): void {
    this.totalDocumentsToProcess = this.allDocuments.filter(d => 
      d.docUpVersion !== 'NA' && d.docUpVersion !== 'NCC'
    ).length;

    this.newDocumentsCount = this.allDocuments.filter(d => 
      d.docUpVersion === 'New doc' || d.docUpVersion === 'New Doc'
    ).length;

    this.upVersionDocumentsCount = this.allDocuments.filter(d => 
      d.docUpVersion.includes('Up-version') || 
      d.docUpVersion.includes('upversion') ||
      d.docUpVersion.includes('up-version')
    ).length;

    this.notApplicableCount = this.allDocuments.filter(d => 
      d.docUpVersion === 'NA' || d.docUpVersion === 'NCC'
    ).length;
  }

  onReleaseTypeChange(): void {
    this.loadDocuments();
  }

  onShowAllChange(): void {
    this.filterDocuments();
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
    } else if (doc.docHistory === 'NA') {
      // Don't add anything for NA
    }

    return actions.length > 0 ? actions.join(' | ') : 'Review requirements';
  }

  generateReport(): void {
    const report = {
      projectCode: this.projectCode,
      releaseVersion: this.releaseVersion,
      releaseType: this.selectedReleaseType,
      generatedDate: new Date().toISOString(),
      showAllDocuments: this.showAllDocuments,
      summary: {
        totalDocumentsToProcess: this.totalDocumentsToProcess,
        newDocuments: this.newDocumentsCount,
        upVersionDocuments: this.upVersionDocumentsCount,
        notApplicable: this.notApplicableCount
      },
      documents: this.filteredDocuments.map(doc => ({
        documentName: doc.documentName,
        action: this.getActionDescription(doc),
        requirements: {
          docUpVersion: doc.docUpVersion,
          docId: doc.docId,
          docHistory: doc.docHistory
        }
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document-requirements-${this.projectCode}-${this.releaseVersion}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}