-- =====================================================
-- SEED DATA FOR DOCUMENTATION REQUIREMENTS GENERATOR
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. SEED USERS
-- =====================================================
-- Passwords are hashed with bcrypt (all passwords: 'password123')
-- In a real app, you'd hash these properly, for now they're placeholders
INSERT INTO users (id, username, email, password_hash, full_name, role, department, is_active) VALUES
-- Admin users
(uuid_generate_v4(), 'admin', 'admin@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'System Administrator', 'admin', 'IT', true),
(uuid_generate_v4(), 'john.admin', 'john.admin@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'John Smith', 'admin', 'IT', true),

-- Managers
(uuid_generate_v4(), 'sarah.manager', 'sarah.manager@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Sarah Johnson', 'manager', 'Product Management', true),
(uuid_generate_v4(), 'michael.brown', 'michael.brown@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Michael Brown', 'manager', 'Engineering', true),

-- Technical Writers
(uuid_generate_v4(), 'emma.writer', 'emma.writer@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Emma Wilson', 'writer', 'Documentation', true),
(uuid_generate_v4(), 'david.chen', 'david.chen@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'David Chen', 'writer', 'Documentation', true),
(uuid_generate_v4(), 'lisa.garcia', 'lisa.garcia@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Lisa Garcia', 'writer', 'Documentation', true),

-- QA Engineers
(uuid_generate_v4(), 'robert.qa', 'robert.qa@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Robert Taylor', 'qa', 'Quality Assurance', true),
(uuid_generate_v4(), 'priya.patel', 'priya.patel@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Priya Patel', 'qa', 'Quality Assurance', true),

-- Viewers
(uuid_generate_v4(), 'james.viewer', 'james.viewer@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'James Wilson', 'viewer', 'Sales', true),
(uuid_generate_v4(), 'maria.santos', 'maria.santos@docgen.com', '$2a$10$X7Uh9U5QF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Maria Santos', 'viewer', 'Customer Support', true);

-- =====================================================
-- 2. SEED RELEASE TYPE DEFINITIONS
-- =====================================================
INSERT INTO release_type_definitions (id, name, description, display_order, color_code, icon_name, is_active) VALUES
(uuid_generate_v4(), 'Major Upgrade', 'Significant new features and architectural changes', 1, '#4f46e5', 'rocket', true),
(uuid_generate_v4(), 'Minor Update', 'Small enhancements and improvements', 2, '#10b981', 'sparkles', true),
(uuid_generate_v4(), 'Patch', 'Bug fixes and minor corrections', 3, '#f59e0b', 'bug', true),
(uuid_generate_v4(), 'Hot Fix', 'Critical fixes requiring immediate deployment', 4, '#ef4444', 'fire', true),
(uuid_generate_v4(), 'Compliance Update', 'Regulatory or compliance changes', 5, '#8b5cf6', 'shield', true),
(uuid_generate_v4(), 'Security Update', 'Security patches and vulnerability fixes', 6, '#dc2626', 'lock', true),
(uuid_generate_v4(), 'Emergency Release', 'Urgent fixes for production issues', 7, '#b91c1c', 'alert-triangle', true);

-- =====================================================
-- 3. SEED DOCUMENT TEMPLATES
-- =====================================================
-- Get release type IDs for reference (we'll use a subquery to get them)
WITH rt AS (
    SELECT name, id FROM release_type_definitions
)
INSERT INTO document_templates (id, document_name, description, category, default_action, is_active) VALUES
-- Requirements Category
(uuid_generate_v4(), 'Over-arching Change Request', 'Main change request document covering all aspects of the change', 'Requirements', 'Create/Update', true),
(uuid_generate_v4(), 'Business Requirements Document', 'Detailed business requirements and stakeholder needs', 'Requirements', 'Create/Update', true),
(uuid_generate_v4(), 'Functional Requirements Specification', 'Detailed functional requirements for the change', 'Requirements', 'Create/Update', true),
(uuid_generate_v4(), 'System Requirements Specification', 'Technical system requirements', 'Requirements', 'Create/Update', true),
(uuid_generate_v4(), 'User Requirements Document', 'Requirements from end-user perspective', 'Requirements', 'Create/Update', true),

-- Assessment Category
(uuid_generate_v4(), 'Risk Assessment', 'Comprehensive risk analysis document', 'Assessment', 'Create/Update', true),
(uuid_generate_v4(), 'Impact Assessment - Argus versions', 'Impact analysis for Argus versions', 'Assessment', 'Create/Update', true),
(uuid_generate_v4(), 'Impact Assessment - Application', 'Application-level impact analysis', 'Assessment', 'Create/Update', true),
(uuid_generate_v4(), 'Security Impact Assessment', 'Security implications and risks', 'Assessment', 'Create/Update', true),
(uuid_generate_v4(), 'Data Privacy Assessment', 'GDPR and data privacy compliance assessment', 'Assessment', 'Create/Update', true),

-- Planning Category
(uuid_generate_v4(), 'Project Plan', 'Overall project plan and timeline', 'Planning', 'Create/Update', true),
(uuid_generate_v4(), 'Release Plan', 'Release schedule and milestones', 'Planning', 'Create/Update', true),
(uuid_generate_v4(), 'Resource Allocation Plan', 'Team resource planning', 'Planning', 'Create/Update', true),
(uuid_generate_v4(), 'Communication Plan', 'Stakeholder communication strategy', 'Planning', 'Create/Update', true),

-- Testing Category
(uuid_generate_v4(), 'Test Plan', 'Detailed testing strategy and test cases', 'Testing', 'Create/Update', true),
(uuid_generate_v4(), 'Test Summary Report', 'Summary of test execution results', 'Testing', 'Create/Update', true),
(uuid_generate_v4(), 'User Acceptance Test Plan', 'UAT strategy and test cases', 'Testing', 'Create/Update', true),
(uuid_generate_v4(), 'UAT Summary Report', 'UAT execution results', 'Testing', 'Create/Update', true),
(uuid_generate_v4(), 'Performance Test Plan', 'Performance and load testing strategy', 'Testing', 'Create/Update', true),
(uuid_generate_v4(), 'Performance Test Report', 'Performance test results', 'Testing', 'Create/Update', true),
(uuid_generate_v4(), 'Security Test Plan', 'Security testing approach', 'Testing', 'Create/Update', true),
(uuid_generate_v4(), 'Security Test Report', 'Security testing results', 'Testing', 'Create/Update', true),

-- Validation Category
(uuid_generate_v4(), 'Validation Plan', 'Validation approach and criteria', 'Validation', 'Create/Update', true),
(uuid_generate_v4(), 'Validation Summary Report', 'Summary of validation activities', 'Validation', 'Create/Update', true),
(uuid_generate_v4(), 'Installation Qualification (IQ)', 'Installation validation', 'Validation', 'Create/Update', true),
(uuid_generate_v4(), 'Operational Qualification (OQ)', 'Operational validation', 'Validation', 'Create/Update', true),
(uuid_generate_v4(), 'Performance Qualification (PQ)', 'Performance validation', 'Validation', 'Create/Update', true),

-- Traceability Category
(uuid_generate_v4(), 'Traceability Matrix (Application)', 'Requirements traceability for application', 'Traceability', 'Update', true),
(uuid_generate_v4(), 'Traceability Matrix (Mart)', 'Requirements traceability for mart', 'Traceability', 'Update', true),
(uuid_generate_v4(), 'Traceability Matrix (End-to-End)', 'End-to-end traceability', 'Traceability', 'Update', true),

-- User Documentation Category
(uuid_generate_v4(), 'User Manual', 'End-user documentation', 'User Documentation', 'Create/Update', true),
(uuid_generate_v4(), 'Installation Guide', 'System installation instructions', 'User Documentation', 'Create/Update', true),
(uuid_generate_v4(), 'Administrator Guide', 'System administration documentation', 'User Documentation', 'Create/Update', true),
(uuid_generate_v4(), 'Quick Start Guide', 'Getting started guide for users', 'User Documentation', 'Create/Update', true),
(uuid_generate_v4(), 'Training Materials', 'User training documentation', 'User Documentation', 'Create/Update', true),
(uuid_generate_v4(), 'FAQ Document', 'Frequently asked questions', 'User Documentation', 'Create/Update', true),

-- Reporting Category
(uuid_generate_v4(), 'Release Notes', 'Release details and known issues', 'Reporting', 'Create/Update', true),
(uuid_generate_v4(), 'Deployment Report', 'Deployment summary and verification', 'Reporting', 'Create/Update', true),
(uuid_generate_v4(), 'Status Report', 'Project status updates', 'Reporting', 'Create/Update', true),
(uuid_generate_v4(), 'Executive Summary', 'High-level summary for management', 'Reporting', 'Create/Update', true),

-- Release Category
(uuid_generate_v4(), 'Release Checklist', 'Pre-release verification checklist', 'Release', 'Create/Update', true),
(uuid_generate_v4(), 'Deployment Plan', 'Production deployment steps', 'Release', 'Create/Update', true),
(uuid_generate_v4(), 'Rollback Plan', 'Recovery and rollback procedures', 'Release', 'Create/Update', true),
(uuid_generate_v4(), 'Change Advisory Board (CAB) Minutes', 'CAB meeting minutes and approvals', 'Release', 'Create/Update', true),

-- Compliance Category
(uuid_generate_v4(), 'Compliance Checklist', 'Regulatory compliance verification', 'Compliance', 'Create/Update', true),
(uuid_generate_v4(), 'Audit Report', 'Internal/external audit findings', 'Compliance', 'Create/Update', true),
(uuid_generate_v4(), 'Regulatory Submission', 'Documents for regulatory bodies', 'Compliance', 'Create/Update', true),
(uuid_generate_v4(), 'SOX Compliance Document', 'Sarbanes-Oxley compliance evidence', 'Compliance', 'Create/Update', true),
(uuid_generate_v4(), 'HIPAA Compliance Assessment', 'HIPAA compliance verification', 'Compliance', 'Create/Update', true),
(uuid_generate_v4(), 'GDPR Compliance Documentation', 'GDPR compliance evidence', 'Compliance', 'Create/Update', true),

-- Security Category
(uuid_generate_v4(), 'Security Architecture Review', 'Security architecture assessment', 'Security', 'Create/Update', true),
(uuid_generate_v4(), 'Penetration Test Report', 'Penetration testing results', 'Security', 'Create/Update', true),
(uuid_generate_v4(), 'Vulnerability Assessment', 'Security vulnerability scan results', 'Security', 'Create/Update', true),
(uuid_generate_v4(), 'Security Exception Request', 'Request for security exceptions', 'Security', 'Create/Update', true);

-- =====================================================
-- 4. SEED RELEASE DOCUMENT REQUIREMENTS
-- =====================================================
-- Get document IDs for reference
WITH doc_ids AS (
    SELECT document_name, id FROM document_templates
),
rt_ids AS (
    SELECT name, id FROM release_type_definitions
)
INSERT INTO release_document_requirements (id, release_type, document_id, doc_up_version, doc_id_rule, doc_history_rule, is_mandatory, is_recommended, display_order)
SELECT 
    uuid_generate_v4(),
    rt.name,
    d.id,
    CASE 
        WHEN d.document_name IN ('Over-arching Change Request', 'Risk Assessment', 'Impact Assessment - Argus versions') THEN 'New doc'
        WHEN d.document_name LIKE '%Traceability%' THEN 'Up-version'
        WHEN d.document_name IN ('Release Notes', 'Deployment Report') THEN 'New doc'
        ELSE 'Up-version'
    END,
    CASE 
        WHEN d.document_name IN ('Over-arching Change Request', 'Risk Assessment', 'Impact Assessment - Argus versions') THEN 'New'
        WHEN d.document_name LIKE '%Traceability%' THEN 'Same Doc ID'
        ELSE 'Same Doc ID'
    END,
    CASE 
        WHEN d.document_name IN ('Release Notes', 'Deployment Report') THEN 'Yes'
        ELSE 'Yes'
    END,
    CASE 
        WHEN d.document_name IN ('Over-arching Change Request', 'Risk Assessment', 'Test Plan', 'Validation Plan') THEN true
        ELSE false
    END,
    CASE 
        WHEN d.document_name IN ('User Manual', 'Quick Start Guide', 'FAQ Document') THEN true
        ELSE false
    END,
    row_number() OVER (ORDER BY d.document_name)
FROM doc_ids d
CROSS JOIN rt_ids rt
WHERE rt.name IN ('Major Upgrade', 'Minor Update', 'Patch', 'Hot Fix', 'Compliance Update')
AND d.document_name IN (
    'Over-arching Change Request',
    'Risk Assessment',
    'Impact Assessment - Argus versions',
    'Test Plan',
    'Test Summary Report',
    'Validation Plan',
    'Validation Summary Report',
    'Traceability Matrix (Application)',
    'Traceability Matrix (Mart)',
    'User Acceptance Test Plan',
    'Installation Guide',
    'Release Notes',
    'Deployment Report'
);

-- =====================================================
-- 5. SEED STAKEHOLDER TEMPLATES
-- =====================================================
-- These will be used as templates when creating change requests
INSERT INTO app_configurations (id, config_key, config_value, description) VALUES
(uuid_generate_v4(), 'stakeholder.templates', '{
  "templates": [
    {
      "name": "Technical Writer",
      "role": "Documentation Reviewer",
      "department": "Documentation",
      "responsibilities": "Review and update documentation, ensure accuracy and completeness"
    },
    {
      "name": "QA Lead",
      "role": "Testing Approver",
      "department": "Quality Assurance",
      "responsibilities": "Approve test plans, review test results, ensure quality standards"
    },
    {
      "name": "Product Manager",
      "role": "Business Approver",
      "department": "Product Management",
      "responsibilities": "Approve business requirements, ensure alignment with product strategy"
    },
    {
      "name": "Release Manager",
      "role": "Release Approver",
      "department": "Release Management",
      "responsibilities": "Coordinate release activities, approve deployment"
    },
    {
      "name": "Security Architect",
      "role": "Security Reviewer",
      "department": "Security",
      "responsibilities": "Review security implications, approve security controls"
    },
    {
      "name": "Development Lead",
      "role": "Technical Reviewer",
      "department": "Engineering",
      "responsibilities": "Review technical implementation, estimate effort"
    },
    {
      "name": "Operations Lead",
      "role": "Operations Reviewer",
      "department": "IT Operations",
      "responsibilities": "Review deployment impact, ensure operational readiness"
    },
    {
      "name": "Compliance Officer",
      "role": "Compliance Approver",
      "department": "Legal & Compliance",
      "responsibilities": "Ensure regulatory compliance, approve compliance documentation"
    },
    {
      "name": "Data Privacy Officer",
      "role": "Privacy Reviewer",
      "department": "Legal & Compliance",
      "responsibilities": "Review data privacy implications, ensure GDPR/HIPAA compliance"
    },
    {
      "name": "Customer Support Lead",
      "role": "Support Consultant",
      "department": "Customer Support",
      "responsibilities": "Provide customer impact assessment, prepare support team"
    }
  ]
}', 'Stakeholder templates for change requests');

-- =====================================================
-- 6. SEED NOTIFICATION TEMPLATES
-- =====================================================
INSERT INTO notification_templates (id, template_key, subject, body, type, variables, is_active) VALUES
(uuid_generate_v4(), 'cr.created', 'Change Request Created: {{crNumber}}', 
'<h2>New Change Request Created</h2>
<p><strong>CR Number:</strong> {{crNumber}}</p>
<p><strong>Title:</strong> {{title}}</p>
<p><strong>Priority:</strong> {{priority}}</p>
<p><strong>Created By:</strong> {{createdBy}}</p>
<p><strong>Description:</strong></p>
<p>{{description}}</p>
<p><a href="{{appUrl}}/change-requests/{{crId}}">View Change Request</a></p>',
'email', '{"crNumber": "", "title": "", "priority": "", "createdBy": "", "description": "", "crId": "", "appUrl": ""}', true),

(uuid_generate_v4(), 'cr.submitted', 'Change Request Submitted for Review: {{crNumber}}', 
'<h2>Change Request Submitted for Review</h2>
<p><strong>CR Number:</strong> {{crNumber}}</p>
<p><strong>Title:</strong> {{title}}</p>
<p><strong>Priority:</strong> {{priority}}</p>
<p><strong>Submitted By:</strong> {{submittedBy}}</p>
<p><strong>Your approval is required.</strong></p>
<p><a href="{{appUrl}}/change-requests/{{crId}}">Review Change Request</a></p>',
'email', '{"crNumber": "", "title": "", "priority": "", "submittedBy": "", "crId": "", "appUrl": ""}', true),

(uuid_generate_v4(), 'cr.approved', 'Change Request Approved: {{crNumber}}', 
'<h2>Change Request Approved</h2>
<p><strong>CR Number:</strong> {{crNumber}}</p>
<p><strong>Title:</strong> {{title}}</p>
<p><strong>Approved By:</strong> {{approvedBy}}</p>
<p><strong>Comments:</strong> {{comments}}</p>
<p><a href="{{appUrl}}/change-requests/{{crId}}">View Change Request</a></p>',
'email', '{"crNumber": "", "title": "", "approvedBy": "", "comments": "", "crId": "", "appUrl": ""}', true),

(uuid_generate_v4(), 'cr.rejected', 'Change Request Rejected: {{crNumber}}', 
'<h2>Change Request Rejected</h2>
<p><strong>CR Number:</strong> {{crNumber}}</p>
<p><strong>Title:</strong> {{title}}</p>
<p><strong>Rejected By:</strong> {{rejectedBy}}</p>
<p><strong>Reason:</strong> {{reason}}</p>
<p><a href="{{appUrl}}/change-requests/{{crId}}">View Change Request</a></p>',
'email', '{"crNumber": "", "title": "", "rejectedBy": "", "reason": "", "crId": "", "appUrl": ""}', true),

(uuid_generate_v4(), 'cr.status.updated', 'Change Request Status Updated: {{crNumber}}', 
'<h2>Change Request Status Updated</h2>
<p><strong>CR Number:</strong> {{crNumber}}</p>
<p><strong>Title:</strong> {{title}}</p>
<p><strong>Old Status:</strong> {{oldStatus}}</p>
<p><strong>New Status:</strong> {{newStatus}}</p>
<p><strong>Updated By:</strong> {{updatedBy}}</p>
<p><strong>Comments:</strong> {{comments}}</p>
<p><a href="{{appUrl}}/change-requests/{{crId}}">View Change Request</a></p>',
'email', '{"crNumber": "", "title": "", "oldStatus": "", "newStatus": "", "updatedBy": "", "comments": "", "crId": "", "appUrl": ""}', true),

(uuid_generate_v4(), 'cr.comment.added', 'New Comment on Change Request: {{crNumber}}', 
'<h2>New Comment Added</h2>
<p><strong>CR Number:</strong> {{crNumber}}</p>
<p><strong>Title:</strong> {{title}}</p>
<p><strong>Comment By:</strong> {{commentBy}}</p>
<p><strong>Comment:</strong> {{comment}}</p>
<p><a href="{{appUrl}}/change-requests/{{crId}}">View Change Request</a></p>',
'email', '{"crNumber": "", "title": "", "commentBy": "", "comment": "", "crId": "", "appUrl": ""}', true),

(uuid_generate_v4(), 'cr.document.assigned', 'Document Assigned to You: {{documentName}}', 
'<h2>Document Assigned to You</h2>
<p><strong>CR Number:</strong> {{crNumber}}</p>
<p><strong>Document:</strong> {{documentName}}</p>
<p><strong>Due Date:</strong> {{dueDate}}</p>
<p><strong>Assigned By:</strong> {{assignedBy}}</p>
<p><a href="{{appUrl}}/change-requests/{{crId}}/documents/{{documentId}}">View Document</a></p>',
'email', '{"crNumber": "", "documentName": "", "dueDate": "", "assignedBy": "", "crId": "", "documentId": "", "appUrl": ""}', true);

-- =====================================================
-- 7. SEED APP CONFIGURATIONS
-- =====================================================
INSERT INTO app_configurations (id, config_key, config_value, description, is_system) VALUES
(uuid_generate_v4(), 'app.settings', '{
  "appName": "Documentation Requirements Generator",
  "version": "2.0.0",
  "company": "DocGen Inc.",
  "supportEmail": "support@docgen.com",
  "maxFileSize": 10485760,
  "allowedFileTypes": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".xlsm", ".ppt", ".pptx", ".txt", ".jpg", ".jpeg", ".png", ".gif", ".zip"],
  "dateFormat": "MMM dd, yyyy",
  "timeFormat": "HH:mm",
  "itemsPerPage": 20,
  "sessionTimeout": 3600,
  "enableNotifications": true,
  "enableEmailAlerts": true,
  "maintenanceMode": false
}', 'Application settings', true),

(uuid_generate_v4(), 'cr.settings', '{
  "defaultPriority": "Medium",
  "defaultStatus": "Draft",
  "autoGenerateCRNumber": true,
  "crNumberPrefix": "CR",
  "crNumberYearFormat": "YYYY",
  "crNumberPadding": 4,
  "allowEditingAfterSubmission": false,
  "requireApprovalFrom": ["manager", "qa", "security"],
  "daysUntilDue": 14,
  "reminderDays": [1, 3, 7],
  "escalationDays": 10
}', 'Change request default settings', true),

(uuid_generate_v4(), 'email.settings', '{
  "enabled": true,
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "fromAddress": "noreply@docgen.com",
  "fromName": "DocGen System",
  "notifyOnCreate": true,
  "notifyOnStatusChange": true,
  "notifyOnComment": true,
  "notifyOnDocumentAssignment": true,
  "notifyApprovers": true
}', 'Email notification settings', true),

(uuid_generate_v4(), 'document.categories', '{
  "categories": [
    {"name": "Requirements", "icon": "📋", "color": "#4f46e5"},
    {"name": "Assessment", "icon": "📊", "color": "#f59e0b"},
    {"name": "Planning", "icon": "📅", "color": "#10b981"},
    {"name": "Testing", "icon": "🧪", "color": "#ef4444"},
    {"name": "Validation", "icon": "✅", "color": "#8b5cf6"},
    {"name": "Traceability", "icon": "🔗", "color": "#ec4899"},
    {"name": "User Documentation", "icon": "📚", "color": "#14b8a6"},
    {"name": "Reporting", "icon": "📈", "color": "#f97316"},
    {"name": "Release", "icon": "🚀", "color": "#06b6d4"},
    {"name": "Compliance", "icon": "⚖️", "color": "#8b5cf6"},
    {"name": "Security", "icon": "🔒", "color": "#dc2626"}
  ]
}', 'Document categories configuration', true),

(uuid_generate_v4(), 'priority.definitions', '{
  "levels": [
    {"name": "Low", "icon": "🟢", "color": "#10b981", "daysToComplete": 14, "description": "Minor issues, no immediate impact"},
    {"name": "Medium", "icon": "🟡", "color": "#f59e0b", "daysToComplete": 7, "description": "Important but not critical"},
    {"name": "High", "icon": "🟠", "color": "#f97316", "daysToComplete": 3, "description": "Significant impact, needs attention"},
    {"name": "Critical", "icon": "🔴", "color": "#ef4444", "daysToComplete": 1, "description": "Business critical, immediate action required"}
  ]
}', 'Priority level definitions', true),

(uuid_generate_v4(), 'status.workflow', '{
  "statuses": [
    {"name": "Draft", "icon": "📝", "color": "#6b7280", "next": ["Submitted", "Cancelled"]},
    {"name": "Submitted", "icon": "📤", "color": "#3b82f6", "next": ["Under Review", "Rejected"]},
    {"name": "Under Review", "icon": "🔍", "color": "#f59e0b", "next": ["Approved", "Rejected"]},
    {"name": "Approved", "icon": "✅", "color": "#10b981", "next": ["Implemented", "Closed"]},
    {"name": "Rejected", "icon": "❌", "color": "#ef4444", "next": ["Draft", "Closed"]},
    {"name": "Implemented", "icon": "🛠️", "color": "#8b5cf6", "next": ["Closed"]},
    {"name": "Closed", "icon": "🔒", "color": "#374151", "next": []}
  ]
}', 'Status workflow definition', true),

(uuid_generate_v4(), 'ui.settings', '{
  "theme": "light",
  "primaryColor": "#4f46e5",
  "sidebarCollapsed": false,
  "showReleaseTypeColors": true,
  "defaultView": "list",
  "itemsPerPageOptions": [10, 20, 50, 100],
  "dashboardRefreshInterval": 300000,
  "enableAnimations": true
}', 'UI settings for frontend', true);

-- =====================================================
-- 8. SEED SAMPLE PROJECTS
-- =====================================================
-- First, get user IDs for managers
WITH manager_ids AS (
    SELECT id FROM users WHERE role = 'manager' LIMIT 2
)
INSERT INTO projects (id, project_code, name, description, manager_id, status, start_date, end_date)
SELECT 
    uuid_generate_v4(),
    'PROJ-001',
    'Argus Platform Upgrade',
    'Major upgrade to Argus platform including new features and security enhancements',
    (SELECT id FROM manager_ids LIMIT 1),
    'active',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '60 days'
UNION ALL
SELECT 
    uuid_generate_v4(),
    'PROJ-002',
    'Documentation System Migration',
    'Migration to new documentation management system',
    (SELECT id FROM manager_ids OFFSET 1 LIMIT 1),
    'active',
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '45 days'
UNION ALL
SELECT 
    uuid_generate_v4(),
    'PROJ-003',
    'Security Compliance Update',
    'Updates to meet new security compliance requirements',
    (SELECT id FROM manager_ids LIMIT 1),
    'active',
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '30 days';

-- =====================================================
-- 9. SEED SAMPLE RELEASES
-- =====================================================
WITH project_ids AS (
    SELECT id FROM projects LIMIT 3
),
rt_ids AS (
    SELECT name FROM release_type_definitions LIMIT 5
)
INSERT INTO releases (id, project_id, release_number, release_type, name, description, planned_date, status)
SELECT 
    uuid_generate_v4(),
    p.id,
    'v2.0.0',
    'Major Upgrade',
    'Argus v2.0 Release',
    'Major feature release with enhanced functionality',
    CURRENT_DATE + INTERVAL '30 days',
    'planned'
FROM project_ids p
UNION ALL
SELECT 
    uuid_generate_v4(),
    p.id,
    'v2.1.0',
    'Minor Update',
    'Q2 Feature Release',
    'Minor enhancements and bug fixes',
    CURRENT_DATE + INTERVAL '60 days',
    'planned'
FROM project_ids p;

-- =====================================================
-- 10. SEED SAMPLE CHANGE REQUESTS
-- =====================================================
-- Get user IDs
WITH user_ids AS (
    SELECT id, username FROM users WHERE username IN ('emma.writer', 'john.admin', 'sarah.manager')
),
project_ids AS (
    SELECT id FROM projects LIMIT 1
),
release_ids AS (
    SELECT id FROM releases LIMIT 1
)
INSERT INTO change_requests (
    id, cr_number, project_id, release_id, title, description, 
    priority, type, status, requested_by_id, requested_date, target_version
)
SELECT 
    uuid_generate_v4(),
    'CR-2024-001',
    (SELECT id FROM project_ids),
    (SELECT id FROM release_ids),
    'API Documentation Update',
    'Update API documentation for new endpoints and authentication changes including OAuth2 implementation and rate limiting details',
    'High',
    'Documentation',
    'In Progress',
    (SELECT id FROM user_ids WHERE username = 'emma.writer'),
    CURRENT_DATE - INTERVAL '15 days',
    'v2.0.0'
UNION ALL
SELECT 
    uuid_generate_v4(),
    'CR-2024-002',
    (SELECT id FROM project_ids),
    (SELECT id FROM release_ids),
    'User Guide Revision',
    'Revise user guide to include new features from Q1 release with screenshots and step-by-step instructions',
    'Medium',
    'Documentation',
    'Draft',
    (SELECT id FROM user_ids WHERE username = 'sarah.manager'),
    CURRENT_DATE - INTERVAL '10 days',
    'v2.0.0'
UNION ALL
SELECT 
    uuid_generate_v4(),
    'CR-2024-003',
    (SELECT id FROM project_ids),
    (SELECT id FROM release_ids),
    'Security Vulnerability Patch',
    'Critical security patch for authentication module',
    'Critical',
    'Security',
    'Under Review',
    (SELECT id FROM user_ids WHERE username = 'john.admin'),
    CURRENT_DATE - INTERVAL '5 days',
    'v2.0.1';

-- =====================================================
-- 11. SEED CR DOCUMENTS
-- =====================================================
WITH cr_ids AS (
    SELECT id FROM change_requests LIMIT 3
),
doc_ids AS (
    SELECT document_name, id FROM document_templates WHERE document_name IN (
        'Over-arching Change Request',
        'Risk Assessment',
        'Test Plan',
        'Release Notes'
    )
)
INSERT INTO cr_documents (id, cr_id, document_name, action_required, status, due_date)
SELECT 
    uuid_generate_v4(),
    cr.id,
    d.document_name,
    CASE 
        WHEN d.document_name = 'Over-arching Change Request' THEN 'Create New'
        WHEN d.document_name = 'Risk Assessment' THEN 'Create New'
        WHEN d.document_name = 'Test Plan' THEN 'Update Existing'
        ELSE 'Review'
    END,
    CASE 
        WHEN d.document_name = 'Over-arching Change Request' THEN 'In Progress'
        WHEN d.document_name = 'Risk Assessment' THEN 'Not Started'
        WHEN d.document_name = 'Test Plan' THEN 'Not Started'
        ELSE 'Not Started'
    END,
    CURRENT_DATE + INTERVAL '14 days'
FROM cr_ids cr
CROSS JOIN doc_ids d;

-- =====================================================
-- 12. SEED CR STAKEHOLDERS
-- =====================================================
WITH cr_ids AS (
    SELECT id FROM change_requests LIMIT 1
),
user_ids AS (
    SELECT id, full_name FROM users WHERE role IN ('manager', 'qa', 'writer') LIMIT 3
)
INSERT INTO cr_stakeholders (id, cr_id, user_id, role, department, status)
SELECT 
    uuid_generate_v4(),
    (SELECT id FROM cr_ids),
    u.id,
    CASE 
        WHEN u.full_name LIKE '%Sarah%' THEN 'Approver'
        WHEN u.full_name LIKE '%Robert%' THEN 'Reviewer'
        ELSE 'Consulted'
    END,
    u.department,
    CASE 
        WHEN u.full_name LIKE '%Sarah%' THEN 'Pending'
        WHEN u.full_name LIKE '%Robert%' THEN 'Pending'
        ELSE 'Notified'
    END
FROM user_ids u;

-- =====================================================
-- 13. SEED CR HISTORY
-- =====================================================
WITH cr_ids AS (
    SELECT id FROM change_requests WHERE cr_number = 'CR-2024-001'
),
user_ids AS (
    SELECT id FROM users WHERE username = 'emma.writer'
)
INSERT INTO cr_history (id, cr_id, user_id, action, comments, created_at)
SELECT 
    uuid_generate_v4(),
    (SELECT id FROM cr_ids),
    (SELECT id FROM user_ids),
    'Created',
    'Initial change request created',
    CURRENT_DATE - INTERVAL '15 days'
UNION ALL
SELECT 
    uuid_generate_v4(),
    (SELECT id FROM cr_ids),
    (SELECT id FROM user_ids),
    'Document Added',
    'Added API documentation document',
    CURRENT_DATE - INTERVAL '14 days'
UNION ALL
SELECT 
    uuid_generate_v4(),
    (SELECT id FROM cr_ids),
    (SELECT id FROM user_ids),
    'Status Changed',
    'Changed status from Draft to In Progress',
    CURRENT_DATE - INTERVAL '13 days'
UNION ALL
SELECT 
    uuid_generate_v4(),
    (SELECT id FROM cr_ids),
    (SELECT id FROM user_ids),
    'Comment Added',
    'Started working on API documentation updates',
    CURRENT_DATE - INTERVAL '12 days';

-- =====================================================
-- 14. SEED CR RISK ASSESSMENTS
-- =====================================================
WITH cr_ids AS (
    SELECT id FROM change_requests WHERE cr_number = 'CR-2024-001'
),
user_ids AS (
    SELECT id FROM users WHERE username = 'john.admin'
)
INSERT INTO cr_risk_assessments (id, cr_id, risk_level, impact, probability, mitigation, assessed_by_id, assessed_date)
SELECT 
    uuid_generate_v4(),
    (SELECT id FROM cr_ids),
    'Medium',
    'Documentation changes may cause temporary confusion for developers if not properly communicated. API changes could impact existing integrations.',
    'Medium - Changes affect multiple endpoints but are well-documented',
    'Release communication plan includes developer notifications. Deprecation warnings will be provided 2 weeks in advance. Comprehensive changelog will be published.',
    (SELECT id FROM user_ids),
    CURRENT_DATE - INTERVAL '10 days';

-- =====================================================
-- 15. SEED DASHBOARD STATISTICS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    metric_name TEXT,
    metric_value BIGINT,
    metric_change NUMERIC,
    metric_trend TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'total_projects'::TEXT,
        COUNT(*)::BIGINT,
        0::NUMERIC,
        'stable'::TEXT
    FROM projects
    UNION ALL
    SELECT 
        'active_releases'::TEXT,
        COUNT(*)::BIGINT,
        10::NUMERIC,
        'up'::TEXT
    FROM releases WHERE status IN ('planned', 'in-progress')
    UNION ALL
    SELECT 
        'open_crs'::TEXT,
        COUNT(*)::BIGINT,
        5::NUMERIC,
        'up'::TEXT
    FROM change_requests WHERE status IN ('Draft', 'Submitted', 'Under Review')
    UNION ALL
    SELECT 
        'completed_crs'::TEXT,
        COUNT(*)::BIGINT,
        15::NUMERIC,
        'up'::TEXT
    FROM change_requests WHERE status = 'Implemented'
    UNION ALL
    SELECT 
        'pending_approvals'::TEXT,
        COUNT(*)::BIGINT,
        0::NUMERIC,
        'stable'::TEXT
    FROM cr_stakeholders WHERE status = 'Pending'
    UNION ALL
    SELECT 
        'total_documents'::TEXT,
        COUNT(*)::BIGINT,
        0::NUMERIC,
        'stable'::TEXT
    FROM document_templates WHERE is_active = true;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 16. CREATE FUNCTION TO GET RECENT ACTIVITY
-- =====================================================
CREATE OR REPLACE FUNCTION get_recent_activity(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    user_name TEXT,
    action TEXT,
    entity_type TEXT,
    entity_id UUID,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ch.id,
        u.full_name::TEXT,
        ch.action::TEXT,
        'change_request'::TEXT,
        ch.cr_id,
        ch.comments::TEXT,
        ch.created_at
    FROM cr_history ch
    JOIN users u ON ch.user_id = u.id
    ORDER BY ch.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VERIFY THE DATA
-- =====================================================
SELECT '✅ Users seeded: ' || COUNT(*) FROM users;
SELECT '✅ Release Types seeded: ' || COUNT(*) FROM release_type_definitions;
SELECT '✅ Document Templates seeded: ' || COUNT(*) FROM document_templates;
SELECT '✅ Release Document Requirements seeded: ' || COUNT(*) FROM release_document_requirements;
SELECT '✅ Notification Templates seeded: ' || COUNT(*) FROM notification_templates;
SELECT '✅ App Configurations seeded: ' || COUNT(*) FROM app_configurations;
SELECT '✅ Projects seeded: ' || COUNT(*) FROM projects;
SELECT '✅ Releases seeded: ' || COUNT(*) FROM releases;
SELECT '✅ Change Requests seeded: ' || COUNT(*) FROM change_requests;
SELECT '✅ CR Documents seeded: ' || COUNT(*) FROM cr_documents;
SELECT '✅ CR Stakeholders seeded: ' || COUNT(*) FROM cr_stakeholders;
SELECT '✅ CR History seeded: ' || COUNT(*) FROM cr_history;
SELECT '✅ CR Risk Assessments seeded: ' || COUNT(*) FROM cr_risk_assessments;

-- =====================================================
-- COMMIT ALL CHANGES
-- =====================================================
-- Note: This is automatically committed in PostgreSQL