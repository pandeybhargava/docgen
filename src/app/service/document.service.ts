import { Injectable } from '@angular/core';

export interface DocumentRequirement {
  documentName: string;
  docUpVersion: string;
  docId: string;
  docHistory: string;
  enabled: boolean;
}

export interface ReleaseType {
  name: string;
  documents: DocumentRequirement[];
}

export interface ReleaseConfiguration {
  releaseType: string;
  documents: DocumentRequirement[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private storageKey = 'document_configurations';
  private releaseTypes: ReleaseType[] = [
    {
      name: 'Major Upgrade',
      documents: [
        { documentName: 'Over-arching Change Request', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Risk Assessment', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Impact Assessment - Argus versions', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Test Plan', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Test Summary Report', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Validation Plan', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Validation Summary Report', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Traceability Matrix (Application)', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'Traceability Matrix (Mart)', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'User Acceptance Test Plan', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'Installation Guide', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'Release Notes', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'API Documentation', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true }
      ]
    },
    {
      name: 'Minor Update',
      documents: [
        { documentName: 'Over-arching Change Request', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Risk Assessment', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'Impact Assessment - Argus versions', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'Test Plan', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'Test Summary Report', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'Validation Summary Report', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'Release Notes', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true }
      ]
    },
    {
      name: 'Patch',
      documents: [
        { documentName: 'Over-arching Change Request', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Test Summary Report', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'Release Notes', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true }
      ]
    },
    {
      name: 'Hot Fix',
      documents: [
        { documentName: 'Over-arching Change Request', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Test Summary Report', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true }
      ]
    },
    {
      name: 'Compliance Update',
      documents: [
        { documentName: 'Over-arching Change Request', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true },
        { documentName: 'Risk Assessment', docUpVersion: 'Up-version', docId: 'Same Doc ID', docHistory: 'Yes', enabled: true },
        { documentName: 'Compliance Checklist', docUpVersion: 'New if', docId: 'New if', docHistory: 'Yes', enabled: true },
        { documentName: 'Validation Report', docUpVersion: 'New doc', docId: 'New', docHistory: 'Yes', enabled: true }
      ]
    }
  ];

  constructor() {
    this.loadConfigurations();
  }

  getReleaseTypes(): ReleaseType[] {
    return this.releaseTypes;
  }

  getDocumentsForRelease(releaseType: string): DocumentRequirement[] {
    const release = this.releaseTypes.find(r => r.name === releaseType);
    return release ? [...release.documents] : [];
  }

  getAllDocumentNames(): string[] {
    const allDocs = new Set<string>();
    this.releaseTypes.forEach(release => {
      release.documents.forEach(doc => {
        allDocs.add(doc.documentName);
      });
    });
    return Array.from(allDocs).sort();
  }

  getDocumentsByReleaseTypeFromGenerator(releaseType: string): string[] {
    const release = this.releaseTypes.find(r => r.name === releaseType);
    return release ? release.documents.map(doc => doc.documentName) : [];
  }

  saveConfiguration(config: ReleaseConfiguration): void {
    const configurations = this.getConfigurations();
    const index = configurations.findIndex(c => c.releaseType === config.releaseType);
    
    if (index !== -1) {
      configurations[index] = config;
    } else {
      configurations.push(config);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(configurations));
    
    // Update in-memory data
    const releaseIndex = this.releaseTypes.findIndex(r => r.name === config.releaseType);
    if (releaseIndex !== -1) {
      this.releaseTypes[releaseIndex].documents = config.documents;
    }
  }

  resetToDefault(releaseType: string): void {
    // Get default configuration
    const defaultRelease = this.getDefaultReleaseType(releaseType);
    if (defaultRelease) {
      const releaseIndex = this.releaseTypes.findIndex(r => r.name === releaseType);
      if (releaseIndex !== -1) {
        this.releaseTypes[releaseIndex].documents = defaultRelease.documents.map(d => ({...d}));
      }
    }
  }

  private getDefaultReleaseType(name: string): ReleaseType | undefined {
    // This is a simplified version - you might want to store defaults separately
    return this.releaseTypes.find(r => r.name === name);
  }

  private getConfigurations(): ReleaseConfiguration[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private loadConfigurations(): void {
    const configurations = this.getConfigurations();
    configurations.forEach(config => {
      const releaseIndex = this.releaseTypes.findIndex(r => r.name === config.releaseType);
      if (releaseIndex !== -1) {
        this.releaseTypes[releaseIndex].documents = config.documents;
      }
    });
  }
}