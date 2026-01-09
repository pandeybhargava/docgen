import { Injectable } from '@angular/core';

export interface ReleaseType {
  name: string;
  key: string;
  columns: {
    docUpVersion: string;
    docId: string;
    docHistory: string;
  };
}

export interface DocumentRequirement {
  documentName: string;
  documentKey: string;
  docUpVersion: string;
  docId: string;
  docHistory: string;
  enabled: boolean;
  customAction?: string;
}

export interface ReleaseConfiguration {
  releaseType: string;
  documents: DocumentRequirement[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private releaseTypes: ReleaseType[] = [
    {
      name: 'Major Upgrade',
      key: 'major',
      columns: { docUpVersion: 'B', docId: 'C', docHistory: 'D' }
    },
    {
      name: 'Minor Upgrade',
      key: 'minor',
      columns: { docUpVersion: 'E', docId: 'F', docHistory: 'G' }
    },
    {
      name: 'Patch release',
      key: 'patch',
      columns: { docUpVersion: 'H', docId: 'I', docHistory: 'J' }
    },
    {
      name: 'Hotfix',
      key: 'hotfix',
      columns: { docUpVersion: 'K', docId: 'L', docHistory: 'M' }
    }
  ];

  private documentData: any[] = [
    { documentName: 'Application User and Functional Requirements Specification (UFRS)', documentKey: 'ufrs_app', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Report and Templates User and Functional Requirements Specification (UFRS)', documentKey: 'ufrs_report', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Mart Functional Requirements Specification (FRSX)', documentKey: 'frsx_mart', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'GxP Assessment', documentKey: 'gxp_assessment', B: 'New doc', C: 'New', D: 'No', E: 'NA', F: 'NA', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Risk Assessment', documentKey: 'risk_assessment', B: 'New doc', C: 'New', D: 'No', E: 'NA', F: 'NA', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Validation Plan', documentKey: 'validation_plan', B: 'New doc', C: 'New', D: 'No', E: 'NA', F: 'NA', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Over-arching Change Request', documentKey: 'change_request', B: 'NA', C: 'NA', D: 'NA', E: 'New Doc', F: 'New', G: 'No', H: 'New Doc', I: 'New (same project code)', J: 'NA', K: 'New Doc', L: 'New (same project code)', M: 'NA' },
    { documentName: '21 CFR Part 11 Assessment', documentKey: 'cfr11_assessment', B: 'New doc', C: 'New', D: 'No', E: 'Usually No', F: 'New if doc needed', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'EU Annex 11 Assessment', documentKey: 'annex11_assessment', B: 'New doc', C: 'New', D: 'No', E: 'Usually No', F: 'New if doc needed', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'MHLW Assessment', documentKey: 'mhlw_assessment', B: 'New doc', C: 'New', D: 'No', E: 'Usually No', F: 'New if doc needed', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Configuration Baseline Document (CBD)', documentKey: 'cbd', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'Up-version if needed', L: 'Same Doc ID - just version different', M: 'Yes' },
    { documentName: 'Test Plan', documentKey: 'test_plan', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'System Design Specification (SDS)', documentKey: 'sds', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'Up-version if needed', L: 'Same Doc ID - just version different', M: 'Yes' },
    { documentName: 'Impact Assessment - Argus versions', documentKey: 'impact_assessment', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'New Doc if needed', L: 'New (same project code)', M: 'NA' },
    { documentName: 'Code Review Checklist', documentKey: 'code_review', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'New Doc', I: 'New (same project code)', J: 'NA', K: 'New Doc', L: 'New (same project code)', M: 'NA' },
    { documentName: 'Unit Testing', documentKey: 'unit_testing', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'New Doc', I: 'New (same project code)', J: 'NA', K: 'New Doc', L: 'New (same project code)', M: 'NA' },
    { documentName: 'Installation Qualification (IQ)', documentKey: 'iq', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'Same Doc ID - just version different', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'Up-version if needed', L: 'Same Doc ID - just version different', M: 'Yes' },
    { documentName: 'Operational Qualification (OQ)', documentKey: 'oq', B: 'New doc', C: 'New', D: 'No', E: 'New Doc + upversion for regression as needed', F: 'New if new; if old being up-versioned - keep same Doc ID - just version diff.', G: 'Yes if up-versioning', H: 'New Doc + upversion for regression as needed', I: 'New if new; if old being up-versioned - keep same Doc ID - just version diff.', J: 'Yes if up-versioning', K: 'New Doc + upversion for regression as needed', L: 'New if new; if old being up-versioned - keep same Doc ID - just version diff.', M: 'Yes if up-versioning' },
    { documentName: 'Qualification Plan', documentKey: 'qualification_plan', B: 'New doc', C: 'New', D: 'No', E: 'New if needed', F: 'New if doc needed', G: 'No', H: 'NCC', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Network Environment Design', documentKey: 'network_design', B: 'New doc', C: 'New', D: 'No', E: 'New if needed', F: 'New if doc needed', G: 'No', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Qualification Summary Report', documentKey: 'qualification_summary', B: 'New doc', C: 'New', D: 'No', E: 'New if needed', F: 'New if doc needed', G: 'No', H: 'NCC', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Environment Release Notice', documentKey: 'environment_release', B: 'New doc', C: 'New', D: 'No', E: 'New if needed', F: 'New if doc needed', G: 'No', H: 'NCC', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Traceability Matrix (Application)', documentKey: 'traceability_app', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Traceability Matrix (Mart)', documentKey: 'traceability_mart', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Test Summary Report', documentKey: 'test_summary', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'User Manual', documentKey: 'user_manual', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Admin Guide', documentKey: 'admin_guide', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Product Release Notes', documentKey: 'release_notes', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'New Doc', I: 'New', J: 'No', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Validation Summary Report', documentKey: 'validation_summary', B: 'New doc', C: 'New', D: 'No', E: 'NA', F: 'NA', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'System Release Notice', documentKey: 'system_release', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'New Doc', I: 'New', J: 'No', K: 'NA', L: 'NA', M: 'NA' }
  ];

  private storageKey = 'document-configurations';

  getReleaseTypes(): ReleaseType[] {
    return this.releaseTypes;
  }

  getDocumentsForRelease(releaseTypeName: string): DocumentRequirement[] {
    const releaseType = this.releaseTypes.find(rt => rt.name === releaseTypeName);
    if (!releaseType) return [];

    // Check if we have saved configurations
    const savedConfig = this.getConfiguration(releaseTypeName);
    
    if (savedConfig) {
      return savedConfig.documents;
    }

    // Return default configuration
    return this.documentData.map(doc => ({
      documentName: doc.documentName,
      documentKey: doc.documentKey,
      docUpVersion: doc[releaseType.columns.docUpVersion] || 'NA',
      docId: doc[releaseType.columns.docId] || 'NA',
      docHistory: doc[releaseType.columns.docHistory] || 'NA',
      enabled: !(doc[releaseType.columns.docUpVersion] === 'NA' || doc[releaseType.columns.docUpVersion] === 'NCC')
    }));
  }

  saveConfiguration(config: ReleaseConfiguration): void {
    const allConfigs = this.getAllConfigurations();
    const existingIndex = allConfigs.findIndex(c => c.releaseType === config.releaseType);
    
    if (existingIndex >= 0) {
      allConfigs[existingIndex] = config;
    } else {
      allConfigs.push(config);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(allConfigs));
  }

  getConfiguration(releaseType: string): ReleaseConfiguration | null {
    const allConfigs = this.getAllConfigurations();
    return allConfigs.find(c => c.releaseType === releaseType) || null;
  }

  private getAllConfigurations(): ReleaseConfiguration[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  resetToDefault(releaseType: string): void {
    const allConfigs = this.getAllConfigurations();
    const filteredConfigs = allConfigs.filter(c => c.releaseType !== releaseType);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredConfigs));
  }
}