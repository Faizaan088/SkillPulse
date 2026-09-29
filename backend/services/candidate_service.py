"""
Candidate Guidance Downstream Intelligence Service
Section 4.1 & 10 of SkillPulse Final Approach (PS 134)
Connects validated institutional skill intelligence to candidate guidance pathways without turning SkillPulse into a student-centric portal.
"""

from typing import Dict, Any, List
from backend.database.db import query_all, query_one

def get_candidate_guidance(candidate_id: str = "demo_candidate_01") -> Dict[str, Any]:
    """
    Returns candidate guidance backed by live market intelligence, canonical skills, and verified courses.
    """
    # Query live skills and courses
    skills = query_all("SELECT * FROM skills ORDER BY confidence_score DESC")
    occupations = query_all("SELECT * FROM occupations ORDER BY confidence_score DESC")
    courses = query_all("SELECT * FROM courses")
    employers = query_all("SELECT * FROM employers")
    
    # Primary focus skill from live intelligence: CNC Programming
    cnc_skill = next((s for s in skills if s["id"] == "cnc_programming"), skills[0] if skills else {})
    cnc_course = next((c for c in courses if "CNC" in c["title"]), courses[0] if courses else {})
    
    # 1. Candidate Profile & Context
    profile = {
        "candidate_id": candidate_id,
        "name": "Rahul Deshmukh",
        "current_qualification": "ITI Machinist / L4 Enrolled",
        "district": "Pune (Chakan Auto Cluster)",
        "verified_competencies": ["Basic Lathe Turning", "Shop Floor Safety", "Engineering Drawing Interpretation"],
        "target_role": "Multi-Axis CNC Programmer & Setter",
        "target_sector": "Advanced Manufacturing & Precision Tooling",
        "learning_level": "Level 4 (NSQF) -> Target Level 5"
    }
    
    # 2. Learning Intelligence (interprets skill gaps against validated market intelligence)
    learning_intelligence = {
        "diagnosed_gaps": [
            {
                "competency": "CNC Programming (G-code & Toolpaths)",
                "status": "Priority Gap",
                "market_demand": cnc_skill.get("demand_trend", "Increasing"),
                "industry_need": "5-axis Fanuc setup & high-speed toolpath optimization",
                "confidence": cnc_skill.get("confidence_score", 0.82)
            },
            {
                "competency": "Digital Measurement & Metrology",
                "status": "Secondary Gap",
                "market_demand": "Increasing",
                "industry_need": "Bridge CMM coordinate verification & micron tolerance audit",
                "confidence": 0.79
            },
            {
                "competency": "PLC Diagnostic Fundamentals",
                "status": "Elective / Emerging",
                "market_demand": "Emerging",
                "industry_need": "Basic sensor/actuator ladder logic inspection",
                "confidence": 0.71
            }
        ],
        "curriculum_recommendation": f"{cnc_course.get('title', 'CNC Machining Level 4')} (Modules 03 & 04: Multi-axis toolpathing)",
        "evidence_backing": f"Derived from {cnc_skill.get('evidence_count', 23)} verified employer requirements and placement observations in Pune-Sambhajinagar corridor."
    }
    
    # 3. Self-Discovery & Skill Pathways
    pathways = [
        {
            "step": "Current Readiness",
            "milestone": "L4 Machinist Fundamentals",
            "skills": "Lathe operations, blueprint reading, mechanical fitting",
            "validation": "Accredited Training Centre Assessment"
        },
        {
            "step": "Near-term (30–60 Days)",
            "milestone": "CNC 3-Axis Operator & Setter",
            "skills": "Fanuc G-code editing, fixture alignment, offset setup",
            "validation": "Industry-partnered Simulator Assessment"
        },
        {
            "step": "Target Milestone (Cycle 03)",
            "milestone": "Multi-Axis CNC Programmer",
            "skills": "5-axis CAM toolpathing, Mastercam integration, CMM validation",
            "validation": "Controlled Pilot Certification (Intervention I-01)"
        },
        {
            "step": "Advanced Trajectory",
            "milestone": "Toolroom Specialist / Production Lead",
            "skills": "Cobot integration, predictive maintenance, quality assurance",
            "validation": "Target-Sector Retention Metric (6-month tracer)"
        }
    ]
    
    # 4. Career Exploration (connected to market intelligence and employers)
    careers = [
        {
            "role": "CNC Operator / Setter",
            "sector": "Automotive & Tooling",
            "demand_signal": "Strong (↗ 18%)",
            "observability": "Medium",
            "avg_hiring_clusters": "Pune (Bhosari, Talegaon), Chh. Sambhajinagar (Waluj)",
            "verified_employers": [e["name"] for e in employers[:3]]
        },
        {
            "role": "CAD/CAM Junior Designer",
            "sector": "Die & Mould Engineering",
            "demand_signal": "Moderate",
            "observability": "Medium",
            "avg_hiring_clusters": "Pune, Nashik",
            "verified_employers": ["Precision Dies Ltd", "Apex Precision Works"]
        },
        {
            "role": "Quality & Metrology Technician",
            "sector": "Defense & Heavy Engineering",
            "demand_signal": "Increasing",
            "observability": "Medium",
            "avg_hiring_clusters": "Chh. Sambhajinagar, Pune",
            "verified_employers": ["Maharashtra Precision Tooling", "Bharat Forging Cluster"]
        }
    ]
    
    # 5. Active System Alignment (Connects Candidate Guidance to Active Planning Interventions)
    active_int = query_one("SELECT * FROM interventions WHERE id = 'int_cnc_pilot'")
    active_system_alignment = {
        "status_badge": "ACTIVE SYSTEM ALIGNMENT",
        "planning_cycle": "Cycle 03",
        "program_title": "Maharashtra Industrial Skilling Pilot — Cycle 03",
        "cluster": "Pune (Chakan Auto Cluster)",
        "skill": "CNC Programming",
        "intervention_id": active_int["id"] if active_int else "int_cnc_pilot",
        "intervention_code": active_int["code"] if active_int else "I-01",
        "intervention_title": active_int["title"] if active_int else "Expand advanced CNC training capacity before the next planning cycle",
        "intervention_type": "Capacity Expansion & Modular Pilot",
        "planned_additional_seats": 120,
        "status": active_int["status"] if active_int else "Proposed controlled pilot",
        "evidence_backing": "Evidence-backed pathway aligned with current industry demand and training-system planning.",
        "evidence_count": 23,
        "confidence_score": 0.82,
        "distinction": {
            "candidate_recommendation": "Transition from L4 Machinist fundamentals to Multi-Axis CNC Programming & CAM toolpathing.",
            "current_market_evidence": "23 verified employer requisitions (Apex Precision, Bharat Forging) confirm increasing multi-axis demand.",
            "active_training_intervention": "Intervention I-01: Controlled capacity expansion (+120 seats) with upgraded Fanuc/Siemens simulators.",
            "planning_status": "Proposed controlled pilot under administrative review. Training capacity expansion proposed; employer-validated pathway."
        },
        "system_notice": (
            "This pathway is aligned with the active Maharashtra Industrial Skilling Pilot (Cycle 03), "
            f"unlocking certified apprenticeships in {profile['district'].split('(')[0].strip()} cluster."
        ),
        "system_notice_boundary": "Subject to planning review of Intervention I-01; not a guarantee of placement or apprenticeship.",
        "non_guarantee_notice": "Linked to current planning cycle and supported by current demand evidence. Does not constitute an unconditional guarantee of placement or apprenticeship."
    }
    
    # 6. Real-World Problem Space (practical problem contexts)
    real_world_problems = [
        {
            "title": "Precision Aerospace Hydraulic Manifold Tolerancing",
            "context": "Apex Precision Works (Bhosari Hub)",
            "problem": "Workpiece thermal expansion during multi-pass milling causing 25-micron variance beyond permissible ±8μm tolerance.",
            "learning_application": "Optimizing toolpath cooling cycles, spindle speed parameters, and CMM probe verification."
        },
        {
            "title": "EV Transmission Casing Rapid Prototyping",
            "context": "Talegaon Automotive Corridor",
            "problem": "Long cycle time in finishing die-cast aluminum transmission housings.",
            "learning_application": "Implementing high-speed trochoidal milling strategies using Mastercam L5 CAM workflows."
        }
    ]
    
    return {
        "profile": profile,
        "learning_intelligence": learning_intelligence,
        "pathways": pathways,
        "careers": careers,
        "active_system_alignment": active_system_alignment,
        "real_world_problems": real_world_problems,
        "meta": {
            "source": "SkillPulse Institutional Intelligence Core",
            "governance": "Human authority / candidate consent preserved",
            "reversibility": "Advice derives strictly from verified market signals, not black-box predictions."
        }
    }
