-- =====================================================================
-- SkillPulse: Evidence-to-Action Intelligence Layer
-- PostgreSQL + PostGIS Production Schema
-- Smart India Hackathon 2026 — Problem Statement 134
-- =====================================================================

-- Enable PostGIS spatial extension (when running in PostgreSQL)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Districts (Administrative boundaries & economic metadata)
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    state VARCHAR(64) NOT NULL DEFAULT 'Maharashtra',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    demand_signal VARCHAR(32) NOT NULL,      -- 'High', 'Moderate', 'Weak', 'Emerging'
    advanced_capacity_pct INTEGER NOT NULL,  -- e.g. 29, 68
    six_month_outcome_pct INTEGER NOT NULL,  -- e.g. 64, 48
    market_observability VARCHAR(32) NOT NULL, -- 'High', 'Medium', 'Low'
    centres_count INTEGER NOT NULL DEFAULT 1,
    detail TEXT NOT NULL,
    boundary_geojson TEXT                    -- GeoJSON polygon or multipolygon
);

-- 2. Canonical Skills & Competencies
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(64) PRIMARY KEY,
    canonical_name VARCHAR(128) NOT NULL,
    sector VARCHAR(64) NOT NULL,
    aliases TEXT NOT NULL,                   -- Semicolon-delimited aliases and multilingual terms
    demand_trend VARCHAR(32) NOT NULL,       -- 'Increasing', 'Stable', 'Declining', 'Emerging'
    confidence_score DOUBLE PRECISION NOT NULL, -- 0.0 to 1.0
    market_observability VARCHAR(32) NOT NULL,
    evidence_count INTEGER NOT NULL DEFAULT 0,
    active_courses_count INTEGER NOT NULL DEFAULT 0,
    usable_capacity_pct INTEGER NOT NULL,
    target_outcome_pct INTEGER NOT NULL,
    geographic_spread VARCHAR(255) NOT NULL,
    description TEXT
);

-- 3. Occupations
CREATE TABLE IF NOT EXISTS occupations (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) NOT NULL,               -- e.g. NCO-2015 code
    title VARCHAR(128) NOT NULL,
    sector VARCHAR(64) NOT NULL,
    demand_signal VARCHAR(32) NOT NULL,
    trend VARCHAR(32) NOT NULL,
    market_observability VARCHAR(32) NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL
);

-- 4. Courses & Curriculum
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    nsqf_level INTEGER NOT NULL,
    duration_months INTEGER NOT NULL,
    curriculum_coverage_pct INTEGER NOT NULL,
    usable_seats_pct INTEGER NOT NULL,
    verified_trainers_count INTEGER NOT NULL,
    active_equipment_count INTEGER NOT NULL,
    district_id VARCHAR(64) REFERENCES districts(id)
);

-- 5. Employers & Industrial Clusters
CREATE TABLE IF NOT EXISTS employers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    sector VARCHAR(64) NOT NULL,
    district_id VARCHAR(64) REFERENCES districts(id),
    cluster_name VARCHAR(128) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    verified_openings INTEGER NOT NULL DEFAULT 0
);

-- 6. Training Centres
CREATE TABLE IF NOT EXISTS training_centres (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    district_id VARCHAR(64) REFERENCES districts(id),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    usable_capacity_pct INTEGER NOT NULL,
    active_simulators INTEGER NOT NULL DEFAULT 0,
    maintenance_simulators INTEGER NOT NULL DEFAULT 0
);

-- 7. Verified Equipment
CREATE TABLE IF NOT EXISTS equipment (
    id VARCHAR(64) PRIMARY KEY,
    centre_id VARCHAR(64) REFERENCES training_centres(id),
    name VARCHAR(128) NOT NULL,
    operational_units INTEGER NOT NULL,
    maintenance_units INTEGER NOT NULL,
    last_verified_date DATE NOT NULL,
    utility_score DOUBLE PRECISION NOT NULL
);

-- 8. Verified Trainers
CREATE TABLE IF NOT EXISTS trainers (
    id VARCHAR(64) PRIMARY KEY,
    centre_id VARCHAR(64) REFERENCES training_centres(id),
    name VARCHAR(128) NOT NULL,
    skill_specialization VARCHAR(128) NOT NULL,
    certified BOOLEAN NOT NULL DEFAULT TRUE,
    capability_score DOUBLE PRECISION NOT NULL
);

-- 9. Evidence Records (Data Provenance & Audit Trail)
CREATE TABLE IF NOT EXISTS evidence_records (
    id VARCHAR(64) PRIMARY KEY,
    observation_name VARCHAR(255) NOT NULL,
    source_name VARCHAR(128) NOT NULL,
    source_type VARCHAR(64) NOT NULL,        -- 'Employer signal', 'Placement record', 'Tracer observation', 'Industry survey', 'Infrastructure record'
    ingested_date DATE NOT NULL,
    geography VARCHAR(128) NOT NULL,
    district_id VARCHAR(64),
    evidence_state VARCHAR(32) NOT NULL,     -- 'Observed', 'Estimated', 'Unobserved'
    confidence_score DOUBLE PRECISION NOT NULL,
    raw_text TEXT NOT NULL,
    canonical_mapping TEXT NOT NULL,
    transformation_history TEXT NOT NULL,
    uncertainty_boundary TEXT NOT NULL
);

