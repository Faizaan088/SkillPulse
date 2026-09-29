"""
Pydantic Schemas for SkillPulse API Request/Response Models
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# District
class DistrictOut(BaseModel):
    id: str
    name: str
    state: str
    latitude: float
    longitude: float
    demand_signal: str
    advanced_capacity_pct: int
    six_month_outcome_pct: int
    market_observability: str
    centres_count: int
    detail: str
    boundary_geojson: Optional[str] = None

# Skill
class SkillSummary(BaseModel):
    id: str
    canonical_name: str
    sector: str
    aliases: str
    demand_trend: str
    confidence_score: float
    market_observability: str
    evidence_count: int
    active_courses_count: int
    usable_capacity_pct: int
    target_outcome_pct: int
    geographic_spread: str
    description: Optional[str] = None

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # 'skill', 'demand', 'occupation', 'course', 'capacity', 'outcome', 'evidence', 'geo', 'equipment', 'emerging'
    x: float
    y: float
    z: float
    color: str
    radius: float
    meta: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    source: int
    target: int
    label: Optional[str] = None
    weight: Optional[float] = 1.0

class EntityGraphOut(BaseModel):
    skill_id: str
    canonical_name: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]

# Market Intelligence
class MarketSignalOut(BaseModel):
    skill_name: str
    fused_signal_level: str
    trend_pct: int
    confidence_score: float
    market_observability: str
    monthly_trend: List[Dict[str, Any]]
    source_mix: List[Dict[str, Any]]
    evidence_count: int
    boundary_note: Dict[str, str]

class OccupationOut(BaseModel):
    id: str
    code: str
    title: str
    sector: str
    demand_signal: str
    trend: str
    market_observability: str
    confidence_score: float

# Supply & Tracer
class SupplyFunnelOut(BaseModel):
    cohort_name: str
    enrolled: int
    completed: int
    certified: int
    confirmed_target_employed: int
    unobserved_outcome: int
    six_month_retained: int
    effective_supply_range: str
    response_selection_risk: str
    leakage_rates: List[Dict[str, Any]]
    reported_exit_reasons: Dict[str, int]
    tracer_timeline: List[Dict[str, Any]]

# Traditional Program Risk Intelligence
class ProgramRiskOut(BaseModel):
    id: str
    code: str
    program_name: str
    nsqf_level: int
    enrollment_level: str
    enrollment_count: int
    placement_trend: str
    retention_trend: str
    current_demand: str
    risk_state: str  # 'Critical', 'At Risk', 'Watch', 'Stable'
    risk_category: str
    evidence_count: int
    confidence_score: float
    recommended_action: str
    review_rationale: str
    district_id: Optional[str] = None
    over_enrolled: bool = False
    flag_label: str = ""
    intake_shift_pct: int = 0
    seats_to_redeploy: int = 0
    intake_recommendation: str = ""

# Emerging Skills
class EmergingCandidateOut(BaseModel):
    id: str
    technical_phrase: str
    existing_qualification: str
    qualification_gap: str
    skillness_score: float
    gate_status: str
    gate_reason: str
    repetition_count: int
    independent_employers: int
    persistence_months: int
    confidence_score: float
    pipeline_stage: int
    status: str

class SkillnessGateRequest(BaseModel):
    phrase: str

class SkillnessGateResponse(BaseModel):
    phrase: str
    is_skill: bool
    confidence: float
    category: str
    explanation: str

# Geography & Labour Corridors
class CorridorOut(BaseModel):
    id: str
    name: str
    from_district: str
    to_district: str
    dynamic_type: str
    flow_level: str
    notes: str

class GeographyOut(BaseModel):
    districts: List[DistrictOut]
    corridors: List[CorridorOut]
    training_centres: List[Dict[str, Any]]
    employers: List[Dict[str, Any]]

# Executive District Action Plan
class DistrictPriorityItem(BaseModel):
    priority_num: str
    action: str
    target_metric: str
    priority_level: str
    evidence_basis: str

class DistrictActionPlanOut(BaseModel):
    district_id: str
    district_name: str
    planning_cycle: str
    priority_level: str
    identified_mismatch: str
    recommended_intervention: str
    intervention_code: str
    seat_capacity_recommendation: str
    trainer_requirement: str
    equipment_requirement: str
    indicative_budget_priority: str
    evidence_confidence_score: float
    evidence_count: int
    review_date: str
    expected_measurable_outcome: str
    priorities: List[DistrictPriorityItem]
    governance_caveat: str
    generated_at: str
    program_seat_quota: List[Dict[str, Any]] = []
    seats_added: int = 0
    seats_released: int = 0
    budget_min_lakh: float = 0.0
    budget_max_lakh: float = 0.0
    trainers_target: int = 0

# Alignment
class AlignmentMatrixRow(BaseModel):
    competency: str
    industry_requirement_pct: int
    curriculum_coverage_pct: int
    training_capacity_pct: int
    trainers_equipment_pct: int

class AlignmentMismatchOut(BaseModel):
    code: str
    title: str
    detail: str
    priority_score: int
    severity: str

class AlignmentOut(BaseModel):
    matrix: List[AlignmentMatrixRow]
    priority_mismatches: List[AlignmentMismatchOut]

# Interventions
class InterventionOut(BaseModel):
    id: str
    code: str
    title: str
    target_scope: str
    duration: str
    scope_skills: str
    reversibility_mechanism: str
    evidence_rationale: List[str]
    success_metrics: Dict[str, Any]
    pilot_steps: List[Dict[str, str]]
    status: str

class ReviewInterventionRequest(BaseModel):
    action: str = "review"  # "review", "approve", "reset"
    reviewer_notes: Optional[str] = None

# Evidence & Provenance
class EvidenceRecordOut(BaseModel):
    id: str
    name: str
    source: str
    source_type: str
    date: str
    place: str
    state: str
    confidence: float
    raw_text: str
    canonical_mapping: str
    transformation_history: str
    uncertainty_boundary: str

class EvidenceChainStep(BaseModel):
    step_label: str
    title: str
    detail: str

class EvidenceChainOut(BaseModel):
    key: str
    title: str
    explanation: str
    steps: List[EvidenceChainStep]
    meta: Dict[str, Any]

# Overview
class OverviewOut(BaseModel):
    cycle: str
    statewide_confidence: float
    pulse_metrics: Dict[str, Any]
    critical_signals: List[Dict[str, Any]]
    cnc_strip: Dict[str, Any]
    effective_supply_mini: Dict[str, Any]
    observability_spotlight: Dict[str, Any]
    program_risk_summary: Dict[str, Any] = {}
