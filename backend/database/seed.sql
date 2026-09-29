-- =====================================================================
-- SkillPulse: Demonstration / Synthetic Data Seed
-- Coherent, realistic evidence-driven planning data for Maharashtra
-- =====================================================================

-- 1. Districts
INSERT INTO districts (id, name, state, latitude, longitude, demand_signal, advanced_capacity_pct, six_month_outcome_pct, market_observability, centres_count, detail, boundary_geojson)
VALUES 
('pune', 'Pune', 'Maharashtra', 18.5204, 73.8567, 'High', 68, 64, 'Medium', 4, 'Strong advanced-manufacturing signals; training demand and placement evidence are comparatively well observed in the auto/tooling corridor.', '{"type":"Polygon","coordinates":[[[73.5,18.2],[74.2,18.2],[74.3,18.9],[73.6,18.9],[73.5,18.2]]]}'),
('nashik', 'Nashik', 'Maharashtra', 19.9975, 73.7898, 'Moderate', 41, 52, 'Low', 2, 'Employer validation indicates real demand. Low digital observability means online job postings severely understate local MSME hiring.', '{"type":"Polygon","coordinates":[[[73.4,19.7],[74.1,19.7],[74.2,20.3],[73.5,20.3],[73.4,19.7]]]}'),
('chhatrapati_sambhajinagar', 'Chhatrapati Sambhajinagar', 'Maharashtra', 19.8762, 75.3433, 'High', 29, 48, 'Low', 1, 'Industrial cluster demand is rising faster than advanced CNC capacity. Candidate movement from nearby Marathwada districts is material.', '{"type":"Polygon","coordinates":[[[75.0,19.5],[75.6,19.5],[75.7,20.1],[75.1,20.1],[75.0,19.5]]]}'),
('satara', 'Satara', 'Maharashtra', 17.6805, 74.0183, 'Moderate', 37, 55, 'Low', 2, 'Linked to the Pune-Shirwal labour corridor. Evidence is weighted toward training centres and tracer follow-up sources.', '{"type":"Polygon","coordinates":[[[73.7,17.4],[74.3,17.4],[74.4,17.9],[73.8,17.9],[73.7,17.4]]]}')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Skills
INSERT INTO skills (id, canonical_name, sector, aliases, demand_trend, confidence_score, market_observability, evidence_count, active_courses_count, usable_capacity_pct, target_outcome_pct, geographic_spread, description)
VALUES
('cnc_programming', 'CNC Programming', 'Advanced Manufacturing', 'CNC coding · G-code programming · CNC प्रोग्रामिंग · 5-axis CNC setup', 'Increasing', 0.82, 'Medium', 23, 2, 29, 64, 'Pune · Chh. Sambhajinagar · Nashik', 'Precision multi-axis computer numerical control programming, offset calibration, toolpath optimization and G/M code verification.'),
('cad_cam', 'CAD/CAM', 'Advanced Manufacturing', 'Computer-aided design · CAM workflows · कैड कैम · SolidWorks/Mastercam', 'Increasing', 0.76, 'Medium', 18, 2, 44, 59, 'Pune · Nashik', 'Parametric 3D mechanical modelling and generative toolpath calculation for subtractive machining.'),
('plc_troubleshooting', 'PLC Troubleshooting', 'Industrial Automation', 'PLC diagnosis · PLC fault finding · पीएलसी रिपेयर · Ladder logic debug', 'Emerging', 0.71, 'Low', 14, 1, 35, 48, 'Pune · Satara', 'Programmable logic controller diagnostic routines, I/O verification, and industrial sensor network troubleshooting.'),
('digital_measurement', 'Digital Measurement', 'Quality Engineering', 'Digital metrology · CMM operation · डिजिटल मापन · Vernier/Micrometer digital', 'Increasing', 0.79, 'Medium', 16, 2, 51, 62, 'Pune · Chh. Sambhajinagar', 'Coordinate Measuring Machine (CMM) digital inspection, optical gauging, and statistical process tolerance control.'),
('collaborative_robotics', 'Collaborative Robot Setup', 'Industrial Automation', 'Cobot programming · Cobot teaching · रोबोटिक्स', 'Emerging', 0.65, 'Low', 11, 1, 24, 42, 'Pune', 'Pendant teaching and safety envelope calibration for cooperative assembly robotic arms.')
ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name;

