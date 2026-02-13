import { Injectable } from '@angular/core';

export interface ChangeRequest {
  id: string;
  crNumber: string;
  title: string;
  description: string;
  priority: string;
  type: string;
  releaseType: string;
  status: string;
  requestedBy: string;
  requestedDate: Date;
  targetVersion: string;
  documentsRequired: string[];
  impactedDocuments: any[];
  stakeholders: any[];
  history: any[];
  attachments: any[];
  riskAssessment: {
    riskLevel: string;
    impact: string;
    probability: string;
    mitigation: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChangeRequestService {
  private storageKey = 'change_requests';
  private nextCRNumber = 1000;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const existingData = this.getChangeRequests();
    if (existingData.length === 0) {
      // Create sample change requests
      const sampleRequests: ChangeRequest[] = [
        {
          id: 'cr_1',
          crNumber: 'CR-2024-001',
          title: 'API Documentation Update',
          description: 'Update API documentation for new endpoints and authentication changes including OAuth2 implementation and rate limiting details',
          priority: 'High',
          type: 'Documentation',
          releaseType: 'Major Upgrade',
          status: 'In Progress',
          requestedBy: 'John Doe',
          requestedDate: new Date('2024-03-15'),
          targetVersion: 'v2.1.0',
          documentsRequired: ['API Specification', 'Integration Guide', 'Security Documentation'],
          impactedDocuments: [],
          stakeholders: [
            { name: 'Jane Smith', role: 'Tech Writer', department: 'Documentation', status: 'Approved' },
            { name: 'Mike Johnson', role: 'Architect', department: 'Engineering', status: 'Pending' }
          ],
          history: [
            { date: new Date('2024-03-15'), user: 'John Doe', action: 'Created', comments: 'Initial creation' }
          ],
          attachments: [],
          riskAssessment: {
            riskLevel: 'Medium',
            impact: 'Documentation changes may affect developer onboarding',
            probability: 'Low',
            mitigation: 'Review with development team before release'
          }
        },
        {
          id: 'cr_2',
          crNumber: 'CR-2024-002',
          title: 'User Guide Revision',
          description: 'Revise user guide to include new features from Q1 release with screenshots and step-by-step instructions',
          priority: 'Medium',
          type: 'Enhancement',
          releaseType: 'Minor Update',
          status: 'Draft',
          requestedBy: 'Jane Smith',
          requestedDate: new Date('2024-03-14'),
          targetVersion: 'v2.0.1',
          documentsRequired: ['User Manual', 'Quick Start Guide'],
          impactedDocuments: [],
          stakeholders: [
            { name: 'Sarah Wilson', role: 'Product Manager', department: 'Product', status: 'Pending' }
          ],
          history: [
            { date: new Date('2024-03-14'), user: 'Jane Smith', action: 'Created', comments: 'Initial draft' }
          ],
          attachments: [],
          riskAssessment: {
            riskLevel: 'Low',
            impact: 'Minimal impact, documentation only',
            probability: 'Low',
            mitigation: 'Standard review process'
          }
        }
      ];
      
      localStorage.setItem(this.storageKey, JSON.stringify(sampleRequests));
      this.nextCRNumber = 1003;
    } else {
      // Determine next CR number
      const maxNumber = Math.max(...existingData.map(cr => {
        const match = cr.crNumber.match(/CR-(\d+)-(\d+)/);
        return match ? parseInt(match[2]) : 0;
      }));
      this.nextCRNumber = maxNumber + 1;
    }
  }

  getChangeRequests(): ChangeRequest[] {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      const requests = JSON.parse(data);
      // Convert date strings back to Date objects
      requests.forEach((cr: any) => {
        cr.requestedDate = new Date(cr.requestedDate);
        if (cr.history) {
          cr.history.forEach((h: any) => h.date = new Date(h.date));
        }
      });
      return requests;
    }
    return [];
  }

  getChangeRequestById(id: string): ChangeRequest | undefined {
    const requests = this.getChangeRequests();
    return requests.find(cr => cr.id === id);
  }

  saveChangeRequest(changeRequest: ChangeRequest): void {
    const requests = this.getChangeRequests();
    const index = requests.findIndex(cr => cr.id === changeRequest.id);
    
    if (index !== -1) {
      // Update existing
      requests[index] = changeRequest;
    } else {
      // Add new
      requests.push(changeRequest);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(requests));
    console.log('Change request saved successfully:', changeRequest.crNumber);
  }

