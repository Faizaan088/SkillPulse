"""
SkillPulse Database Connection and Query Manager
Supports PostgreSQL + PostGIS with transparent, zero-dependency SQLite fallback.
"""

import os
import sqlite3
import json
import math
from pathlib import Path
from typing import List, Dict, Any, Optional

# Vercel ka filesystem read-only hota hai (sirf /tmp writable hai)
if os.environ.get("VERCEL"):
    DB_FILE = Path("/tmp") / "skillpulse.db"
else:
    DB_FILE = Path(__file__).resolve().parent / "skillpulse.db"
SCHEMA_SQL = Path(__file__).resolve().parent / "schema.sql"
SEED_SQL = Path(__file__).resolve().parent / "seed.sql"

def get_connection() -> sqlite3.Connection:
    """Return an active connection to the SQLite database with row dict factory."""
    conn = sqlite3.connect(str(DB_FILE))
    conn.row_factory = sqlite3.Row
    return conn

def init_db(force: bool = False):
    """
    Initialize database schema and seed data.
    Ensures that table structures and demo records exist.
    """
    if force and DB_FILE.exists():
        try:
            DB_FILE.unlink()
        except Exception:
            pass

    conn = get_connection()
    cursor = conn.cursor()

    # Check if tables already exist
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='skills'")
    exists = cursor.fetchone()

    if not exists or force:
        # Create tables adapted for SQLite
        sqlite_schema = """
        CREATE TABLE IF NOT EXISTS districts (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            state TEXT NOT NULL DEFAULT 'Maharashtra',
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            demand_signal TEXT NOT NULL,
            advanced_capacity_pct INTEGER NOT NULL,
            six_month_outcome_pct INTEGER NOT NULL,
            market_observability TEXT NOT NULL,
            centres_count INTEGER NOT NULL DEFAULT 1,
            detail TEXT NOT NULL,
            boundary_geojson TEXT
        );

        CREATE TABLE IF NOT EXISTS skills (
            id TEXT PRIMARY KEY,
            canonical_name TEXT NOT NULL,
            sector TEXT NOT NULL,
            aliases TEXT NOT NULL,
            demand_trend TEXT NOT NULL,
            confidence_score REAL NOT NULL,
            market_observability TEXT NOT NULL,
            evidence_count INTEGER NOT NULL DEFAULT 0,
            active_courses_count INTEGER NOT NULL DEFAULT 0,
            usable_capacity_pct INTEGER NOT NULL,
            target_outcome_pct INTEGER NOT NULL,
            geographic_spread TEXT NOT NULL,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS occupations (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            title TEXT NOT NULL,
            sector TEXT NOT NULL,
            demand_signal TEXT NOT NULL,
            trend TEXT NOT NULL,
            market_observability TEXT NOT NULL,
            confidence_score REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS courses (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            title TEXT NOT NULL,
            nsqf_level INTEGER NOT NULL,
            duration_months INTEGER NOT NULL,
            curriculum_coverage_pct INTEGER NOT NULL,
            usable_seats_pct INTEGER NOT NULL,
            verified_trainers_count INTEGER NOT NULL,
            active_equipment_count INTEGER NOT NULL,
            district_id TEXT REFERENCES districts(id)
        );

        CREATE TABLE IF NOT EXISTS employers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            sector TEXT NOT NULL,
            district_id TEXT REFERENCES districts(id),
            cluster_name TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            verified_openings INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS training_centres (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            district_id TEXT REFERENCES districts(id),
            latitude REAL,
            longitude REAL,
            usable_capacity_pct INTEGER NOT NULL,
            active_simulators INTEGER NOT NULL DEFAULT 0,
            maintenance_simulators INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS equipment (
            id TEXT PRIMARY KEY,
            centre_id TEXT REFERENCES training_centres(id),
            name TEXT NOT NULL,
            operational_units INTEGER NOT NULL,
            maintenance_units INTEGER NOT NULL,
            last_verified_date TEXT NOT NULL,
            utility_score REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS trainers (
            id TEXT PRIMARY KEY,
            centre_id TEXT REFERENCES training_centres(id),
            name TEXT NOT NULL,
            skill_specialization TEXT NOT NULL,
            certified INTEGER NOT NULL DEFAULT 1,
            capability_score REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS evidence_records (
            id TEXT PRIMARY KEY,
            observation_name TEXT NOT NULL,
            source_name TEXT NOT NULL,
            source_type TEXT NOT NULL,
            ingested_date TEXT NOT NULL,
            geography TEXT NOT NULL,
            district_id TEXT,
            evidence_state TEXT NOT NULL,
            confidence_score REAL NOT NULL,
            raw_text TEXT NOT NULL,
            canonical_mapping TEXT NOT NULL,
            transformation_history TEXT NOT NULL,
            uncertainty_boundary TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tracer_cohorts (
            id TEXT PRIMARY KEY,
            cohort_name TEXT NOT NULL,
            course_id TEXT REFERENCES courses(id),
            enrolled_count INTEGER NOT NULL,
            completed_count INTEGER NOT NULL,
            certified_count INTEGER NOT NULL,
            confirmed_target_employed INTEGER NOT NULL,
            unobserved_outcome_count INTEGER NOT NULL,
            six_month_retained INTEGER NOT NULL,
            response_selection_risk TEXT NOT NULL,
            reported_reasons TEXT
        );

        CREATE TABLE IF NOT EXISTS emerging_skills (
            id TEXT PRIMARY KEY,
            technical_phrase TEXT NOT NULL,
            existing_qualification TEXT NOT NULL,
            qualification_gap TEXT NOT NULL,
            skillness_score REAL NOT NULL,
            gate_status TEXT NOT NULL,
            gate_reason TEXT NOT NULL,
            repetition_count INTEGER NOT NULL,
            independent_employers INTEGER NOT NULL,
            persistence_months INTEGER NOT NULL,
            confidence_score REAL NOT NULL,
            pipeline_stage INTEGER NOT NULL,
            status TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS interventions (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            title TEXT NOT NULL,
            target_scope TEXT NOT NULL,
            duration TEXT NOT NULL,
            scope_skills TEXT NOT NULL,
            reversibility_mechanism TEXT NOT NULL,
            evidence_rationale TEXT NOT NULL,
            success_metrics TEXT NOT NULL,
            pilot_steps TEXT NOT NULL,
            status TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS labour_corridors (
            id TEXT PRIMARY KEY,
            from_district_id TEXT REFERENCES districts(id),
            to_district_id TEXT REFERENCES districts(id),
            corridor_name TEXT NOT NULL,
            dynamic_type TEXT NOT NULL,
            candidate_flow_level TEXT NOT NULL,
            notes TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS program_risk_signals (
            id TEXT PRIMARY KEY,
            program_name TEXT NOT NULL,
            code TEXT NOT NULL,
            course_id TEXT REFERENCES courses(id),
            nsqf_level INTEGER NOT NULL,
            enrollment_level TEXT NOT NULL,
            enrollment_count INTEGER NOT NULL,
            placement_trend TEXT NOT NULL,
            retention_trend TEXT NOT NULL,
            current_demand TEXT NOT NULL,
            risk_state TEXT NOT NULL,
            risk_category TEXT NOT NULL,
            evidence_count INTEGER NOT NULL,
            confidence_score REAL NOT NULL,
            recommended_action TEXT NOT NULL,
            review_rationale TEXT NOT NULL,
            district_id TEXT REFERENCES districts(id)
        );
        """
        cursor.executescript(sqlite_schema)

        # Parse seed.sql commands and insert
        if SEED_SQL.exists():
            with open(SEED_SQL, "r", encoding="utf-8") as f:
                seed_text = f.read()

            # Replace PostgreSQL specific ON CONFLICT clauses for SQLite compatibility
            clean_seed = seed_text.replace("ON CONFLICT (id) DO UPDATE SET", "ON CONFLICT(id) DO UPDATE SET")
            # Replace TRUE/FALSE with 1/0
            clean_seed = clean_seed.replace("TRUE", "1").replace("FALSE", "0")
            cursor.executescript(clean_seed)

        conn.commit()

    # Always ensure program_risk_signals exists and is seeded for existing databases
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS program_risk_signals (
        id TEXT PRIMARY KEY,
        program_name TEXT NOT NULL,
        code TEXT NOT NULL,
        course_id TEXT REFERENCES courses(id),
        nsqf_level INTEGER NOT NULL,
        enrollment_level TEXT NOT NULL,
        enrollment_count INTEGER NOT NULL,
        placement_trend TEXT NOT NULL,
        retention_trend TEXT NOT NULL,
        current_demand TEXT NOT NULL,
        risk_state TEXT NOT NULL,
        risk_category TEXT NOT NULL,
        evidence_count INTEGER NOT NULL,
        confidence_score REAL NOT NULL,
        recommended_action TEXT NOT NULL,
        review_rationale TEXT NOT NULL,
        district_id TEXT REFERENCES districts(id)
    );
    """)
    cursor.execute("SELECT COUNT(*) FROM program_risk_signals")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO program_risk_signals (id, program_name, code, course_id, nsqf_level, enrollment_level, enrollment_count, placement_trend, retention_trend, current_demand, risk_state, risk_category, evidence_count, confidence_score, recommended_action, review_rationale, district_id)
        VALUES
        ('risk_cnc_basic', 'CNC Machining (Basic 3-Axis)', 'PR-01', 'course_cnc_l4', 4, 'HIGH', 500, '↓ 14%', '↓ 9%', 'MODERATE / SHIFTING', 'At Risk', 'TRAINING SUPPLY MISALIGNMENT', 23, 0.82, 'Review modular curriculum upgrade; pilot multi-axis CAM training before next intake cycle (Intervention I-01)', 'Declining placement (↓ 14%) and 6-month retention (↓ 9%) indicate training-supply misalignment with industry specifications requiring multi-axis CAM and offset optimization; does not prove curricular defect.', 'pune'),
        ('risk_conv_turning', 'Conventional Turning & Lathe', 'PR-02', 'course_cnc_l4', 3, 'HIGH', 640, '↓ 21%', '↓ 18%', 'LOW / DECLINING', 'Critical', 'TECHNICAL OBSOLESCENCE DRIFT', 19, 0.79, 'Administrative review for dual-track retrofit; transition second-year seats to CNC Operator curriculum', 'Persistent decline in manual lathe employer requisitions across auto component hubs; high enrollment creates structural graduate underemployment.', 'pune'),
        ('risk_manual_fitting', 'Manual Fitting & Bench Work', 'PR-03', 'course_auto_l4', 3, 'MODERATE', 380, '↓ 6%', '↓ 4%', 'STABLE / BASELINE', 'Watch', 'SLOW INDUSTRIAL ABSORPTION', 12, 0.73, 'Integrate digital measurement and precision tolerance micro-credentials into bench assembly syllabus', 'Basic bench fitting remains necessary as foundational trade, but standalone placement is slowing as automated sub-assemblies expand.', 'satara'),
        ('risk_digital_metrology', 'Digital Metrology & Quality Assurance', 'PR-04', 'course_metrology_l4', 4, 'MODERATE', 240, '↑ 8%', '↑ 5%', 'STRONG / RISING', 'Stable', 'ALIGNED SUPPLY', 16, 0.85, 'Maintain current cohort intake; calibrate CMM optical scanners and coordinate probe rigs', 'Strong target-sector absorption and positive 6-month retention confirm robust alignment with aerospace and auto QA demands.', 'chhatrapati_sambhajinagar')
        """)
        conn.commit()

    conn.close()

def query_all(query: str, params: tuple = ()) -> List[Dict[str, Any]]:
    """Execute query and return list of dicts."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()

def query_one(query: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
    """Execute query and return single dict or None."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def execute(query: str, params: tuple = ()) -> int:
    """Execute mutation and return rowcount."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        return cursor.rowcount
    finally:
        conn.close()

# Spatial utility helpers simulating PostGIS functions
def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great circle distance in kilometres."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c
