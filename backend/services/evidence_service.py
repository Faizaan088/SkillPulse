"""
Evidence Explorer, Data Quality & "Show Me Why" Provenance Service
"""

from typing import List, Dict, Any, Optional
from backend.database.db import query_all, query_one
from backend.models.schemas import EvidenceRecordOut, EvidenceChainOut, EvidenceChainStep

CHAINS_DATA = {
    "cnc": {
        "title": "Why expand CNC planning attention?",
        "text": "The recommendation fuses multiple independent signals into an auditable planning prompt, not an assumption of market certainty.",
        "steps": [
            ("RECOMMENDATION", "Expand advanced CNC pilot capacity", "A controlled, measurable pilot is proposed rather than permanent capital expansion."),
            ("FUSED SIGNALS", "Increasing CNC programming demand", "9 employer signals, 6 placement records and 3 recent tracer observations point in the same direction."),
            ("NORMALIZED ENTITIES", "CNC programming ↔ CNC operator ↔ CNC Machining L4", "Aliases and raw multilingual terms remain available for human audit."),
            ("SOURCE OBSERVATIONS", "23 active evidence records", "Employer, placement, tracer, and survey sources each carry timestamps, geography, and precision bounds."),
            ("QUALITY & CONFIDENCE", "Confidence 0.82 / observability medium", "Digital signals are not treated as the totality of the physical market."),
            ("LIMIT & ASSUMPTION", "Outcome conversion is incomplete", "Unknown outcomes are retained as unknown; causality is not invented from correlation.")
        ]
    },
    "pulse": {
        "title": "Why does the market pulse show drift?",
        "text": "The pulse engine compares industry requirements against current curriculum, verified capacity, and tracer retention.",
        "steps": [
            ("SIGNAL", "Demand increased 18%", "Confidence-weighted signal change across the active 90-day observation window."),
            ("ALIGNMENT", "Curriculum coverage is 42%", "Current CNC L4 modules under-cover validated programming requirements."),
            ("CAPACITY", "Usable advanced capacity is 29%", "Capacity combines physical centres, qualified trainers, and operating equipment status."),
            ("OUTCOME", "140 retained at 6 months", "Observed strictly among traced respondents; non-responders held as unobserved."),
            ("DECISION", "Review a controlled pilot", "The intervention is reversible, measurable, and includes strict outcome gates.")
        ]
    },
    "supply": {
        "title": "Why is effective supply a range?",
        "text": "The system only knows verified outcomes directly. It exposes the unknown portion instead of turning it into a definitive employment number.",
        "steps": [
            ("COHORT", "380 certified candidates", "Direct observed certification records from accredited institutes."),
            ("CONFIRMED OUTCOMES", "220 target-sector employed", "Direct observed through employer-verified placement and tracer records."),
            ("UNOBSERVED", "160 outcomes not verified", "Missing contact or survey non-response does not imply unemployment or failure."),
            ("SENSITIVITY", "Potential effective supply 220–290", "Range derives from stated tracer response sampling assumptions."),
            ("LIMIT", "Selection risk is medium", "Traced respondents may not represent the complete unobserved cohort.")
        ]
    },
    "emerging": {
        "title": "Why is AI-assisted PCB design a candidate?",
        "text": "The phrase is not automatically treated as a new qualification. It has crossed four evidence gates and awaits human validation.",
        "steps": [
            ("PHRASE", "AI-assisted PCB design", "Repeated technical phrase extracted from employer specifications."),
            ("SKILLNESS", "Passed technical relevance gate", "Classified as a discrete technical competency rather than a job condition."),
            ("KNOWN MATCH", "Partial PCB Design match", "Existing curriculum does not adequately cover generative routing or AI DRC workflows."),
            ("ACCUMULATION", "4 independent employers / 3 periods", "Repetition, independence, and persistence satisfy the candidate evidence threshold."),
            ("BOUNDARY", "Candidate, not new qualification", "Human curriculum committee review is mandatory prior to qualification reform.")
        ]
    },
    "geography": {
        "title": "Why focus on this labour corridor?",
        "text": "Economic relationships cross administrative boundaries. Capacity in one district directly influences supply in adjacent industrial clusters.",
        "steps": [
            ("CORRIDOR", "Pune ↔ Chhatrapati Sambhajinagar", "Linked demand and capacity evidence along the central auto corridor."),
            ("DEMAND", "High CNC signal at industrial nodes", "Bhosari, Chakan, and Waluj MIDC employers report acute technician shortages."),
            ("CAPACITY", "29% usable advanced capacity", "Sambhajinagar network has only 2 operating simulator units."),
            ("MOVEMENT", "Candidate path across districts", "Tracer evidence reveals substantial inter-district migration of certified trainees."),
            ("LIMIT", "Observability varies by district", "Low online posting density in semi-urban hubs is not interpreted as low demand.")
        ]
    },
    "alignment": {
        "title": "Why is this called an alignment gap?",
        "text": "The mismatch is calculated across independently inspectable dimensions; the score is a planning aid, not an arbitrary penalty.",
        "steps": [
            ("REQUIREMENT", "CNC programming requirement 89%", "Demand-side evidence strength from verified employer consultations."),
            ("CURRICULUM", "Coverage 42%", "Module-to-competency comparison against current NSQF L4 syllabus."),
            ("CAPACITY", "Usable seats 29%", "Synthesized from centre capacity, trainer certifications, and equipment status."),
            ("RESULT", "Curriculum and capacity mismatch", "Priority is high because industry requirements significantly outpace readiness."),
            ("ACTION", "Inspect before intervening", "Pilot proposal keeps capital deployment measurable and reversible.")
        ]
    },
    "intervention": {
        "title": "Why is a controlled pilot proposed?",
        "text": "The intervention is grounded in an auditable evidence chain and explicitly defines review, scaling, or reversal criteria.",
        "steps": [
            ("DEMAND", "Increasing CNC programming signal", "Multiple recent employer, placement, and survey records converge."),
            ("READINESS", "42% curriculum coverage / 29% capacity", "Inspectable curriculum, trainer, and equipment gaps identified."),
            ("OUTCOMES", "Effective supply uncertain", "Existing conversion must be tested and measured empirically."),
            ("ACTION", "Two-centre controlled pilot", "Targeted deployment in Pune and Sambhajinagar prior to statewide rollout."),
            ("SUCCESS GATE", "Placement, retention and validation", "Expansion permitted only if 55% placement and 40% retention are verified.")
        ]
    },
    "observability": {
        "title": "Why distinguish demand from observability?",
        "text": "A market can have strong local hiring without high online vacancy postings. SkillPulse keeps observability explicit.",
        "steps": [
            ("DIGITAL RECORD", "Low online vacancy count", "A metric of digital visibility, not necessarily physical market volume."),
            ("OTHER SOURCES", "Employer and training evidence present", "Offline industry consultations confirm active hiring in local clusters."),
            ("GEOGRAPHY", "Nashik precision is limited", "Available web postings cover only corporate tier-1 suppliers, missing local MSMEs."),
            ("INTERPRETATION", "Demand: moderate / observability: low", "The two states remain distinct to prevent false zero conclusions."),
            ("LIMIT", "Offline and informal hiring incomplete", "No attempt is made to guess an exact integer total without supporting evidence.")
        ]
    },
    "quality": {
        "title": "Why is confidence 0.78?",
        "text": "Confidence quantifies the quality, freshness, and diversity of the visible evidence, not a claim that the market is completely predictable.",
        "steps": [
            ("RECENCY", "86% sources refreshed in 90 days", "Freshness of active records contributes positively to the score."),
            ("DIVERSITY", "Four active source types", "Evidence fusion across employers, institutes, tracers, and surveys avoids single-source bias."),
            ("MISSINGNESS", "54% tracer outcomes unknown", "Outcome incompleteness applies an explicit penalty to system confidence."),
            ("PRECISION", "31% low geographic precision", "Corridor-level observations retain uncertainty regarding exact training sites."),
            ("RESULT", "0.78 decision-support confidence", "Informs human planners without creating unjustified certainty.")
        ]
    },
    "provenance": {
        "title": "How was this record transformed?",
        "text": "Evidence records retain the original source text, normalization history, and semantic confidence.",
        "steps": [
            ("RAW OBSERVATION", "Source text retained", "Original phrase, timestamp, geographic coordinates, and source identity are immutable."),
            ("LANGUAGE & EXTRACTION", "Language-aware processing", "The multilingual source phrase is evaluated for technical relevance."),
            ("NORMALIZATION", "Canonical entity linked", "Alias knowledge base resolves colloquial variants with confidence scoring."),
            ("VALIDATION", "Mapping remains reviewable", "Human reviewers can inspect, validate, or override low-confidence resolutions."),
            ("USE", "Contributes to a fused signal", "The raw record remains traceable from any downstream planning recommendation.")
        ]
    },
    "program_risk": {
        "title": "Why is this traditional program flagged at risk?",
        "text": "Declining placement and retention signal training-supply misalignment with industry specifications. The signal prompts an administrative review rather than an assumption of curriculum failure.",
        "steps": [
            ("ENROLLMENT VOLUME", "High intake persistence", "500 candidates enrolled in traditional CNC Machining L4 across active centres."),
            ("PLACEMENT DRIFT", "Placement trend down 14%", "Confirmed target-sector employment has dropped relative to historical cohorts."),
            ("RETENTION DRIFT", "6-month retention down 9%", "Traced graduates report difficulty matching basic 3-axis skills to employer 5-axis requirements."),
            ("DEMAND SHIFT", "Industry demand is shifting, not disappearing", "23 employer signals confirm strong demand, but specifically for multi-axis CAM and offset optimization."),
            ("RISK STATE", "Supply misalignment, not curricular failure", "Identifies an alignment review prompt; recommended action is modular pilot modernization (Intervention I-01).")
        ]
    },
    "district_plan": {
        "title": "How is the District Action Plan synthesized?",
        "text": "The plan fuses demand signals, spatial capacity, trainer capability, and equipment status into prioritized planning allocations.",
        "steps": [
            ("MARKET SIGNAL", "Industrial cluster hiring demand", "Aggregated employer requisitions and corridor flow indicate high technician demand."),
            ("SPATIAL CAPACITY", "Usable seat bottleneck", "District advanced capacity (e.g. 29% in Sambhajinagar, 68% in Pune) defines physical seat targets."),
            ("READINESS AUDIT", "Trainer & equipment constraints", "Verified simulator maintenance and uncertified trainer records directly determine upskilling priorities."),
            ("INTERVENTION LINK", "Controlled pilot alignment", "Allocations tie directly to active pilot interventions (e.g., I-01: +120 seats)."),
            ("ADMINISTRATIVE BOUNDARY", "Indicative planning estimates", "Budgets and targets are planning priorities requiring administrative sanction, not sovereign appropriations.")
        ]
    }
}

