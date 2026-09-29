"""
Emerging Skill Intelligence & Skillness Gate Classifier Service
"""

import re
from typing import List, Dict, Any
from backend.database.db import query_all, query_one
from backend.models.schemas import EmergingCandidateOut, SkillnessGateResponse

# Working conditions, benefits, or administrative eligibility keywords
CONDITION_KEYWORDS = [
    "shift", "night", "day", "rotational", "overtime", "ot",
    "aadhaar", "pan", "passport", "license", "licence", "document", "id",
    "relocate", "relocation", "travel", "vehicle", "bike", "car",
    "salary", "ctc", "stipend", "bonus", "pf", "esi", "incentive",
    "urgent", "immediate", "joiner", "fresher", "experienced",
    "male", "female", "gender", "age", "years", "qualification",
    "accommodation", "food", "canteen", "bus", "transport"
]

# Technical competency patterns
COMPETENCY_PATTERNS = [
    r"cnc", r"plc", r"cad", r"cam", r"pcb", r"design", r"programming", r"troubleshooting",
    r"metrology", r"inspection", r"machining", r"turning", r"milling", r"welding", r"fitting",
    r"automation", r"robot", r"sensor", r"scada", r"wiring", r"maintenance", r"calibration",
    r"quality", r"tolerance", r"g-code", r"toolpath", r"simulation", r"circuit", r"firmware"
]

def classify_skillness_gate(phrase: str) -> SkillnessGateResponse:
    """
    Evaluates whether a phrase is a true technical competency vs. a working condition or administrative condition.
    """
    p_lower = phrase.strip().lower()
    
    # Check for administrative conditions / working conditions
    for word in CONDITION_KEYWORDS:
        if re.search(r'\b' + re.escape(word) + r'\b', p_lower):
            if any(term in p_lower for term in ["shift", "rotational", "hours"]):
                return SkillnessGateResponse(
                    phrase=phrase,
                    is_skill=False,
                    confidence=0.98,
                    category="Working Condition",
                    explanation="Classified as a working hour / schedule condition, not a demonstrable competency."
                )
            if any(term in p_lower for term in ["aadhaar", "pan", "license", "licence", "id", "document"]):
                return SkillnessGateResponse(
                    phrase=phrase,
                    is_skill=False,
                    confidence=0.99,
                    category="Administrative Eligibility",
                    explanation="Classified as a regulatory/identity documentation requirement, not a skill."
                )
            if any(term in p_lower for term in ["relocate", "relocation", "travel"]):
                return SkillnessGateResponse(
                    phrase=phrase,
                    is_skill=False,
                    confidence=0.95,
                    category="Mobility Condition",
                    explanation="Classified as candidate mobility / relocation preference, not a technical ability."
                )
            return SkillnessGateResponse(
                phrase=phrase,
                is_skill=False,
                confidence=0.92,
                category="Job Condition",
                explanation="Classified as an employment prerequisite or administrative term, not a verifiable skill."
            )
            
    # Check for technical competency
    matches_technical = any(re.search(pat, p_lower) for pat in COMPETENCY_PATTERNS)
    if matches_technical or len(p_lower.split()) in [2, 3, 4]:
        confidence = 0.91 if matches_technical else 0.78
        return SkillnessGateResponse(
            phrase=phrase,
            is_skill=True,
            confidence=confidence,
            category="Technical Competency",
            explanation="Specific technical competence with verifiable task context and discrete tool/knowledge workflow."
        )
        
    return SkillnessGateResponse(
        phrase=phrase,
        is_skill=True,
        confidence=0.68,
        category="General Competency",
        explanation="Candidate phrase exhibits task-oriented structure; routed for evidence accumulation."
    )

def get_emerging_candidates() -> List[Dict[str, Any]]:
    return query_all("SELECT * FROM emerging_skills ORDER BY pipeline_stage DESC")