-- 10. Tracer Cohorts & Outcomes (Nominal vs. Effective Supply)
CREATE TABLE IF NOT EXISTS tracer_cohorts (
    id VARCHAR(64) PRIMARY KEY,
    cohort_name VARCHAR(128) NOT NULL,
    course_id VARCHAR(64) REFERENCES courses(id),
    enrolled_count INTEGER NOT NULL,
    completed_count INTEGER NOT NULL,
    certified_count INTEGER NOT NULL,
    confirmed_target_employed INTEGER NOT NULL,
    unobserved_outcome_count INTEGER NOT NULL,
    six_month_retained INTEGER NOT NULL,
    response_selection_risk VARCHAR(32) NOT NULL, -- 'Low', 'Medium', 'High'
    reported_reasons JSON
);

-- 11. Emerging Skill Pipeline
CREATE TABLE IF NOT EXISTS emerging_skills (
    id VARCHAR(64) PRIMARY KEY,
    technical_phrase VARCHAR(128) NOT NULL,
    existing_qualification VARCHAR(128) NOT NULL,
    qualification_gap TEXT NOT NULL,
    skillness_score DOUBLE PRECISION NOT NULL,
    gate_status VARCHAR(32) NOT NULL,        -- 'Pass', 'Reject'
    gate_reason TEXT NOT NULL,
    repetition_count INTEGER NOT NULL,
    independent_employers INTEGER NOT NULL,
    persistence_months INTEGER NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL,
    pipeline_stage INTEGER NOT NULL,         -- 1 to 5
    status VARCHAR(64) NOT NULL              -- 'Candidate', 'Under Review', 'Validation Pending'
);

-- 12. Proposed Measurable Interventions
CREATE TABLE IF NOT EXISTS interventions (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) NOT NULL,               -- e.g. 'I-01'
    title VARCHAR(255) NOT NULL,
    target_scope VARCHAR(255) NOT NULL,
    duration VARCHAR(64) NOT NULL,
    scope_skills VARCHAR(255) NOT NULL,
    reversibility_mechanism TEXT NOT NULL,
    evidence_rationale JSON NOT NULL,
    success_metrics JSON NOT NULL,
    pilot_steps JSON NOT NULL,
    status VARCHAR(64) NOT NULL              -- 'Proposed controlled pilot', 'Under Planning Review', 'Approved'
);

-- 13. Labour Corridors (Economic & Candidate mobility corridors)
CREATE TABLE IF NOT EXISTS labour_corridors (
    id VARCHAR(64) PRIMARY KEY,
    from_district_id VARCHAR(64) REFERENCES districts(id),
    to_district_id VARCHAR(64) REFERENCES districts(id),
    corridor_name VARCHAR(128) NOT NULL,
    dynamic_type VARCHAR(64) NOT NULL,       -- 'DEMAND / CAPACITY', 'EMPLOYER / TRAINING', 'CANDIDATE MOVEMENT'
    candidate_flow_level VARCHAR(32) NOT NULL,
    notes TEXT NOT NULL
);

-- 14. Traditional Program Risk Intelligence (Supply & Outcomes Risk Signals)
CREATE TABLE IF NOT EXISTS program_risk_signals (
    id VARCHAR(64) PRIMARY KEY,
    program_name VARCHAR(128) NOT NULL,
    code VARCHAR(32) NOT NULL,
    course_id VARCHAR(64) REFERENCES courses(id),
    nsqf_level INTEGER NOT NULL,
    enrollment_level VARCHAR(32) NOT NULL,    -- 'HIGH', 'MODERATE', 'LOW'
    enrollment_count INTEGER NOT NULL,
    placement_trend VARCHAR(32) NOT NULL,     -- e.g. '↓ 14%'
    retention_trend VARCHAR(32) NOT NULL,     -- e.g. '↓ 9%'
    current_demand VARCHAR(64) NOT NULL,      -- e.g. 'MODERATE / SHIFTING'
    risk_state VARCHAR(32) NOT NULL,          -- 'Critical', 'At Risk', 'Watch', 'Stable'
    risk_category VARCHAR(64) NOT NULL,       -- e.g. 'TRAINING SUPPLY MISALIGNMENT'
    evidence_count INTEGER NOT NULL DEFAULT 0,
    confidence_score DOUBLE PRECISION NOT NULL,
    recommended_action TEXT NOT NULL,
    review_rationale TEXT NOT NULL,
    district_id VARCHAR(64) REFERENCES districts(id)
);
