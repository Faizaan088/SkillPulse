"""
Skill Intelligence & 3D Entity Relationship Graph Service
"""

from typing import List, Dict, Any, Optional
from backend.database.db import query_all, query_one
from backend.models.schemas import SkillSummary, EntityGraphOut, GraphNode, GraphEdge

def get_all_skills() -> List[Dict[str, Any]]:
    return query_all("SELECT * FROM skills ORDER BY evidence_count DESC")

def get_skill_by_id(skill_id: str) -> Optional[Dict[str, Any]]:
    return query_one("SELECT * FROM skills WHERE id = ? OR canonical_name = ?", (skill_id, skill_id))

def get_skill_graph(skill_id: str) -> EntityGraphOut:
    """
    Generate an interactive 3D entity relationship graph for the given skill.
    Connects: Skill -> Demand Signal -> Occupations -> Courses -> Training Centres -> Equipment -> Outcomes -> Evidence.
    """
    skill = get_skill_by_id(skill_id)
    if not skill:
        # Default fallback to CNC Programming if not found
        skill = query_one("SELECT * FROM skills WHERE id = 'cnc_programming'")
    
    canonical_name = skill["canonical_name"] if skill else "CNC Programming"
    
    # 3D Node configurations positioned along analytical orbits
    nodes: List[GraphNode] = [
        GraphNode(
            id="node_0",
            label=canonical_name,
            type="skill",
            x=0.0, y=0.0, z=0.0,
            color="#6bc9e8",  # Blue
            radius=13.0,
            meta={"aliases": skill.get("aliases", ""), "confidence": skill.get("confidence_score", 0.82), "type": "CANONICAL SKILL"}
        ),
        GraphNode(
            id="node_1",
            label="Industry demand",
            type="demand",
            x=-125.0, y=-58.0, z=32.0,
            color="#e0ad5b",  # Amber
            radius=8.5,
            meta={"signal": skill.get("demand_trend", "Increasing"), "observability": skill.get("market_observability", "Medium"), "type": "FUSED DEMAND SIGNAL"}
        ),
        GraphNode(
            id="node_2",
            label="CNC Operator" if "CNC" in canonical_name else "Automation Tech",
            type="occupation",
            x=-102.0, y=70.0, z=-48.0,
            color="#e0ad5b",
            radius=7.5,
            meta={"code": "NCO-2015/7223.01", "type": "OCCUPATION"}
        ),
        GraphNode(
            id="node_3",
            label="CNC Machining L4" if "CNC" in canonical_name else "Automation L4",
            type="course",
            x=108.0, y=-54.0, z=45.0,
            color="#5bbfa7",  # Teal
            radius=8.5,
            meta={"coverage": "42%", "seats": "29%", "type": "COURSE / CURRICULUM"}
        ),
        GraphNode(
            id="node_4",
            label="Training capacity",
            type="capacity",
            x=142.0, y=38.0, z=-28.0,
            color="#5bbfa7",
            radius=8.0,
            meta={"usable": skill.get("usable_capacity_pct", 29), "type": "CAPACITY SIGNAL"}
        ),
        GraphNode(
            id="node_5",
            label="Employment outcomes",
            type="outcome",
            x=22.0, y=118.0, z=54.0,
            color="#5bbfa7",
            radius=8.5,
            meta={"confirmed": 220, "unobserved": 160, "retention_6mo": 140, "type": "OUTCOME SIGNAL"}
        ),
        GraphNode(
            id="node_6",
            label="Evidence records",
            type="evidence",
            x=-30.0, y=-124.0, z=-52.0,
            color="#6bc9e8",
            radius=7.5,
            meta={"count": skill.get("evidence_count", 23), "type": "PROVENANCE RECORDS"}
        ),
        GraphNode(
            id="node_7",
            label="Pune cluster",
            type="geo",
            x=-152.0, y=-6.0, z=-24.0,
            color="#b09add",  # Purple/corridor
            radius=6.5,
            meta={"region": "Bhosari-Chakan corridor", "type": "INDUSTRIAL CLUSTER"}
        ),
        GraphNode(
            id="node_8",
            label="Equipment inventory",
            type="equipment",
            x=82.0, y=100.0, z=-48.0,
            color="#d96962",  # Red / Warning
            radius=6.5,
            meta={"active": 14, "maintenance": 1, "type": "EQUIPMENT ASSET"}
        ),
        GraphNode(
            id="node_9",
            label="AI PCB candidate",
            type="emerging",
            x=128.0, y=-108.0, z=-54.0,
            color="#e0ad5b",
            radius=6.5,
            meta={"stage": "Stage 4", "type": "EMERGING COMPETENCY"}
        )
    ]
    
    # 17 Edges representing the causal & intelligence relationships
    edges: List[GraphEdge] = [
        GraphEdge(source=0, target=1, label="generates demand signal"),
        GraphEdge(source=0, target=2, label="maps to occupation"),
        GraphEdge(source=0, target=3, label="taught in curriculum"),
        GraphEdge(source=0, target=4, label="trained through capacity"),
        GraphEdge(source=0, target=5, label="results in outcomes"),
        GraphEdge(source=0, target=6, label="substantiated by evidence"),
        GraphEdge(source=0, target=7, label="concentrated in cluster"),
        GraphEdge(source=0, target=8, label="requires equipment"),
        GraphEdge(source=1, target=2, label="hiring roles"),
        GraphEdge(source=1, target=6, label="source provenance"),
        GraphEdge(source=3, target=4, label="delivery capacity"),
        GraphEdge(source=3, target=8, label="training equipment"),
        GraphEdge(source=4, target=5, label="graduate pipeline"),
        GraphEdge(source=5, target=6, label="tracer observations"),
        GraphEdge(source=7, target=1, label="employer cluster demand"),
        GraphEdge(source=6, target=9, label="emerging signals"),
        GraphEdge(source=3, target=9, label="curriculum gap")
    ]
    
    return EntityGraphOut(
        skill_id=skill["id"] if skill else "cnc_programming",
        canonical_name=canonical_name,
        nodes=nodes,
        edges=edges
    )

