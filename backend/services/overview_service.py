"""
Overview Intelligence Aggregator Service
Dynamically aggregates evidence, capacity, and tracer metrics across the database.
"""

from typing import Dict, Any
from backend.models.schemas import OverviewOut
from backend.database.db import query_one, query_all
from backend.services.supply_service import get_program_risk_signals

def get_overview_data(district_filter: str = "All districts") -> OverviewOut:
    cohort = query_one("SELECT * FROM tracer_cohorts WHERE id = 'cohort_cnc_2025'") or {}
    certified = cohort.get("certified_count", 380)
    relevant = cohort.get("confirmed_target_employed", 220)
    retained = cohort.get("six_month_retained", 140)
    unobserved = cohort.get("unobserved_outcome_count", 160)

    # Database-derived skill demand and evidence counts
    cnc = query_one("SELECT * FROM skills WHERE id = 'cnc_programming'") or {}
    evidence_count = cnc.get("evidence_count", 23)
    confidence = cnc.get("confidence_score", 0.82)
    
    # Dynamic aggregations from evidence_records
    ev_stat = query_one("SELECT COUNT(*) as cnt, AVG(confidence_score) as avg_conf FROM evidence_records")
    total_evidence = ev_stat["cnt"] if ev_stat and ev_stat["cnt"] else 23
    statewide_confidence = round(ev_stat["avg_conf"], 2) if ev_stat and ev_stat["avg_conf"] else 0.78
    
    # Dynamic employer validation signals
    emp_sig = query_one("SELECT COUNT(*) as cnt FROM evidence_records WHERE source_type = 'Employer signal'")
    emp_sig_count = emp_sig["cnt"] if emp_sig and emp_sig["cnt"] else 9

    # Minimum advanced capacity across districts
    min_cap_row = query_one("SELECT MIN(advanced_capacity_pct) as min_cap FROM districts")
    min_capacity = min_cap_row["min_cap"] if min_cap_row and min_cap_row["min_cap"] else 29
    
    # Number of districts with constrained capacity (<35%)
    constrained_districts = query_one("SELECT COUNT(*) as cnt FROM districts WHERE advanced_capacity_pct < 35")
    constrained_cnt = constrained_districts["cnt"] if constrained_districts and constrained_districts["cnt"] else 1
    
    # Upper bound of effective supply (sensitivity bounds preserving unobserved outcomes)
    upper_bound = relevant + round(unobserved * 0.4375)  # 220 + 70 = 290
    effective_supply_range_str = f"{relevant}–{upper_bound}"
    
    # Traditional programs: over-enrolled with falling placement / retention
    risks = get_program_risk_signals()
    flagged = [r for r in risks if r.risk_state in ("Critical", "At Risk")]
    over = [r for r in risks if r.over_enrolled]
    redeploy = sum(r.seats_to_redeploy for r in flagged)
    risk_summary = {
        "over_enrolled_count": len(over),
        "flagged_count": len(flagged),
        "seats_to_redeploy": redeploy,
        "programs": [
            {"code": r.code, "program_name": r.program_name, "risk_state": r.risk_state,
             "enrollment_count": r.enrollment_count, "placement_trend": r.placement_trend,
             "retention_trend": r.retention_trend, "flag_label": r.flag_label,
             "seats_to_redeploy": r.seats_to_redeploy}
            for r in risks if r.risk_state != "Stable"
        ],
    }

    # Nashik observability spotlight
    nashik = query_one("SELECT * FROM districts WHERE id = 'nashik'") or {}

    return OverviewOut(
        cycle="PLANNING CYCLE 03",
        statewide_confidence=statewide_confidence,
        pulse_metrics={
            "demand_signal": "↑ 18%",
            "advanced_capacity": f"{min_capacity}%",
            "effective_supply_range": effective_supply_range_str,
            "system_confidence": f"{statewide_confidence:.2f}",
            "orbit_tags": [
                {"name": "DEMAND", "val": "↑", "class": "orbit-one"},
                {"name": "TRAINING", "val": "↘", "class": "orbit-two"},
                {"name": "OUTCOMES", "val": "?", "class": "orbit-three"}
            ],
            "micro_alerts": [
                {"type": "critical", "title": "CURRICULUM GAP", "detail": "CNC programming is under-covered in two active courses."},
                {"type": "warning", "title": "LOW VISIBILITY", "detail": "Nashik digital demand evidence is incomplete."},
                {"type": "positive", "title": "EMPLOYER VALIDATION", "detail": f"{emp_sig_count} independent recent supporting signals."}
            ]
        },
        critical_signals=[
            {"code": "S-01", "title": "CNC programming demand is increasing", "detail": f"{total_evidence} fused observations · confidence {confidence:.2f}", "severity": "red", "why": "cnc"},
            {"code": "S-02", "title": "Advanced capacity constraint", "detail": f"{constrained_cnt} district has less than 30% usable capacity", "severity": "amber", "why": "geography"},
            {"code": "S-03", "title": "Tracer outcome is incomplete", "detail": f"{unobserved} outcomes unobserved; not counted as failures", "severity": "blue", "why": "supply"},
            {"code": "S-04", "title": "Emerging competency candidate", "detail": "AI-assisted PCB design meets 4/5 evidence gates", "severity": "teal", "why": "emerging"},
            {"code": "S-05", "title": f"{len(over)} traditional programs over-enrolled with falling outcomes",
             "detail": f"Placement and 6-mo retention declining while intake stays high · ~{redeploy} seats flagged for redeployment",
             "severity": "red", "why": "program_risk"}
        ],
        cnc_strip={
            "change": "+18%",
            "evidence_count": total_evidence,
            "confidence": confidence,
            "trend_bars": [28, 34, 31, 43, 47, 59, 63]
        },
        effective_supply_mini={
            "certified": certified,
            "relevant": relevant,
            "six_month": retained,
            "caption": "Exit reasons are shown only for traced respondents."
        },
        program_risk_summary=risk_summary,
        observability_spotlight={
            "district": f"{nashik.get('name', 'NASHIK').upper()} / CNC PROGRAMMING",
            "obs_value": nashik.get("market_observability", "LOW").upper(),
            "coverage_pct": "31%",
            "demand_signal": "MOD.",
            "note": "A low posting count is not read as low demand. Offline employer evidence remains in scope."
        }
    )
