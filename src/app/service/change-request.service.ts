import { Injectable } from '@angular/core';
import { DocumentService } from './document.service'; // Add this import

export interface ChangeRequest {
  id: string;
  crNumber: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Bug Fix' | 'Enhancement' | 'New Feature' | 'Security' | 'Compliance';
  releaseType: 'Major Upgrade' | 'Minor Upgrade' | 'Patch' | 'Hotfix';
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Implemented' | 'Closed';
  requestedBy: string;
  requestedDate: Date;
  targetVersion: string;
  documentsRequired: string[];
  impactedDocuments: {
    documentName: string;
    action: string;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Not Required';
  }[];
  stakeholders: {
    name: string;
    role: string;
    department: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    comments: string;
    date: Date;
  }[];
  history: {
    date: Date;
    user: string;
    action: string;
    comments: string;
  }[];
  attachments: {
    name: string;
    size: string;
    type: string;
    uploadedBy: string;
    date: Date;
  }[];
  riskAssessment: {
    riskLevel: 'Low' | 'Medium' | 'High';
    impact: string;
    probability: string;
    mitigation: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChangeRequestService {
  private readonly storageKey = 'change-requests';
  private readonly crCounterKey = 'cr-counter';
  
  private defaultDocuments = [
    'Over-arching Change Request',
    'Impact Assessment - Argus versions',
    'Risk Assessment',
    'Test Plan',
    'Validation Plan',
    'Traceability Matrix (Application)',
    'Test Summary Report',
    'Validation Summary Report'
  ];

  // constructor() {}
  constructor(private documentService: DocumentService) {} // Inject DocumentService

  generateCRNumber(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    let counter = parseInt(localStorage.getItem(this.crCounterKey) || '0') + 1;
    
    // Reset counter if new year
    const lastYear = localStorage.getItem('last-cr-year') || year.toString();
    if (lastYear !== year.toString()) {
      counter = 1;
      localStorage.setItem('last-cr-year', year.toString());
    }
    
    localStorage.setItem(this.crCounterKey, counter.toString());
    return `CR-${year}${month}-${String(counter).padStart(4, '0')}`;
  }

  getChangeRequests(): ChangeRequest[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  getChangeRequestById(id: string): ChangeRequest | null {
    const requests = this.getChangeRequests();
    return requests.find(cr => cr.id === id) || null;
  }

  saveChangeRequest(cr: ChangeRequest): void {
    const requests = this.getChangeRequests();
    const existingIndex = requests.findIndex(r => r.id === cr.id);
    
    if (existingIndex >= 0) {
      requests[existingIndex] = cr;
    } else {
      requests.push(cr);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(requests));
  }

  deleteChangeRequest(id: string): void {
    const requests = this.getChangeRequests();
    const filtered = requests.filter(r => r.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  getDocumentsByReleaseType(releaseType: string): string[] {
    const releaseDocs: Record<string, string[]> = {
      'Major Upgrade': [
        'Over-arching Change Request',
        'Impact Assessment - Argus versions',
        'Risk Assessment',
        'Validation Plan',
        'Test Plan',
        'Traceability Matrix (Application)',
        'Test Summary Report',
        'Validation Summary Report'
      ],
      'Minor Upgrade': [
        'Over-arching Change Request',
        'Impact Assessment - Argus versions',
        'Test Plan',
        'Test Summary Report'
      ],
      'Patch': [
        'Over-arching Change Request',
        'Test Plan',
        'Test Summary Report'
      ],
      'Hotfix': [
        'Over-arching Change Request',
        'Test Summary Report'
      ]
    };
    
    // return releaseDocs[releaseType] || this.defaultDocuments;
    return this.documentService.getDocumentsByReleaseTypeFromGenerator(releaseType);

  }

   // Update the default documents to use Generator's Major Upgrade list
  private getDefaultDocuments(): string[] {
    return this.documentService.getDocumentsByReleaseTypeFromGenerator('Major Upgrade');
  }

  getStakeholderTemplates(): any[] {
    return [
      { name: 'Product Owner', role: 'Approver', department: 'Product Management' },
      { name: 'QA Lead', role: 'Approver', department: 'Quality Assurance' },
      { name: 'Tech Lead', role: 'Approver', department: 'Engineering' },
      { name: 'Compliance Officer', role: 'Reviewer', department: 'Regulatory Affairs' },
      { name: 'Documentation Lead', role: 'Reviewer', department: 'Technical Writing' },
      { name: 'Validation Lead', role: 'Reviewer', department: 'Quality Assurance' },
      { name: 'Project Manager', role: 'Approver', department: 'Project Management' }
    ];
  }

   // Update to use all Generator documents for selection
  getAllAvailableDocuments(): string[] {
    return this.documentService.getAllDocumentNames();
  }

  getStatusOptions(): string[] {
    return ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Implemented', 'Closed'];
  }

  getPriorityOptions(): string[] {
    return ['Low', 'Medium', 'High', 'Critical'];
  }

  getTypeOptions(): string[] {
    return ['Bug Fix', 'Enhancement', 'New Feature', 'Security', 'Compliance'];
  }

  getReleaseTypeOptions(): string[] {
    return ['Major Upgrade', 'Minor Upgrade', 'Patch', 'Hotfix'];
  }

  addHistoryEntry(crId: string, user: string, action: string, comments: string = ''): void {
    const cr = this.getChangeRequestById(crId);
    if (!cr) return;

    cr.history.push({
      date: new Date(),
      user,
      action,
      comments
    });

    this.saveChangeRequest(cr);
  }

  exportToWord(cr: ChangeRequest): void {
    const content = this.generateWordContent(cr);
    const blob = new Blob([content], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cr.crNumber}_Change_Request.doc`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generateWordContent(cr: ChangeRequest): string {
    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
        xmlns:w='urn:schemas-microsoft-com:office:word'
        xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${cr.crNumber} - ${cr.title}</title>
      </head>
      <body>
        <h1>Change Request: ${cr.crNumber}</h1>
        <h2>${cr.title}</h2>
        
        <table border='1' cellpadding='5' cellspacing='0'>
          <tr><th>Field</th><th>Value</th></tr>
          <tr><td>Status</td><td>${cr.status}</td></tr>
          <tr><td>Priority</td><td>${cr.priority}</td></tr>
          <tr><td>Type</td><td>${cr.type}</td></tr>
          <tr><td>Release Type</td><td>${cr.releaseType}</td></tr>
          <tr><td>Requested By</td><td>${cr.requestedBy}</td></tr>
          <tr><td>Requested Date</td><td>${cr.requestedDate}</td></tr>
          <tr><td>Target Version</td><td>${cr.targetVersion}</td></tr>
        </table>
        
        <h3>Description</h3>
        <p>${cr.description}</p>
        
        <h3>Required Documents</h3>
        <ul>
          ${cr.documentsRequired.map(doc => `<li>${doc}</li>`).join('')}
        </ul>
        
        <h3>Risk Assessment</h3>
        <p><strong>Risk Level:</strong> ${cr.riskAssessment.riskLevel}</p>
        <p><strong>Impact:</strong> ${cr.riskAssessment.impact}</p>
        <p><strong>Probability:</strong> ${cr.riskAssessment.probability}</p>
        <p><strong>Mitigation:</strong> ${cr.riskAssessment.mitigation}</p>
      </body>
      </html>
    `;
  }
}