def resolve_multilingual_skill(raw_phrase: str) -> Dict[str, Any]:
    """
    Multilingual Skill Intelligence Resolver (Section 6.4 of SkillPulse Final Approach).
    Handles English, Hindi, Marathi, Hinglish, Maranglish, transliteration and colloquial technical terms.
    Preserves raw value alongside canonical interpretation with confidence and review status.
    """
    phrase = raw_phrase.strip()
    p_lower = phrase.lower()
    
    # Multilingual Alias Knowledge Base
    kb = [
        # CNC Programming
        {
            "patterns": ["cnc", "g-code", "5-axis", "fanuc", "सीएनसी", "जी-कोड", "cnc coding", "cnc program", "cnc machine operator"],
            "canonical_name": "CNC Programming",
            "canonical_id": "cnc_programming",
            "confidence": 0.92,
            "lang": "English (technical)" if not any(ord(c) > 127 for c in phrase) else "Marathi / Devanagari"
        },
        # Lathe Operation / Turning
        {
            "patterns": ["lathe chalavta", "lathe aala pahije", "लेथ चालवणे", "turning", "lathe operator", "leth machine"],
            "canonical_name": "Lathe Operation & Turning",
            "canonical_id": "mech_turning",
            "confidence": 0.84,
            "lang": "Marathi (transliterated)" if "chalavta" in p_lower or "pahije" in p_lower else ("Marathi / Devanagari" if any(ord(c) > 127 for c in phrase) else "Hinglish / Colloquial")
        },
        # PLC Troubleshooting
        {
            "patterns": ["plc", "ladder logic", "पीएलसी", "fault finding", "scada", "siemens plc", "allen bradley"],
            "canonical_name": "PLC Troubleshooting",
            "canonical_id": "plc_troubleshooting",
            "confidence": 0.90,
            "lang": "English (technical)" if not any(ord(c) > 127 for c in phrase) else "Marathi / Devanagari"
        },
        # CAD/CAM
        {
            "patterns": ["cad", "cam", "mastercam", "solidworks", "3d modelling", "कॅड", "कॅम", "autocad", "nx cam"],
            "canonical_name": "CAD/CAM",
            "canonical_id": "cad_cam",
            "confidence": 0.89,
            "lang": "English (technical)" if not any(ord(c) > 127 for c in phrase) else "Marathi / Devanagari"
        },
        # Digital Measurement / Metrology
        {
            "patterns": ["cmm", "metrology", "digital measurement", "मोजमाप", "डिजिटल मापन", "micrometer", "vernier caliper", "tolerance check"],
            "canonical_name": "Digital Measurement",
            "canonical_id": "digital_measurement",
            "confidence": 0.87,
            "lang": "English (technical)" if not any(ord(c) > 127 for c in phrase) else "Marathi / Devanagari"
        },
        # Mechanical Fitting
        {
            "patterns": ["fitter", "fitter ka kaam", "फिटिंग", "फिटर", "fitting", "assembly"],
            "canonical_name": "Mechanical Fitting",
            "canonical_id": "mech_fitting",
            "confidence": 0.82,
            "lang": "Hinglish / Colloquial" if "ka kaam" in p_lower else ("Marathi / Devanagari" if any(ord(c) > 127 for c in phrase) else "English (trade)")
        },
        # Collaborative Robotics
        {
            "patterns": ["cobot", "collaborative robot", "रोबोटिक्स", "teach pendant", "ur robot"],
            "canonical_name": "Collaborative Robot Setup",
            "canonical_id": "collaborative_robotics",
            "confidence": 0.85,
            "lang": "English (technical)" if not any(ord(c) > 127 for c in phrase) else "Marathi / Devanagari"
        }
    ]
    
    for item in kb:
        if any(pat in p_lower for pat in item["patterns"]):
            return {
                "raw_phrase": phrase,
                "detected_language": item["lang"],
                "canonical_name": item["canonical_name"],
                "canonical_id": item["canonical_id"],
                "confidence_score": item["confidence"],
                "validation_state": "Mapped automatically; reversible for human review",
                "is_reversible": True,
                "transformation_path": f"Raw phrase '{phrase}' -> Detected {item['lang']} -> Alias KB lookup -> Canonical '{item['canonical_name']}'"
            }
            
    # Default fallback for unknown or generic terms
    is_indic = any(ord(c) > 127 for c in phrase)
    return {
        "raw_phrase": phrase,
        "detected_language": "Marathi / Hindi (Devanagari)" if is_indic else "Informal / Mixed Language",
        "canonical_name": phrase.title(),
        "canonical_id": phrase.lower().replace(" ", "_"),
        "confidence_score": 0.65,
        "validation_state": "Under Review — Routed to Human Curator",
        "is_reversible": True,
        "transformation_path": f"Raw phrase '{phrase}' -> Low confidence mapping -> Flagged for human review"
    }

