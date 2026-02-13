-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'writer', 'qa', 'viewer')),
    department VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500) UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. PROJECTS & RELEASES
-- =====================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
    start_date DATE,
    end_date DATE,
    metadata JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE releases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    release_number VARCHAR(20) NOT NULL,
    release_type VARCHAR(30) NOT NULL,
    name VARCHAR(100),
    description TEXT,
    planned_date DATE,
    release_date DATE,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed', 'cancelled')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, release_number)
);

-- =====================================================
-- 3. DOCUMENTS & REQUIREMENTS
-- =====================================================

CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Requirements', 'Assessment', 'Planning', 'Testing', 
        'Validation', 'Traceability', 'User Documentation', 
        'Reporting', 'Release', 'Compliance', 'Security'
    )),
    default_action VARCHAR(50) DEFAULT 'Create/Update',
    template_path TEXT,
    version VARCHAR(20) DEFAULT '1.0.0',
    is_active BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE release_type_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(30) UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    color_code VARCHAR(10) DEFAULT '#4f46e5',
    icon_name VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default release types
INSERT INTO release_type_definitions (name, description, display_order, color_code, icon_name) VALUES
('Major Upgrade', 'Significant new features and architectural changes', 1, '#4f46e5', 'rocket'),
('Minor Update', 'Small enhancements and improvements', 2, '#10b981', 'sparkles'),
('Patch', 'Bug fixes and minor corrections', 3, '#f59e0b', 'bug'),
('Hot Fix', 'Critical fixes requiring immediate deployment', 4, '#ef4444', 'fire'),
('Compliance Update', 'Regulatory or compliance changes', 5, '#8b5cf6', 'shield');

CREATE TABLE release_document_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    release_type VARCHAR(30) NOT NULL REFERENCES release_type_definitions(name) ON DELETE CASCADE,
    document_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
    doc_up_version VARCHAR(50) NOT NULL,
    doc_id_rule VARCHAR(100) NOT NULL,
    doc_history_rule VARCHAR(10) NOT NULL CHECK (doc_history_rule IN ('Yes', 'No', 'NA')),
    is_mandatory BOOLEAN DEFAULT true,
    is_recommended BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(release_type, document_id)
);

CREATE TABLE project_document_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    document_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
    release_type VARCHAR(30) NOT NULL REFERENCES release_type_definitions(name) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT true,
    custom_action VARCHAR(100),
    custom_id_rule VARCHAR(100),
    custom_history_rule VARCHAR(10),
    override_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    UNIQUE(project_id, document_id, release_type)
);

-- =====================================================
-- 4. CHANGE REQUESTS
-- =====================================================

CREATE TABLE change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cr_number VARCHAR(20) UNIQUE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    release_id UUID REFERENCES releases(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    type VARCHAR(30) NOT NULL CHECK (type IN ('Enhancement', 'Bug Fix', 'Documentation', 'New Feature', 'Compliance', 'Security')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Implemented', 'Closed')),
    requested_by UUID REFERENCES users(id),
    requested_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    target_version VARCHAR(20),
    closure_date TIMESTAMP WITH TIME ZONE,
    closure_comments TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sequence for CR numbers
CREATE SEQUENCE cr_number_seq START 1000;

-- Function to generate CR number
CREATE OR REPLACE FUNCTION generate_cr_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.cr_number := 'CR-' || TO_CHAR(NEW.created_at, 'YYYY') || '-' || LPAD(nextval('cr_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_cr_number
    BEFORE INSERT ON change_requests
    FOR EACH ROW
    EXECUTE FUNCTION generate_cr_number();

CREATE TABLE cr_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cr_id UUID REFERENCES change_requests(id) ON DELETE CASCADE,
    document_id UUID REFERENCES document_templates(id),
    document_name VARCHAR(200) NOT NULL,
    action_required VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'Not Required', 'Blocked')),
    assigned_to UUID REFERENCES users(id),
    due_date DATE,
    completed_date TIMESTAMP WITH TIME ZONE,
    file_path TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cr_stakeholders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cr_id UUID REFERENCES change_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Notified')),
    comments TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cr_id, user_id)
);