-- 3. Occupations
INSERT INTO occupations (id, code, title, sector, demand_signal, trend, market_observability, confidence_score)
VALUES
('occ_cnc_operator', 'NCO-2015/7223.01', 'CNC Operator', 'Advanced Manufacturing', 'Strong', 'Increasing', 'Medium', 0.82),
('occ_prod_technician', 'NCO-2015/3115.03', 'Production Technician', 'Advanced Manufacturing', 'Moderate', 'Increasing', 'Low', 0.69),
('occ_cad_designer', 'NCO-2015/3118.01', 'CAD/CAM Designer', 'Advanced Manufacturing', 'Moderate', 'Increasing', 'Medium', 0.76),
('occ_plc_technician', 'NCO-2015/7412.02', 'PLC Maintenance Technician', 'Industrial Automation', 'Emerging', 'Increasing', 'Low', 0.71),
('occ_qa_inspector', 'NCO-2015/3152.01', 'Quality Assurance Inspector', 'Quality Engineering', 'Moderate', 'Stable', 'Medium', 0.74)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 4. Courses
INSERT INTO courses (id, code, title, nsqf_level, duration_months, curriculum_coverage_pct, usable_seats_pct, verified_trainers_count, active_equipment_count, district_id)
VALUES
('course_cnc_l4', 'MECH-CNC-L4', 'CNC Machining & Programming Level 4', 4, 6, 42, 29, 6, 14, 'pune'),
('course_cad_cam_l5', 'DES-CADCAM-L5', 'Certificate in CAD/CAM Engineering Design', 5, 6, 56, 44, 4, 18, 'pune'),
('course_auto_l4', 'AUTO-PLC-L4', 'Industrial Automation & PLC Maintenance', 4, 4, 31, 35, 3, 8, 'satara'),
('course_metrology_l4', 'QUAL-MET-L4', 'Digital Metrology & Quality Assurance', 4, 3, 63, 51, 5, 12, 'chhatrapati_sambhajinagar')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 5. Employers
INSERT INTO employers (id, name, sector, district_id, cluster_name, latitude, longitude, verified_openings)
VALUES
('emp_apex', 'Apex Precision Works', 'Advanced Manufacturing', 'pune', 'Bhosari Industrial Area', 18.6279, 73.8443, 14),
('emp_bharat_forging', 'Bharat Forging & Auto Components', 'Automotive', 'pune', 'Chakan Auto Cluster', 18.7606, 73.8640, 22),
('emp_marathwada_tool', 'Marathwada Toolcraft Pvt Ltd', 'Engineering', 'chhatrapati_sambhajinagar', 'Waluj MIDC', 19.8335, 75.2415, 18),
('emp_godavari_tech', 'Godavari Tech Tools', 'Manufacturing', 'nashik', 'Ambad MIDC', 19.9328, 73.7314, 9),
('emp_satara_precision', 'Satara Precision Engineering', 'Machining', 'satara', 'Old MIDC Satara', 17.6980, 74.0240, 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 6. Training Centres
INSERT INTO training_centres (id, name, district_id, latitude, longitude, usable_capacity_pct, active_simulators, maintenance_simulators)
VALUES
('tc_pune_asc', 'Pune Advanced Skills Centre', 'pune', 18.5314, 73.8446, 68, 8, 1),
('tc_chakan_iti', 'Chakan Industrial Training Hub', 'pune', 18.7580, 73.8590, 62, 4, 0),
('tc_sambhajinagar_net', 'Sambhajinagar Regional Training Network', 'chhatrapati_sambhajinagar', 19.8650, 75.3120, 29, 2, 1),
('tc_nashik_poly', 'Nashik Central Technical Institute', 'nashik', 19.9820, 73.7910, 41, 3, 1),
('tc_satara_iti', 'Satara Government Skill Institute', 'satara', 17.6740, 74.0120, 37, 2, 0)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 7. Verified Equipment
INSERT INTO equipment (id, centre_id, name, operational_units, maintenance_units, last_verified_date, utility_score)
VALUES
('eq_cnc_pune', 'tc_pune_asc', '3-Axis CNC Machining Simulators & Milling Unit', 8, 1, '2026-09-18', 0.92),
('eq_cnc_sambhajinagar', 'tc_sambhajinagar_net', 'CNC Turning & Multi-Tasking Workstation', 2, 1, '2026-08-27', 0.83),
('eq_plc_satara', 'tc_satara_iti', 'Modular PLC Fault Simulator Rig (Siemens/AB)', 2, 0, '2026-09-05', 0.78),
('eq_cmm_pune', 'tc_pune_asc', 'Bridge CMM Digital Metrology Scanner', 1, 0, '2026-09-10', 0.89)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 8. Verified Trainers
INSERT INTO trainers (id, centre_id, name, skill_specialization, certified, capability_score)
VALUES
('tr_1', 'tc_pune_asc', 'R. K. Deshmukh', 'CNC Programming & G-Code', TRUE, 0.88),
('tr_2', 'tc_pune_asc', 'Sunita Kulkarni', 'CAD/CAM SolidWorks', TRUE, 0.85),
('tr_3', 'tc_sambhajinagar_net', 'A. P. Shinde', 'CNC Turning Operations', TRUE, 0.72),
('tr_4', 'tc_nashik_poly', 'Vikas Jadhav', 'Tool & Die Machining', TRUE, 0.69),
('tr_5', 'tc_satara_iti', 'Mahesh Patil', 'PLC Automation Fundamentals', FALSE, 0.58)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 9. Evidence Records (Data Provenance & Audit Trail)
INSERT INTO evidence_records (id, observation_name, source_name, source_type, ingested_date, geography, district_id, evidence_state, confidence_score, raw_text, canonical_mapping, transformation_history, uncertainty_boundary)
VALUES
('ev_01', 'CNC programmer requirement', 'Apex Precision Works', 'Employer signal', '2026-09-18', 'Pune', 'pune', 'Observed', 0.89, 'Requirement for 5-axis CNC operator with Fanuc G-code programming capabilities.', 'Skill: CNC Programming -> Occupation: CNC Operator', 'Raw Text Ingestion -> Regex Tokenization -> Entity Resolution -> Canonical Validation', 'Direct observed employer vacancy; covers immediate Bhosari cluster only.'),
('ev_02', 'CNC placement conversion', 'Pune Advanced Skills Centre', 'Placement record', '2026-09-13', 'Pune', 'pune', 'Observed', 0.86, '78 certified in Q2 cohort; 41 placed into target automotive/machining sector.', 'Course: CNC Machining L4 -> Placement: 41 confirmed target sector', 'Institute Placement Registry -> Employer Verification Cross-Check -> Confidence Weighted', 'Direct institute record. 37 certified graduates had unverified or non-local employment.'),
('ev_03', 'Six-month occupation retention', 'Graduate tracer cohort 24-Q1', 'Tracer observation', '2026-09-09', 'Pune–Satara corridor', 'pune', 'Estimated', 0.66, '140 target-sector graduates confirmed retained at 6-month follow-up; 160 outcomes remain unobserved.', 'Cohort: CNC-2024-Q1 -> 6-mo retention rate calculation', 'Telephone Followup -> Response Sampling Bias Calibration -> Sensitivity Interval Generated', 'Response selection risk is medium (61% response rate). Missing outcomes are treated as unobserved, not unemployed.'),
('ev_04', 'AI-assisted PCB design phrase', 'Electronics employer cluster', 'Industry survey', '2026-09-02', 'Pune', 'pune', 'Observed', 0.71, 'Four independent tier-2 electronic firms noted AI copilot tools used for schematic routing and PCB layout.', 'Competency: AI-assisted PCB design -> Qualification: Electronics PCB Design L4', 'Structured Consultation Survey -> Term Frequency Analysis -> Skillness Gate Filter', 'Observation shows nascent requirement; does not justify full NSQF qualification redesign without persistence evidence.'),
('ev_05', 'CNC equipment inventory', 'Sambhajinagar Training Network', 'Industry survey', '2026-08-27', 'Chh. Sambhajinagar', 'chhatrapati_sambhajinagar', 'Observed', 0.83, 'Physical inspection confirmed two operating simulators and one simulator out of service due to drive controller fault.', 'Facility: Sambhajinagar -> Asset: 2 Operational / 1 Inactive', 'On-site Physical Audit -> DGET Asset Database Sync -> Usable Seat Capacity Recomputed', 'Direct asset observation; maintenance turnaround time is estimated at 3 weeks.'),
('ev_06', 'Unknown graduate outcome', 'CNC L4 2025 cohort', 'Tracer observation', '2026-08-20', 'Nashik', 'nashik', 'Unobserved', 0.00, '54 certified candidates could not be reached via registered phone/email at 6-month interval.', 'Cohort: Nashik CNC-2025 -> Status: Unobserved', 'Tracer Registry Query -> Non-Response Classification -> Zero Causality Inferred', 'Strict compliance with Product Principle 2 & 9: non-contact is classified as Unknown, not counted as failure.'),
('ev_07', 'Multi-axis CNC mill-turn operator', 'Bharat Forging & Auto Components', 'Employer signal', '2026-09-17', 'Pune', 'pune', 'Observed', 0.91, 'Urgent requirement for multi-axis CNC mill-turn setter with Siemens Sinumerik 840D experience.', 'Skill: CNC Programming -> Occupation: CNC Operator', 'Direct Employer Ingestion -> Entity Resolution -> Canonical Validation', 'Confirmed direct requisition from Chakan auto cluster facility.'),
('ev_08', 'Precision tooling CNC programmer', 'Marathwada Toolcraft Pvt Ltd', 'Employer signal', '2026-09-15', 'Chh. Sambhajinagar', 'chhatrapati_sambhajinagar', 'Observed', 0.88, 'Need experienced CNC programmer for plastic injection mould cavity roughing and finishing.', 'Skill: CNC Programming -> Occupation: Tool & Die Maker', 'Employer Portal Extraction -> Alias Mapping -> Canonical Validation', 'Validates rising industrial cluster demand in Waluj MIDC.'),
('ev_09', '3-axis VMC machining center setter', 'Godavari Tech Tools', 'Employer signal', '2026-09-14', 'Nashik', 'nashik', 'Observed', 0.85, 'Opening for VMC machine setter and operator capable of Fanuc control tool height offsetting.', 'Skill: CNC Programming -> Occupation: Production Technician', 'Employer Survey Validation -> Semantic Normalization -> Canonical Linking', 'Offline cluster consultation record; compensates for low digital observability in Nashik.'),
('ev_10', 'CNC lathe setup specialist', 'Satara Precision Engineering', 'Employer signal', '2026-09-12', 'Satara', 'satara', 'Observed', 0.82, 'Machining shop requires CNC lathe setter with 2+ years turning experience for transmission shafts.', 'Skill: CNC Programming -> Occupation: CNC Operator', 'Regional Employer Interview -> Entity Resolution -> Canonical Alignment', 'Direct field observation in Old MIDC Satara.'),
('ev_11', 'Die casting CNC machining programmer', 'Endurance Technologies', 'Employer signal', '2026-09-11', 'Chh. Sambhajinagar', 'chhatrapati_sambhajinagar', 'Observed', 0.87, 'Automated aluminium die-casting component post-machining CNC programmer requisition.', 'Skill: CNC Programming -> Occupation: CNC Operator', 'Corporate Hiring Register -> Canonical Mapping -> Confidence Scoring', 'Confirms inter-district demand pull toward Aurangabad-Pune corridor.'),
('ev_12', 'Automotive transmission CNC operator', 'Tata AutoComp Systems', 'Employer signal', '2026-09-08', 'Pune', 'pune', 'Observed', 0.93, 'High-volume transmission gear housing CNC line operator positions posted.', 'Skill: CNC Programming -> Occupation: CNC Operator', 'Enterprise ATS Data Feed -> Deduplication -> Canonical Validation', 'Enterprise observed signal with confirmed hiring budget.'),
('ev_13', 'Compressor casing CNC programmer', 'Kirloskar Pneumatics', 'Employer signal', '2026-09-05', 'Pune', 'pune', 'Observed', 0.86, 'Heavy engineering compressor casing multi-axis CNC machinist required.', 'Skill: CNC Programming -> Occupation: Production Technician', 'Direct Job Spec Ingestion -> Skill Tagging -> Entity Linking', 'Specialized heavy industrial machining; higher wage bracket verified.'),
('ev_14', 'Precision connector mould CNC machinist', 'Flash Electronics', 'Employer signal', '2026-09-03', 'Pune', 'pune', 'Observed', 0.84, 'Miniature connector mould electrode CNC milling operator needed.', 'Skill: CNC Programming -> Occupation: Tool & Die Maker', 'Direct Industry Requisition -> Text Extraction -> Canonical Validation', 'High precision requirement (+/- 5 microns tolerance control).'),
('ev_15', 'Tier-1 auto machining conversions', 'Chakan Industrial Training Hub', 'Placement record', '2026-09-16', 'Pune', 'pune', 'Observed', 0.87, '34 graduates confirmed placed into Tier-1 auto machining supplier facilities.', 'Course: MECH-CNC-L4 -> Placement: 34 confirmed', 'Training Provider Registry -> Dual-Party Wage Confirmation', 'Direct administrative record with payroll verification.'),
('ev_16', 'Regional CNC placement audit', 'Sambhajinagar Regional Training Network', 'Placement record', '2026-09-10', 'Chh. Sambhajinagar', 'chhatrapati_sambhajinagar', 'Observed', 0.81, '18 certified candidates placed in Waluj and Shendra industrial zones.', 'Course: MECH-CNC-L4 -> Placement: 18 confirmed', 'Institute Records -> Employer Confirmation Sample', 'Local cluster placement; 4 trainees migrated to Pune cluster within 60 days.'),
('ev_17', 'Apprentice conversion record', 'Nashik Central Technical Institute', 'Placement record', '2026-09-07', 'Nashik', 'nashik', 'Observed', 0.79, '22 national apprenticeship scheme completers absorbed into permanent machine shop roles.', 'Course: MECH-CNC-L4 -> Placement: 22 confirmed', 'NAPS Portal Audit -> Institute Confirmation', 'Validates conversion despite low initial online vacancy visibility.'),
('ev_18', 'Component machining placements', 'Satara Government Skill Institute', 'Placement record', '2026-09-04', 'Satara', 'satara', 'Observed', 0.77, '16 certified trainees placed into Shirwal-Khandala auto component corridor.', 'Course: MECH-CNC-L4 -> Placement: 16 confirmed', 'Institute Placement Cell Register -> Phone Audit', 'Reflects corridor mobility from Satara towards Pune peripheral clusters.'),
('ev_19', 'Shared toolroom apprentice placements', 'Bhosari MSME Toolroom Consortium', 'Placement record', '2026-08-30', 'Pune', 'pune', 'Observed', 0.84, '26 certified candidates placed across 8 MSME machine shops in Bhosari.', 'Course: MECH-CNC-L4 -> Placement: 26 confirmed', 'Consortium Agreement Records -> GST Invoicing Cross-Check', 'MSME cluster placement with shared supervisor model.'),
('ev_20', 'Marathwada regional tracer sample', 'Marathwada Tracer Initiative', 'Tracer observation', '2026-08-25', 'Chh. Sambhajinagar', 'chhatrapati_sambhajinagar', 'Estimated', 0.68, '3-month tracer follow-up for 65 candidates: 42 in target occupation, 12 in other sectors, 11 unobserved.', 'Cohort: Marathwada-2025 -> Tracer 3-month', 'Phone Survey -> Bias Adjustment -> Outcome Verification', 'Confirms high sector retention for candidates remaining in-district.'),
('ev_21', 'Tooling wage progression tracer', 'Western Maharashtra Tooling Tracer', 'Tracer observation', '2026-08-15', 'Pune', 'pune', 'Estimated', 0.72, '6-month wage survey indicates 22% wage premium for multi-axis CNC certified technicians over 2-axis operators.', 'Cohort: WesternMH-2024 -> Wage Progression', 'Field Sample Survey -> Sampling Weight Calculation', 'Observational wage evidence supporting advanced capacity expansion.'),
('ev_22', 'Advanced CNC capability forecast', 'ACMA Western Region', 'Industry survey', '2026-08-28', 'Pune–Nashik', 'pune', 'Observed', 0.82, 'Survey of 48 auto component manufacturers shows 64% plan to upgrade from 3-axis to 5-axis machines by 2027.', 'Survey: ACMA Western 2026 -> Technology Shift', 'Industry Association Survey -> Statistical Aggregation', 'Direct industry strategic plan; indicates growing demand curve.'),
('ev_23', 'Metrology & CAM integration audit', 'Maharashtra Tool & Die Manufacturers Association', 'Industry survey', '2026-08-10', 'Pune', 'pune', 'Observed', 0.78, '72% of toolrooms report lack of CAM simulation skills among entry-level CNC operators.', 'Survey: TAGMA/MTDMA 2026 -> Skill Gap Audit', 'Cluster Survey Questionnaire -> Expert Panel Validation', 'Directly correlates with 42% curriculum coverage finding in alignment engine.')
ON CONFLICT (id) DO UPDATE SET observation_name = EXCLUDED.observation_name;

-- 10. Tracer Cohorts & Outcomes
INSERT INTO tracer_cohorts (id, cohort_name, course_id, enrolled_count, completed_count, certified_count, confirmed_target_employed, unobserved_outcome_count, six_month_retained, response_selection_risk, reported_reasons)
VALUES
('cohort_cnc_2025', 'CNC Machining Level 4 / 2025 Cohort', 'course_cnc_l4', 500, 420, 380, 220, 160, 140, 'Medium', '{"wage_concerns": 41, "location_constraints": 23, "occupation_change": 18, "higher_studies": 11, "family_reasons": 7}')
ON CONFLICT (id) DO UPDATE SET cohort_name = EXCLUDED.cohort_name;

-- 11. Emerging Skills
INSERT INTO emerging_skills (id, technical_phrase, existing_qualification, qualification_gap, skillness_score, gate_status, gate_reason, repetition_count, independent_employers, persistence_months, confidence_score, pipeline_stage, status)
VALUES
('em_ai_pcb', 'AI-assisted PCB design', 'PCB Design & Fabrication', 'Existing curriculum teaches manual CAD layout; no instruction in generative routing or automated DRC verification.', 0.94, 'Pass', 'Specific technical competency requiring discrete tool workflow knowledge, not an administrative or working condition.', 9, 4, 3, 0.74, 4, 'Candidate'),
('em_digital_metrology', 'Digital metrology workflow', 'Quality Inspection (Mechanical)', 'Coverage of automated optical coordinate measurement is pending across ITI curriculum modules.', 0.88, 'Pass', 'Verifiable technical inspection competency with quantitative tolerance criteria.', 7, 3, 2, 0.62, 3, 'Validation Pending'),
('em_cobot_setup', 'Collaborative robot setup', 'Industrial Automation L4', 'Cobot teach pendant setup and dynamic collision zone programming are not included in older robotic curricula.', 0.89, 'Pass', 'Discrete robotic programming competency with specialized safety standard requirements.', 5, 2, 2, 0.49, 2, 'Under Review')
ON CONFLICT (id) DO UPDATE SET technical_phrase = EXCLUDED.technical_phrase;

-- 12. Interventions
INSERT INTO interventions (id, code, title, target_scope, duration, scope_skills, reversibility_mechanism, evidence_rationale, success_metrics, pilot_steps, status)
VALUES
('int_cnc_pilot', 'I-01', 'Expand advanced CNC training capacity before the next planning cycle', '2 training centres in Pune and Chhatrapati Sambhajinagar', 'One planning cycle (6 months)', 'CNC programming + digital measurement', 'Pilot delivery before capital expenditure on permanent seat expansion; reviewable after cohort tracer completion.', '["Increasing employer and placement signals for CNC programming (23 fused observations)", "Current curriculum covers only 42% of demonstrated industry requirements", "Advanced CNC capacity is constrained (29% in Chh. Sambhajinagar)", "Target-sector employment conversion is uncertain (220-290 effective supply range) and must be tested in a controlled pilot"]', '{"target_placement_pct": 55, "six_month_retention_pct": 40, "curriculum_coverage_pct": 70, "independent_employer_validations": 5}', '[{"step":"01","title":"Baseline","desc":"Record current capacity, curriculum coverage and employer validation."},{"step":"02","title":"Run pilot","desc":"Deliver advanced programming modules at selected centres."},{"step":"03","title":"Observe outcomes","desc":"Measure placement, target-sector employment and 6-month retention."},{"step":"04","title":"Review or reverse","desc":"Scale only if success metrics and evidence threshold are met."}]', 'Proposed controlled pilot')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;


-- 13. Labour Corridors
INSERT INTO labour_corridors (id, from_district_id, to_district_id, corridor_name, dynamic_type, candidate_flow_level, notes)
VALUES
('corr_pune_sambhajinagar', 'pune', 'chhatrapati_sambhajinagar', 'Pune ↔ Chh. Sambhajinagar Corridor', 'DEMAND / CAPACITY', 'High', 'High advanced manufacturing demand with acute capacity deficit in Sambhajinagar; frequent inter-district technician migration.'),
('corr_pune_nashik', 'pune', 'nashik', 'Pune ↔ Nashik Industrial Belt', 'EMPLOYER / TRAINING', 'Moderate', 'Tooling and auto-component supply chain connection; Nashik training supply frequently migrates to Chakan/Talegaon auto hubs.'),
('corr_pune_satara', 'pune', 'satara', 'Pune ↔ Satara Labour Corridor', 'CANDIDATE MOVEMENT', 'High', 'Shirwal-Khandala industrial belt serves as an economic transition zone between Satara trainees and Pune industrial employers.')
ON CONFLICT (id) DO UPDATE SET corridor_name = EXCLUDED.corridor_name;

-- 14. Traditional Program Risk Signals
INSERT INTO program_risk_signals (id, program_name, code, course_id, nsqf_level, enrollment_level, enrollment_count, placement_trend, retention_trend, current_demand, risk_state, risk_category, evidence_count, confidence_score, recommended_action, review_rationale, district_id)
VALUES
('risk_cnc_basic', 'CNC Machining (Basic 3-Axis)', 'PR-01', 'course_cnc_l4', 4, 'HIGH', 500, '↓ 14%', '↓ 9%', 'MODERATE / SHIFTING', 'At Risk', 'TRAINING SUPPLY MISALIGNMENT', 23, 0.82, 'Review modular curriculum upgrade; pilot multi-axis CAM training before next intake cycle (Intervention I-01)', 'Declining placement (↓ 14%) and 6-month retention (↓ 9%) indicate training-supply misalignment with industry specifications requiring multi-axis CAM and offset optimization; does not prove curricular defect.', 'pune'),
('risk_conv_turning', 'Conventional Turning & Lathe', 'PR-02', 'course_cnc_l4', 3, 'HIGH', 640, '↓ 21%', '↓ 18%', 'LOW / DECLINING', 'Critical', 'TECHNICAL OBSOLESCENCE DRIFT', 19, 0.79, 'Administrative review for dual-track retrofit; transition second-year seats to CNC Operator curriculum', 'Persistent decline in manual lathe employer requisitions across auto component hubs; high enrollment creates structural graduate underemployment.', 'pune'),
('risk_manual_fitting', 'Manual Fitting & Bench Work', 'PR-03', 'course_auto_l4', 3, 'MODERATE', 380, '↓ 6%', '↓ 4%', 'STABLE / BASELINE', 'Watch', 'SLOW INDUSTRIAL ABSORPTION', 12, 0.73, 'Integrate digital measurement and precision tolerance micro-credentials into bench assembly syllabus', 'Basic bench fitting remains necessary as foundational trade, but standalone placement is slowing as automated sub-assemblies expand.', 'satara'),
('risk_digital_metrology', 'Digital Metrology & Quality Assurance', 'PR-04', 'course_metrology_l4', 4, 'MODERATE', 240, '↑ 8%', '↑ 5%', 'STRONG / RISING', 'Stable', 'ALIGNED SUPPLY', 16, 0.85, 'Maintain current cohort intake; calibrate CMM optical scanners and coordinate probe rigs', 'Strong target-sector absorption and positive 6-month retention confirm robust alignment with aerospace and auto QA demands.', 'chhatrapati_sambhajinagar')
ON CONFLICT (id) DO UPDATE SET program_name = EXCLUDED.program_name;
