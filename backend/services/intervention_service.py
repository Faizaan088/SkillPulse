"""
Interventions Decision Service
Translates evidence and alignment mismatches into measurable, reversible controlled pilots.
"""

import json
from typing import List, Dict, Any, Optional
from backend.database.db import query_all, query_one, execute
from backend.models.schemas import InterventionOut

def get_all_interventions() -> List[InterventionOut]:
    rows = query_all("SELECT * FROM interventions")
    results = []
    for r in rows:
        rationale = json.loads(r["evidence_rationale"]) if isinstance(r["evidence_rationale"], str) else r["evidence_rationale"]
        metrics = json.loads(r["success_metrics"]) if isinstance(r["success_metrics"], str) else r["success_metrics"]
        steps = json.loads(r["pilot_steps"]) if isinstance(r["pilot_steps"], str) else r["pilot_steps"]
        
        results.append(InterventionOut(
            id=r["id"],
            code=r["code"],
            title=r["title"],
            target_scope=r["target_scope"],
            duration=r["duration"],
            scope_skills=r["scope_skills"],
            reversibility_mechanism=r["reversibility_mechanism"],
            evidence_rationale=rationale,
            success_metrics=metrics,
            pilot_steps=steps,
            status=r["status"]
        ))
    return results

def review_intervention(intervention_id: str, action: str = "review") -> Optional[InterventionOut]:
    status_map = {
        "review": "Under Planning Review",
        "approve": "Approved for Pilot Launch",
        "reset": "Proposed controlled pilot"
    }
    new_status = status_map.get(action, "Under Planning Review")
    
    execute("UPDATE interventions SET status = ? WHERE id = ? OR code = ?", (new_status, intervention_id, intervention_id))
    
    row = query_one("SELECT * FROM interventions WHERE id = ? OR code = ?", (intervention_id, intervention_id))
    if not row:
        return None
        
    rationale = json.loads(row["evidence_rationale"]) if isinstance(row["evidence_rationale"], str) else row["evidence_rationale"]
    metrics = json.loads(row["success_metrics"]) if isinstance(row["success_metrics"], str) else row["success_metrics"]
    steps = json.loads(row["pilot_steps"]) if isinstance(row["pilot_steps"], str) else row["pilot_steps"]
    
    return InterventionOut(
        id=row["id"],
        code=row["code"],
        title=row["title"],
        target_scope=row["target_scope"],
        duration=row["duration"],
        scope_skills=row["scope_skills"],
        reversibility_mechanism=row["reversibility_mechanism"],
        evidence_rationale=rationale,
        success_metrics=metrics,
        pilot_steps=steps,
        status=row["status"]
    )
