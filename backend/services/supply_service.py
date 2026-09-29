"""
Supply & Outcome Intelligence Service
Distinguishes Nominal vs Effective Supply and Observed vs Estimated vs Unobserved outcomes.
"""

import json
import re
from typing import Dict, Any, List, Optional
from backend.database.db import query_one, query_all
from backend.models.schemas import SupplyFunnelOut, ProgramRiskOut

def _trend_pct(text: str) -> int:
    """Parse '↓ 14%' -> 14 (decline magnitude); rising or flat trends -> 0."""
    m = re.search(r"(\d+)", text or "")
    return int(m.group(1)) if m and "↓" in text else 0

def _enrich_program_risk(r: dict) -> dict:
    """Explainable rule: HIGH intake + falling placement + falling retention => OVER-ENROLLED.
    Intake shift % = average of placement & retention decline, clamped to 5-25%."""
    p_drop, r_drop = _trend_pct(r["placement_trend"]), _trend_pct(r["retention_trend"])
    over = r["enrollment_level"] == "HIGH" and p_drop > 0 and r_drop > 0
    shift = 0
    if r["risk_state"] != "Stable" and (p_drop or r_drop):
        shift = max(5, min(25, round((p_drop + r_drop) / 2)))
    seats = int(round(r["enrollment_count"] * shift / 100 / 5.0) * 5)
    flags = (["OVER-ENROLLED"] if over else []) + (["PLACEMENT ↓"] if p_drop else []) + (["RETENTION ↓"] if r_drop else [])
    if shift == 0:
        rec = "Maintain current intake quota."
    else:
        verb = "Freeze fresh intake and release" if r["risk_state"] == "Critical" else "Cap intake and release"
        rec = f"{verb} ~{seats} of {r['enrollment_count']} seats ({shift}%) for redeployment to demand-backed rising skills; review at mid-cycle gate."
    return {"over_enrolled": over, "flag_label": " · ".join(flags), "intake_shift_pct": shift,
            "seats_to_redeploy": seats, "intake_recommendation": rec}

def get_program_risk_signals(district_id: Optional[str] = None) -> List[ProgramRiskOut]:
    """
    Returns data-driven traditional program risk signals identifying training-supply misalignments.
    Explainable, deterministic signals based on enrollment, placement trends, retention, and demand.
    """
    if district_id and district_id != "All districts":
        d_clean = district_id.lower().replace("chhatrapati sambhajinagar", "chhatrapati_sambhajinagar")
        rows = query_all("SELECT * FROM program_risk_signals WHERE district_id = ? OR district_id IS NULL ORDER BY CASE risk_state WHEN 'Critical' THEN 1 WHEN 'At Risk' THEN 2 WHEN 'Watch' THEN 3 ELSE 4 END", (d_clean,))
    else:
        rows = query_all("SELECT * FROM program_risk_signals ORDER BY CASE risk_state WHEN 'Critical' THEN 1 WHEN 'At Risk' THEN 2 WHEN 'Watch' THEN 3 ELSE 4 END")
        
    return [
        ProgramRiskOut(
            id=r["id"],
            code=r["code"],
            program_name=r["program_name"],
            nsqf_level=r["nsqf_level"],
            enrollment_level=r["enrollment_level"],
            enrollment_count=r["enrollment_count"],
            placement_trend=r["placement_trend"],
            retention_trend=r["retention_trend"],
            current_demand=r["current_demand"],
            risk_state=r["risk_state"],
            risk_category=r["risk_category"],
            evidence_count=r["evidence_count"],
            confidence_score=r["confidence_score"],
            recommended_action=r["recommended_action"],
            review_rationale=r["review_rationale"],
            district_id=r.get("district_id"),
            **_enrich_program_risk(r)
        )
        for r in rows
    ]

def get_supply_pipeline(cohort_id: str = "cohort_cnc_2025") -> SupplyFunnelOut:
    cohort = query_one("SELECT * FROM tracer_cohorts WHERE id = ?", (cohort_id,)) or query_one("SELECT * FROM tracer_cohorts LIMIT 1")
    
    reported_reasons = {}
    if cohort and cohort.get("reported_reasons"):
        try:
            reported_reasons = json.loads(cohort["reported_reasons"])
        except Exception:
            reported_reasons = {"wage_concerns": 41, "location_constraints": 23, "occupation_change": 18}
            
    leakage_rates = [
        {"stage": "Certified", "rate": "100%", "width_pct": "100%", "color": "var(--blue)"},
        {"stage": "Enter relevant sector", "rate": "58%", "width_pct": "58%", "color": "var(--amber)"},
        {"stage": "Retained at 6 months", "rate": "37%", "width_pct": "37%", "color": "var(--red)"}
    ]
    
    tracer_timeline = [
        {
            "timepoint": "3 months",
            "responses": "210 / 380",
            "target_sector": "175",
            "retained": "—",
            "state": "PARTIAL",
            "state_tone": "estimated"
        },
        {
            "timepoint": "6 months",
            "responses": "260 / 380",
            "target_sector": "220",
            "retained": "140",
            "state": "PARTIAL",
            "state_tone": "estimated"
        },
        {
            "timepoint": "12 months",
            "responses": "Not yet due",
            "target_sector": "—",
            "retained": "—",
            "state": "UNOBSERVED",
            "state_tone": "unobserved"
        }
    ]
    
    return SupplyFunnelOut(
        cohort_name=cohort["cohort_name"] if cohort else "CNC Machining Level 4 / 2025 Cohort",
        enrolled=cohort["enrolled_count"] if cohort else 500,
        completed=cohort["completed_count"] if cohort else 420,
        certified=cohort["certified_count"] if cohort else 380,
        confirmed_target_employed=cohort["confirmed_target_employed"] if cohort else 220,
        unobserved_outcome=cohort["unobserved_outcome_count"] if cohort else 160,
        six_month_retained=cohort["six_month_retained"] if cohort else 140,
        effective_supply_range="220–290",
        response_selection_risk=cohort["response_selection_risk"] if cohort else "Medium",
        leakage_rates=leakage_rates,
        reported_exit_reasons=reported_reasons,
        tracer_timeline=tracer_timeline
    )