  deleteChangeRequest(id: string): void {
    const requests = this.getChangeRequests();
    const filteredRequests = requests.filter(cr => cr.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredRequests));
    console.log('Change request deleted successfully:', id);
  }

  generateCRNumber(): string {
    const year = new Date().getFullYear();
    const number = this.nextCRNumber++;
    return `CR-${year}-${number.toString().padStart(3, '0')}`;
  }

  // Helper methods
  getPriorityOptions(): string[] {
    return ['Low', 'Medium', 'High', 'Critical'];
  }

  getTypeOptions(): string[] {
    return ['Enhancement', 'Bug Fix', 'Documentation', 'New Feature', 'Compliance'];
  }

  getReleaseTypeOptions(): string[] {
    return ['Major Upgrade', 'Minor Update', 'Patch', 'Hot Fix', 'Compliance Update'];
  }

  getStatusOptions(): string[] {
    return ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Implemented', 'Closed'];
  }

  getStakeholderTemplates(): any[] {
    return [
      { name: 'Technical Writer', role: 'Documentation Reviewer', department: 'Documentation' },
      { name: 'QA Lead', role: 'Testing Approver', department: 'Quality Assurance' },
      { name: 'Product Manager', role: 'Business Approver', department: 'Product' },
      { name: 'Release Manager', role: 'Release Approver', department: 'Release Management' }
    ];
  }

  getDocumentsByReleaseType(releaseType: string): string[] {
    // Base documents for all release types
    const baseDocs = [
      'Over-arching Change Request',
      'Risk Assessment',
      'Impact Assessment - Argus versions'
    ];

    const releaseTypeDocs: Record<string, string[]> = {
      'Major Upgrade': [
        ...baseDocs,
        'Test Plan',
        'Test Summary Report',
        'Validation Plan',
        'Validation Summary Report',
        'Traceability Matrix (Application)',
        'Traceability Matrix (Mart)',
        'User Acceptance Test Plan',
        'Installation Guide',
        'Release Notes',
        'API Documentation'
      ],
      'Minor Update': [
        ...baseDocs,
        'Test Plan',
        'Test Summary Report',
        'Validation Summary Report',
        'Release Notes'
      ],
      'Patch': [
        'Over-arching Change Request',
        'Test Summary Report',
        'Release Notes'
      ],
      'Hot Fix': [
        'Over-arching Change Request',
        'Test Summary Report'
      ],
      'Compliance Update': [
        'Over-arching Change Request',
        'Risk Assessment',
        'Compliance Checklist',
        'Validation Report'
      ]
    };

    return releaseTypeDocs[releaseType] || baseDocs;
  }

  addHistoryEntry(crId: string, user: string, action: string, comments: string): void {
    const requests = this.getChangeRequests();
    const cr = requests.find(r => r.id === crId);
    if (cr) {
      if (!cr.history) {
        cr.history = [];
      }
      cr.history.push({
        date: new Date(),
        user: user,
        action: action,
        comments: comments
      });
      localStorage.setItem(this.storageKey, JSON.stringify(requests));
    }
  }

  // Export functions
  exportToWord(changeRequest: ChangeRequest): void {
    // Create a simple text representation
    const content = `
CHANGE REQUEST: ${changeRequest.crNumber}
========================================
Title: ${changeRequest.title}
Description: ${changeRequest.description}
Priority: ${changeRequest.priority}
Status: ${changeRequest.status}
Release Type: ${changeRequest.releaseType}
Target Version: ${changeRequest.targetVersion}
Requested By: ${changeRequest.requestedBy}
Requested Date: ${changeRequest.requestedDate.toLocaleDateString()}

RISK ASSESSMENT
========================================
Risk Level: ${changeRequest.riskAssessment.riskLevel}
Impact: ${changeRequest.riskAssessment.impact}
Probability: ${changeRequest.riskAssessment.probability}
Mitigation: ${changeRequest.riskAssessment.mitigation}

REQUIRED DOCUMENTS
========================================
${changeRequest.documentsRequired.map(doc => `- ${doc}`).join('\n')}

STAKEHOLDERS
========================================
${changeRequest.stakeholders.map(s => `- ${s.name} (${s.role}): ${s.status}`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${changeRequest.crNumber}-${changeRequest.title}.doc`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}