CREATE TABLE cr_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cr_id UUID REFERENCES change_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    field_name VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cr_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cr_id UUID REFERENCES change_requests(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cr_risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cr_id UUID REFERENCES change_requests(id) ON DELETE CASCADE UNIQUE,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
    impact TEXT NOT NULL,
    probability TEXT NOT NULL,
    mitigation TEXT NOT NULL,
    residual_risk TEXT,
    assessed_by UUID REFERENCES users(id),
    assessed_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. CONFIGURATION & SETTINGS
-- =====================================================

CREATE TABLE app_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_key VARCHAR(50) UNIQUE NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('email', 'in-app', 'slack')),
    variables JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. AUDIT & LOGGING
-- =====================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_message TEXT,
    stack_trace TEXT,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    status_code INTEGER,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Projects indexes
CREATE INDEX idx_projects_code ON projects(project_code);
CREATE INDEX idx_projects_manager ON projects(manager_id);
CREATE INDEX idx_projects_status ON projects(status);

-- Releases indexes
CREATE INDEX idx_releases_project ON releases(project_id);
CREATE INDEX idx_releases_type ON releases(release_type);
CREATE INDEX idx_releases_status ON releases(status);
CREATE INDEX idx_releases_date ON releases(release_date);

-- Documents indexes
CREATE INDEX idx_doc_templates_category ON document_templates(category);
CREATE INDEX idx_doc_templates_active ON document_templates(is_active);
CREATE INDEX idx_release_docs_type ON release_document_requirements(release_type);
CREATE INDEX idx_release_docs_document ON release_document_requirements(document_id);
CREATE INDEX idx_project_docs_project ON project_document_configs(project_id);

-- Change Requests indexes
CREATE INDEX idx_cr_number ON change_requests(cr_number);
CREATE INDEX idx_cr_project ON change_requests(project_id);
CREATE INDEX idx_cr_release ON change_requests(release_id);
CREATE INDEX idx_cr_status ON change_requests(status);
CREATE INDEX idx_cr_priority ON change_requests(priority);
CREATE INDEX idx_cr_type ON change_requests(type);
CREATE INDEX idx_cr_requested_by ON change_requests(requested_by);
CREATE INDEX idx_cr_requested_date ON change_requests(requested_date);

-- CR Related indexes
CREATE INDEX idx_cr_docs_cr ON cr_documents(cr_id);
CREATE INDEX idx_cr_docs_status ON cr_documents(status);
CREATE INDEX idx_cr_docs_assigned ON cr_documents(assigned_to);
CREATE INDEX idx_cr_stakeholders_cr ON cr_stakeholders(cr_id);
CREATE INDEX idx_cr_stakeholders_user ON cr_stakeholders(user_id);
CREATE INDEX idx_cr_stakeholders_status ON cr_stakeholders(status);
CREATE INDEX idx_cr_history_cr ON cr_history(cr_id);
CREATE INDEX idx_cr_attachments_cr ON cr_attachments(cr_id);

-- Audit indexes
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- Error logs indexes
CREATE INDEX idx_error_created ON error_logs(created_at);
CREATE INDEX idx_error_status ON error_logs(status_code);

-- =====================================================
-- 8. TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_releases_updated_at BEFORE UPDATE ON releases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_document_templates_updated_at BEFORE UPDATE ON document_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_change_requests_updated_at BEFORE UPDATE ON change_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. SAMPLE DATA
-- =====================================================