def get_evidence_records(district_filter: Optional[str] = None) -> List[EvidenceRecordOut]:
    if district_filter and district_filter != "All districts":
        d_clean = district_filter.replace("Chhatrapati ", "Chh. ").lower()
        rows = query_all("SELECT * FROM evidence_records WHERE LOWER(geography) LIKE ? OR district_id = ?", (f"%{d_clean}%", district_filter.lower()))
    else:
        rows = query_all("SELECT * FROM evidence_records")
        
    return [
        EvidenceRecordOut(
            id=r["id"],
            name=r["observation_name"],
            source=r["source_name"],
            source_type=r["source_type"],
            date=r["ingested_date"],
            place=r["geography"],
            state=r["evidence_state"],
            confidence=r["confidence_score"],
            raw_text=r["raw_text"],
            canonical_mapping=r["canonical_mapping"],
            transformation_history=r["transformation_history"],
            uncertainty_boundary=r["uncertainty_boundary"]
        )
        for r in rows
    ]

def get_evidence_chain(key: str) -> EvidenceChainOut:
    chain = CHAINS_DATA.get(key) or CHAINS_DATA["cnc"]
    steps = [
        EvidenceChainStep(step_label=s[0], title=s[1], detail=s[2])
        for s in chain["steps"]
    ]
    cnt_row = query_one("SELECT COUNT(*) as cnt, AVG(confidence_score) as avg_conf FROM evidence_records")
    active_records = cnt_row["cnt"] if cnt_row and cnt_row["cnt"] else 23
    conf_score = round(cnt_row["avg_conf"], 2) if cnt_row and cnt_row["avg_conf"] else 0.82
    
    return EvidenceChainOut(
        key=key,
        title=chain["title"],
        explanation=chain["text"],
        steps=steps,
        meta={
            "freshness": "6 DAYS",
            "geographic_precision": "DISTRICT / CORRIDOR",
            "active_records": active_records,
            "confidence": conf_score
        }
    )

