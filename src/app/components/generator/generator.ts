import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DocumentService, DocumentRequirement, ReleaseType } from '../../service/document.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './generator.html',
  styleUrls: ['./generator.scss']
})
export class GeneratorComponent {
  title = 'Documentation Requirements Generator';
  releaseTypes: ReleaseType[] = [];
  allDocuments: DocumentRequirement[] = [];
  filteredDocuments: DocumentRequirement[] = [];
  selectedReleaseType: string = 'Major Upgrade';
  projectCode: string = 'PROJ-001';
  releaseVersion: string = 'v2.0.0';
  showAllDocuments: boolean = false;
  currentDate: Date = new Date();

  // Computed properties for the template
  totalDocumentsToProcess: number = 0;
  newDocumentsCount: number = 0;
  upVersionDocumentsCount: number = 0;
  notApplicableCount: number = 0;

  constructor(private documentService: DocumentService, public authService: AuthService) {
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
      this.filteredDocuments = this.allDocuments.filter(doc => doc.enabled);
    }
    this.updateSummaryCounts();
  }

  updateSummaryCounts(): void {
    this.totalDocumentsToProcess = this.allDocuments.filter(d => d.enabled).length;
    this.newDocumentsCount = this.allDocuments.filter(d => 
      d.enabled && (d.docUpVersion === 'New doc' || d.docUpVersion === 'New Doc')
    ).length;
    this.upVersionDocumentsCount = this.allDocuments.filter(d => 
      d.enabled && (d.docUpVersion.includes('Up-version') || 
      d.docUpVersion.includes('upversion') ||
      d.docUpVersion.includes('up-version'))
    ).length;
    this.notApplicableCount = this.allDocuments.filter(d => !d.enabled).length;
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
      actions.push('Create new');
    } else if (doc.docUpVersion.includes('Up-version')) {
      actions.push('Update version');
    } else if (doc.docUpVersion === 'NA' || doc.docUpVersion === 'NCC') {
      return 'Not applicable';
    }

    if (doc.docId === 'New') {
      actions.push('New ID');
    } else if (doc.docId.includes('Same Doc ID')) {
      actions.push('Keep ID');
    }

    if (doc.docHistory === 'Yes') {
      actions.push('Update history');
    }

    return actions.length > 0 ? actions.join(' • ') : 'Review';
  }

  getShortVersion(version: string): string {
    if (version.includes('New')) return 'New';
    if (version.includes('Up-version')) return 'Up-ver';
    if (version === 'NA' || version === 'NCC') return 'N/A';
    return version;
  }

  getShortDocId(docId: string): string {
    if (docId === 'New') return 'New';
    if (docId.includes('Same')) return 'Same';
    if (docId.includes('New if')) return 'New?';
    return docId.substring(0, 12) + '...';
  }

  getBadgeClass(version: string): string {
    if (version.includes('New')) return 'new-doc';
    if (version.includes('Up-version')) return 'up-version';
    if (version === 'NA' || version === 'NCC') return 'na';
    return '';
  }

  resetForm(): void {
    this.projectCode = 'PROJ-001';
    this.releaseVersion = 'v2.0.0';
    this.selectedReleaseType = 'Major Upgrade';
    this.showAllDocuments = false;
    this.loadDocuments();
  }

  generateReport(): void {
    const report = {
      projectCode: this.projectCode,
      releaseVersion: this.releaseVersion,
      releaseType: this.selectedReleaseType,
      generatedDate: new Date().toISOString(),
      generatedBy: this.authService.getCurrentUser()?.name || 'System',
      showAllDocuments: this.showAllDocuments,
      summary: {
        totalDocumentsToProcess: this.totalDocumentsToProcess,
        newDocuments: this.newDocumentsCount,
        upVersionDocuments: this.upVersionDocumentsCount,
        notApplicable: this.notApplicableCount
      },
      documents: this.filteredDocuments.map(doc => ({
        documentName: doc.documentName,
        enabled: doc.enabled,
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
    link.download = `doc-requirements-${this.projectCode}-${this.releaseVersion}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}