-- Insert admin user (password: Admin@123 - hash this properly in application)
INSERT INTO users (id, username, email, password_hash, full_name, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin', 'admin@docgen.com', 'HASH_THIS_IN_APP', 'System Administrator', 'admin'),
('22222222-2222-2222-2222-222222222222', 'manager', 'manager@docgen.com', 'HASH_THIS_IN_APP', 'Project Manager', 'manager'),
('33333333-3333-3333-3333-333333333333', 'writer', 'writer@docgen.com', 'HASH_THIS_IN_APP', 'Technical Writer', 'writer');

-- Insert document templates
INSERT INTO document_templates (id, document_name, category, description) VALUES
('a1111111-1111-1111-1111-111111111111', 'Over-arching Change Request', 'Requirements', 'Main change request document covering all aspects'),
('a1111111-1111-1111-1111-111111111112', 'Risk Assessment', 'Assessment', 'Comprehensive risk analysis document'),
('a1111111-1111-1111-1111-111111111113', 'Impact Assessment - Argus versions', 'Assessment', 'Impact analysis for Argus versions'),
('a1111111-1111-1111-1111-111111111114', 'Test Plan', 'Testing', 'Detailed testing strategy and test cases'),
('a1111111-1111-1111-1111-111111111115', 'Test Summary Report', 'Reporting', 'Summary of test execution results'),
('a1111111-1111-1111-1111-111111111116', 'Validation Plan', 'Validation', 'Validation approach and criteria'),
('a1111111-1111-1111-1111-111111111117', 'Validation Summary Report', 'Validation', 'Summary of validation activities'),
('a1111111-1111-1111-1111-111111111118', 'Traceability Matrix (Application)', 'Traceability', 'Requirements traceability for application'),
('a1111111-1111-1111-1111-111111111119', 'Traceability Matrix (Mart)', 'Traceability', 'Requirements traceability for mart'),
('a1111111-1111-1111-1111-111111111120', 'User Acceptance Test Plan', 'Testing', 'UAT strategy and test cases'),
('a1111111-1111-1111-1111-111111111121', 'Installation Guide', 'User Documentation', 'System installation instructions'),
('a1111111-1111-1111-1111-111111111122', 'Release Notes', 'Release', 'Release details and known issues'),
('a1111111-1111-1111-1111-111111111123', 'API Documentation', 'Documentation', 'API reference and usage guides'),
('a1111111-1111-1111-1111-111111111124', 'Compliance Checklist', 'Compliance', 'Regulatory compliance verification');

-- Insert release document requirements for Major Upgrade
INSERT INTO release_document_requirements (release_type, document_id, doc_up_version, doc_id_rule, doc_history_rule, is_mandatory, display_order) VALUES
('Major Upgrade', 'a1111111-1111-1111-1111-111111111111', 'New doc', 'New', 'Yes', true, 1),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111112', 'New doc', 'New', 'Yes', true, 2),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111113', 'New doc', 'New', 'Yes', true, 3),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111114', 'New doc', 'New', 'Yes', true, 4),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111115', 'New doc', 'New', 'Yes', true, 5),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111116', 'New doc', 'New', 'Yes', true, 6),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111117', 'New doc', 'New', 'Yes', true, 7),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111118', 'Up-version', 'Same Doc ID', 'Yes', true, 8),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111119', 'Up-version', 'Same Doc ID', 'Yes', true, 9),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111120', 'Up-version', 'Same Doc ID', 'Yes', true, 10),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111121', 'Up-version', 'Same Doc ID', 'Yes', true, 11),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111122', 'New doc', 'New', 'Yes', true, 12),
('Major Upgrade', 'a1111111-1111-1111-1111-111111111123', 'Up-version', 'Same Doc ID', 'Yes', true, 13);

-- Insert for Minor Update
INSERT INTO release_document_requirements (release_type, document_id, doc_up_version, doc_id_rule, doc_history_rule, is_mandatory, display_order) VALUES
('Minor Update', 'a1111111-1111-1111-1111-111111111111', 'New doc', 'New', 'Yes', true, 1),
('Minor Update', 'a1111111-1111-1111-1111-111111111112', 'Up-version', 'Same Doc ID', 'Yes', true, 2),
('Minor Update', 'a1111111-1111-1111-1111-111111111113', 'Up-version', 'Same Doc ID', 'Yes', true, 3),
('Minor Update', 'a1111111-1111-1111-1111-111111111114', 'Up-version', 'Same Doc ID', 'Yes', true, 4),
('Minor Update', 'a1111111-1111-1111-1111-111111111115', 'Up-version', 'Same Doc ID', 'Yes', true, 5),
('Minor Update', 'a1111111-1111-1111-1111-111111111117', 'Up-version', 'Same Doc ID', 'Yes', true, 6),
('Minor Update', 'a1111111-1111-1111-1111-111111111122', 'New doc', 'New', 'Yes', true, 7);

-- Insert for Patch
INSERT INTO release_document_requirements (release_type, document_id, doc_up_version, doc_id_rule, doc_history_rule, is_mandatory, display_order) VALUES
('Patch', 'a1111111-1111-1111-1111-111111111111', 'New doc', 'New', 'Yes', true, 1),
('Patch', 'a1111111-1111-1111-1111-111111111115', 'Up-version', 'Same Doc ID', 'Yes', true, 2),
('Patch', 'a1111111-1111-1111-1111-111111111122', 'Up-version', 'Same Doc ID', 'Yes', true, 3);

-- Insert for Hot Fix
INSERT INTO release_document_requirements (release_type, document_id, doc_up_version, doc_id_rule, doc_history_rule, is_mandatory, display_order) VALUES
('Hot Fix', 'a1111111-1111-1111-1111-111111111111', 'New doc', 'New', 'Yes', true, 1),
('Hot Fix', 'a1111111-1111-1111-1111-111111111115', 'Up-version', 'Same Doc ID', 'Yes', true, 2);