def get_data_quality() -> Dict[str, Any]:
    cnt_row = query_one("SELECT COUNT(*) as cnt, AVG(confidence_score) as avg_conf FROM evidence_records")
    conf_score = round(cnt_row["avg_conf"], 2) if cnt_row and cnt_row["avg_conf"] else 0.78
    
    return {
        "confidence_score": conf_score,
        "source_freshness_pct": 86,
        "outcome_missingness_pct": 54,
        "entity_confidence_score": 0.84,
        "low_precision_geo_pct": 31,
        "source_profiles": [
            {"name": "Employer signals", "pct": "86%", "color": "var(--teal)"},
            {"name": "Placement records", "pct": "79%", "color": "var(--blue)"},
            {"name": "Tracer observations", "pct": "46%", "color": "var(--amber)"},
            {"name": "Industry survey", "pct": "62%", "color": "var(--blue)"}
        ],
        "visible_limitations": [
            {"title": "Response selection risk: medium", "detail": "Tracer respondents may not represent all graduates. Missing outcomes are not coded as failure."},
            {"title": "Digital observability: low in Nashik", "detail": "Online postings cover only part of the local market."},
            {"title": "Equipment inventory freshness: 29 days", "detail": "One CNC simulator has a maintenance status that may change capacity."}
        ],
        "conflicting_observations": [
            {"code": "C-01", "title": "Demand evidence differs by source", "detail": "Employer signals rise while digital vacancy volume remains flat in Nashik.", "why": "observability"},
            {"code": "C-02", "title": "Placement and tracer coverage differ", "detail": "Training-centre placement record is available; independent six-month verification is partial.", "why": "supply"}
        ]
    }
