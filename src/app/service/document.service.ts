import { Injectable } from '@angular/core';

export interface ReleaseType {
  name: string;
  columns: {
    docUpVersion: string;
    docId: string;
    docHistory: string;
  };
}

export interface DocumentRequirement {
  documentName: string;
  docUpVersion: string;
  docId: string;
  docHistory: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private releaseTypes: ReleaseType[] = [
    {
      name: 'Major Upgrade',
      columns: { docUpVersion: 'B', docId: 'C', docHistory: 'D' }
    },
    {
      name: 'Minor Upgrade',
      columns: { docUpVersion: 'E', docId: 'F', docHistory: 'G' }
    },
    {
      name: 'Patch release',
      columns: { docUpVersion: 'H', docId: 'I', docHistory: 'J' }
    },
    {
      name: 'Hotfix',
      columns: { docUpVersion: 'K', docId: 'L', docHistory: 'M' }
    }
  ];

  private documentData: any[] = [
    { documentName: 'Application User and Functional Requirements Specification (UFRS)', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Report and Templates User and Functional Requirements Specification (UFRS)', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Mart Functional Requirements Specification (FRSX)', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'GxP Assessment', B: 'New doc', C: 'New', D: 'No', E: 'NA', F: 'NA', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Risk Assessment', B: 'New doc', C: 'New', D: 'No', E: 'NA', F: 'NA', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Validation Plan', B: 'New doc', C: 'New', D: 'No', E: 'NA', F: 'NA', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Over-arching Change Request', B: 'NA', C: 'NA', D: 'NA', E: 'New Doc', F: 'New', G: 'No', H: 'New Doc', I: 'New (same project code)', J: 'NA', K: 'New Doc', L: 'New (same project code)', M: 'NA' },
    { documentName: '21 CFR Part 11 Assessment', B: 'New doc', C: 'New', D: 'No', E: 'Usually No', F: 'New if doc needed', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'EU Annex 11 Assessment', B: 'New doc', C: 'New', D: 'No', E: 'Usually No', F: 'New if doc needed', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'MHLW Assessment', B: 'New doc', C: 'New', D: 'No', E: 'Usually No', F: 'New if doc needed', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Configuration Baseline Document (CBD)', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'Up-version if needed', L: 'Same Doc ID - just version different', M: 'Yes' },
    { documentName: 'Test Plan', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'System Design Specification (SDS)', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'Up-version if needed', L: 'Same Doc ID - just version different', M: 'Yes' },
    { documentName: 'Impact Assessment - Argus versions', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'New Doc if needed', L: 'New (same project code)', M: 'NA' },
    { documentName: 'Code Review Checklist', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'New Doc', I: 'New (same project code)', J: 'NA', K: 'New Doc', L: 'New (same project code)', M: 'NA' },
    { documentName: 'Unit Testing', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'New Doc', I: 'New (same project code)', J: 'NA', K: 'New Doc', L: 'New (same project code)', M: 'NA' },
    { documentName: 'Installation Qualification (IQ)', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'Same Doc ID - just version different', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'Up-version if needed', L: 'Same Doc ID - just version different', M: 'Yes' },
    { documentName: 'Operational Qualification (OQ)', B: 'New doc', C: 'New', D: 'No', E: 'New Doc + upversion for regression as needed', F: 'New if new; if old being up-versioned - keep same Doc ID - just version diff.', G: 'Yes if up-versioning', H: 'New Doc + upversion for regression as needed', I: 'New if new; if old being up-versioned - keep same Doc ID - just version diff.', J: 'Yes if up-versioning', K: 'New Doc + upversion for regression as needed', L: 'New if new; if old being up-versioned - keep same Doc ID - just version diff.', M: 'Yes if up-versioning' },
    { documentName: 'Qualification Plan', B: 'New doc', C: 'New', D: 'No', E: 'New if needed', F: 'New if doc needed', G: 'No', H: 'NCC', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Network Environment Design', B: 'New doc', C: 'New', D: 'No', E: 'New if needed', F: 'New if doc needed', G: 'No', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Qualification Summary Report', B: 'New doc', C: 'New', D: 'No', E: 'New if needed', F: 'New if doc needed', G: 'No', H: 'NCC', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Environment Release Notice', B: 'New doc', C: 'New', D: 'No', E: 'New if needed', F: 'New if doc needed', G: 'No', H: 'NCC', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Traceability Matrix (Application)', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Traceability Matrix (Mart)', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Test Summary Report', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'User Manual', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Admin Guide', B: 'Up-version', C: 'New', D: 'Yes', E: 'Up-version', F: 'New', G: 'Yes', H: 'Up-version if needed', I: 'Same Doc ID - just version different', J: 'Yes', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Product Release Notes', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'New Doc', I: 'New', J: 'No', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'Validation Summary Report', B: 'New doc', C: 'New', D: 'No', E: 'NA', F: 'NA', G: 'NA', H: 'NA', I: 'NA', J: 'NA', K: 'NA', L: 'NA', M: 'NA' },
    { documentName: 'System Release Notice', B: 'New doc', C: 'New', D: 'No', E: 'New Doc', F: 'New', G: 'No', H: 'New Doc', I: 'New', J: 'No', K: 'NA', L: 'NA', M: 'NA' }
  ];

  getReleaseTypes(): ReleaseType[] {
    return this.releaseTypes;
  }

  getDocumentsForRelease(releaseTypeName: string): DocumentRequirement[] {
    const releaseType = this.releaseTypes.find(rt => rt.name === releaseTypeName);
    if (!releaseType) return [];

    return this.documentData.map(doc => ({
      documentName: doc.documentName,
      docUpVersion: doc[releaseType.columns.docUpVersion] || 'NA',
      docId: doc[releaseType.columns.docId] || 'NA',
      docHistory: doc[releaseType.columns.docHistory] || 'NA'
    }));
  }
}