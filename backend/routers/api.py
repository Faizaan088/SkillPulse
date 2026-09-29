"""
SkillPulse REST API Routers
"""

from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException, Path, Response

from backend.models.schemas import (
    OverviewOut, SkillSummary, EntityGraphOut, MarketSignalOut,
    OccupationOut, SupplyFunnelOut, EmergingCandidateOut,
    SkillnessGateRequest, SkillnessGateResponse, GeographyOut,
    AlignmentOut, InterventionOut, ReviewInterventionRequest,
    EvidenceRecordOut, EvidenceChainOut, ProgramRiskOut, DistrictActionPlanOut
)
from backend.services import (
    overview_service, skill_service, market_service,
    supply_service, emerging_service, geography_service,
    alignment_service, intervention_service, evidence_service,
    candidate_service, district_plan_service
)
from backend.database.db import query_all

router = APIRouter(prefix="/api", tags=["SkillPulse Intelligence API"])

# 1. Overview
@router.get("/overview", response_model=OverviewOut)
def get_overview(district: Optional[str] = "All districts"):
    return overview_service.get_overview_data(district_filter=district)

# 2. Skills
@router.get("/skills", response_model=List[SkillSummary])
def list_skills():
    return skill_service.get_all_skills()

@router.post("/skills/multilingual-resolve")
def resolve_multilingual_phrase(req: SkillnessGateRequest):
    return skill_service.resolve_multilingual_skill(req.phrase)

@router.get("/skills/{skill_id}")
def get_skill_detail(skill_id: str):
    skill = skill_service.get_skill_by_id(skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill

@router.get("/skills/{skill_id}/graph", response_model=EntityGraphOut)
def get_skill_3d_graph(skill_id: str):
    return skill_service.get_skill_graph(skill_id)

# 3. Market Intelligence
@router.get("/market/signals", response_model=MarketSignalOut)
def get_market_signals(skill_id: Optional[str] = "cnc_programming"):
    return market_service.get_market_signal(skill_id=skill_id)

@router.get("/market/occupations", response_model=List[OccupationOut])
def get_occupations():
    return market_service.get_occupations()

# 4. Supply & Outcomes
@router.get("/supply/pipeline", response_model=SupplyFunnelOut)
def get_supply_pipeline(cohort_id: Optional[str] = "cohort_cnc_2025"):
    return supply_service.get_supply_pipeline(cohort_id=cohort_id)

@router.get("/supply/program-risks", response_model=List[ProgramRiskOut])
def get_program_risks(district: Optional[str] = None):
    return supply_service.get_program_risk_signals(district_id=district)

# 5. Emerging Skills & Skillness Gate
@router.get("/emerging", response_model=List[EmergingCandidateOut])
def get_emerging_candidates():
    return emerging_service.get_emerging_candidates()

@router.post("/emerging/skillness-gate", response_model=SkillnessGateResponse)
def evaluate_skillness_gate(req: SkillnessGateRequest):
    return emerging_service.classify_skillness_gate(req.phrase)

# 6. Geography & Corridors
@router.get("/geography", response_model=GeographyOut)
def get_geography():
    return geography_service.get_geography_data()

@router.get("/geography/district/{district_id}")
def get_district_detail(district_id: str):
    return geography_service.get_district_detail(district_id)

@router.get("/geography/district/{district_id}/action-plan", response_model=DistrictActionPlanOut)
def get_district_action_plan(district_id: str):
    return district_plan_service.generate_district_action_plan(district_id)

@router.get("/geography/district/{district_id}/action-plan/export")
def export_district_action_plan(district_id: str, format: str = Query("csv", pattern="^(csv|json|html)$")):
    plan = district_plan_service.generate_district_action_plan(district_id)
    if format == "json":
        return plan
    elif format == "html":
        html_doc = district_plan_service.export_district_action_plan_html(plan)
        return Response(content=html_doc, media_type="text/html")
    else:
        csv_data = district_plan_service.export_district_action_plan_csv(plan)
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=SkillPulse_DistrictActionPlan_{district_id}.csv"}
        )

@router.get("/geography/action-plan/statewide")
def get_statewide_action_plan():
    return district_plan_service.generate_statewide_action_plan()

@router.get("/geography/action-plan/statewide/export")
def export_statewide_action_plan(format: str = Query("csv", pattern="^(csv|json|html)$")):
    plan = district_plan_service.generate_statewide_action_plan()
    if format == "json":
        return plan
    if format == "html":
        return Response(content=district_plan_service.export_statewide_action_plan_html(plan), media_type="text/html")
    return Response(
        content=district_plan_service.export_statewide_action_plan_csv(plan), media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=SkillPulse_Statewide_DistrictActionPlan.csv"})

# 7. Alignment Engine
@router.get("/alignment", response_model=AlignmentOut)
def get_alignment():
    return alignment_service.get_alignment_data()

# 8. Interventions
@router.get("/interventions", response_model=List[InterventionOut])
def list_interventions():
    return intervention_service.get_all_interventions()

@router.post("/interventions/{intervention_id}/review", response_model=InterventionOut)
def review_intervention(intervention_id: str, req: ReviewInterventionRequest):
    updated = intervention_service.review_intervention(intervention_id, action=req.action)
    if not updated:
        raise HTTPException(status_code=404, detail="Intervention not found")
    return updated

# 9. Evidence Explorer & Show Me Why
@router.get("/evidence", response_model=List[EvidenceRecordOut])
def list_evidence(district: Optional[str] = None):
    return evidence_service.get_evidence_records(district_filter=district)

@router.get("/evidence/chain/{chain_key}", response_model=EvidenceChainOut)
def get_evidence_chain(chain_key: str):
    return evidence_service.get_evidence_chain(chain_key)

# 10. Data Quality
@router.get("/quality")
def get_data_quality():
    return evidence_service.get_data_quality()

# 11. Global Search
@router.get("/search")
def search_entities(q: str = Query(..., min_length=1)):
    term = f"%{q.lower()}%"
    skills = query_all("SELECT id, canonical_name as name, 'SKILL' as type, 'skills' as page FROM skills WHERE LOWER(canonical_name) LIKE ? OR LOWER(aliases) LIKE ?", (term, term))
    occupations = query_all("SELECT id, title as name, 'OCCUPATION' as type, 'market' as page FROM occupations WHERE LOWER(title) LIKE ?", (term,))
    courses = query_all("SELECT id, title as name, 'COURSE' as type, 'skills' as page FROM courses WHERE LOWER(title) LIKE ?", (term,))
    districts = query_all("SELECT id, name, 'DISTRICT' as type, 'geography' as page FROM districts WHERE LOWER(name) LIKE ?", (term,))
    emerging = query_all("SELECT id, technical_phrase as name, 'EMERGING COMPETENCY' as type, 'emerging' as page FROM emerging_skills WHERE LOWER(technical_phrase) LIKE ?", (term,))
    
    combined = skills + occupations + courses + districts + emerging
    return combined[:10]

# 12. Candidate Guidance (Downstream Decision Layer Extension - Section 4.1 & 10)
@router.get("/candidate/guidance")
def get_candidate_guidance(candidate_id: Optional[str] = "demo_candidate_01"):
    return candidate_service.get_candidate_guidance(candidate_id=candidate_id)