-- Insert for Compliance Update
INSERT INTO release_document_requirements (release_type, document_id, doc_up_version, doc_id_rule, doc_history_rule, is_mandatory, display_order) VALUES
('Compliance Update', 'a1111111-1111-1111-1111-111111111111', 'New doc', 'New', 'Yes', true, 1),
('Compliance Update', 'a1111111-1111-1111-1111-111111111112', 'Up-version', 'Same Doc ID', 'Yes', true, 2),
('Compliance Update', 'a1111111-1111-1111-1111-111111111124', 'New if', 'New if', 'Yes', true, 3),
('Compliance Update', 'a1111111-1111-1111-1111-111111111117', 'New doc', 'New', 'Yes', true, 4);

-- Insert app configurations
INSERT INTO app_configurations (config_key, config_value, description) VALUES
('app.settings', '{
  "appName": "Documentation Requirements Generator",
  "version": "2.0.0",
  "company": "DocGen Inc.",
  "supportEmail": "support@docgen.com",
  "maxFileSize": 10485760,
  "allowedFileTypes": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".jpg", ".png"]
}', 'Application settings'),
('email.templates', '{
  "crSubmitted": {
    "subject": "Change Request Submitted: {{crNumber}}",
    "template": "cr_submitted.html"
  },
  "crApproved": {
    "subject": "Change Request Approved: {{crNumber}}",
    "template": "cr_approved.html"
  },
  "crRejected": {
    "subject": "Change Request Rejected: {{crNumber}}",
    "template": "cr_rejected.html"
  }
}', 'Email notification templates');

-- =====================================================
-- 10. VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for change requests with related data
CREATE VIEW vw_change_requests AS
SELECT 
    cr.id,
    cr.cr_number,
    cr.title,
    cr.description,
    cr.priority,
    cr.type,
    cr.status,
    cr.target_version,
    cr.requested_date,
    cr.closure_date,
    p.project_code,
    p.name as project_name,
    r.release_number,
    r.release_type,
    u.full_name as requested_by_name,
    u.email as requested_by_email,
    (SELECT COUNT(*) FROM cr_documents WHERE cr_id = cr.id) as documents_count,
    (SELECT COUNT(*) FROM cr_stakeholders WHERE cr_id = cr.id) as stakeholders_count,
    (SELECT COUNT(*) FROM cr_attachments WHERE cr_id = cr.id) as attachments_count,
    cr.created_at,
    cr.updated_at
FROM change_requests cr
LEFT JOIN projects p ON cr.project_id = p.id
LEFT JOIN releases r ON cr.release_id = r.id
LEFT JOIN users u ON cr.requested_by = u.id;

-- View for document requirements by release type
CREATE VIEW vw_release_document_requirements AS
SELECT 
    rdr.release_type,
    dt.document_name,
    dt.category,
    rdr.doc_up_version,
    rdr.doc_id_rule,
    rdr.doc_history_rule,
    rdr.is_mandatory,
    rdr.is_recommended,
    rdr.display_order,
    rtd.color_code,
    rtd.icon_name
FROM release_document_requirements rdr
JOIN document_templates dt ON rdr.document_id = dt.id
JOIN release_type_definitions rtd ON rdr.release_type = rtd.name
WHERE dt.is_active = true
ORDER BY rdr.release_type, rdr.display_order;

-- =====================================================
-- 11. FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id_param UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'totalProjects', (SELECT COUNT(*) FROM projects WHERE status = 'active'),
        'totalReleases', (SELECT COUNT(*) FROM releases WHERE status IN ('planned', 'in-progress')),
        'openChangeRequests', (SELECT COUNT(*) FROM change_requests WHERE status IN ('Draft', 'Submitted', 'Under Review')),
        'completedChangeRequests', (SELECT COUNT(*) FROM change_requests WHERE status = 'Implemented'),
        'myPendingApprovals', (SELECT COUNT(*) FROM cr_stakeholders WHERE user_id = user_id_param AND status = 'Pending'),
        'recentActivity', (SELECT jsonb_agg(jsonb_build_object(
            'id', al.id,
            'action', al.action,
            'entityType', al.entity_type,
            'createdAt', al.created_at
        ) ORDER BY al.created_at DESC LIMIT 10) FROM audit_logs al)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust based on your PostgreSQL setup)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;