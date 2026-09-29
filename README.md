# SkillPulse — Evidence-to-Action Intelligence Layer
**Continuous Skill Planning & Capability Alignment Decision Support Platform**  
*Smart India Hackathon 2026 — Problem Statement 134*

SkillPulse connects fragmented labour market demand, accredited curriculum, physical training capacity, verified equipment, certified trainers, and graduate employment outcomes into an auditable, evidence-driven planning loop.

---

## 1. System Architecture & 10-Layer Core Spine

SkillPulse is architected around a rigorous 10-layer decision-support spine with a downstream candidate guidance extension:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       10-LAYER DECISION-SUPPORT SPINE                       │
└─────────────────────────────────────────────────────────────────────────────┘
  [Layer 01] Multi-Source Ingestion
             (Job postings, curriculum syllabi, ITI centre records, tracer surveys)
                                    │
                                    ▼
  [Layer 02] Data Quality, Provenance & Evidence Ledger
             (Freshness, precision scoring, immutable raw observations)
                                    │
                                    ▼
  [Layer 03] Canonical Entity Resolution & Skillness Gate
             (Distinguish real competencies from working conditions/job titles)
                                    │
                                    ▼
  [Layer 04] Multilingual Skill Intelligence
             (Marathi, Hindi, Hinglish, English trade terminology with dialect-aware alias mapping)
                                    │
                                    ▼
  [Layer 05] Skill Intelligence Core & 3D Interactive Web Canvas
             (Interactive 3D entity relationship graph, multi-dimensional competency modeling)
                                    │
                                    ▼
  [Layer 06] Market Demand Intelligence & Observability Disambiguation
             (Fused signal velocity, Demand ≠ Observability, MSME digital shadow awareness)
                                    │
                                    ▼
  [Layer 07] Supply Pipeline & Outcome Realities
             (Nominal vs. Effective supply funnel, Missing ≠ Failure, retention tracking)
                                    │
                                    ▼
  [Layer 08] Geospatial & Labour Corridor Modeling
             (Economic corridors vs administrative district borders, spatial mismatch)
                                    │
                                    ▼
  [Layer 09] 4-Way Capability Alignment Engine
             (Industry Requirements vs Curriculum Coverage vs Physical Seats vs Equipment)
                                    │
                                    ▼
  [Layer 10] Reversible Intervention Orchestration & Show Me Why Audit Trails
             (Controlled pilots, review gates, complete evidentiary provenance)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                DOWNSTREAM EXTENSION: CANDIDATE GUIDANCE                     │
│  (Personalized gap diagnosis, verified career pathways, industrial problem  │
│   spaces — strictly downstream of the planning engine, not a job portal)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Runtime Demonstrator vs. Production Architecture

To ensure transparent and honest engineering evaluation, SkillPulse clearly delineates between the current local demonstrator and the target enterprise deployment:

| Dimension | Current Runtime Demonstrator | Target Production Architecture |
| :--- | :--- | :--- |
| **Database Engine** | **SQLite 3 (`backend/database/skillpulse.db`)** with zero external runtime dependencies | **PostgreSQL 16** with high-concurrency connection pooling (PgBouncer) |
| **Spatial Engine** | **Haversine trigonometric distance** computed dynamically in Python/SQLite | **PostGIS spatial extension (`ST_DWithin`, `ST_Distance`)** using GIS shapefiles |
| **DDL & Schemas** | Transparent SQLite tables mapped to Pydantic schemas | Full relational schema defined in `backend/database/schema.sql` |
| **Seed Integrity** | Coherent 23-evidence record SQLite database (`seed.sql`) | Distributed migration script via Flyway / Alembic |
| **Intelligence Sourcing** | **100% database-driven** from SQLite tables (no mock/simulated fallback substitutions) | Distributed analytics warehouse / streaming Kafka pipeline |
| **Data Integrity Gate** | Explicit "Data Service Unavailable" UI status banners if backend is down | Circuit breaker pattern with graceful degradation alerts |

---

## 3. Technology Stack

- **Backend**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn, RESTful architecture.
- **Database**:
  - Demonstrator: SQLite3 with relational foreign keys and dynamic calculations.
  - Production: PostgreSQL + PostGIS schema (`backend/database/schema.sql`).
- **Frontend**: Dependency-free analytical UI shell (`index.html`, `styles.css`, `app.js`), responsive CSS grid, DM Mono & Manrope typography, zero AI clichés (no purple glowing cards or chat-first distractions).
- **3D Visualization**: Interactive 3D WebGL / HTML5 Canvas entity-relationship graph with spatial orbits, orbital rotation, distance zoom, node picking, edge pulse animation, and state binding.
- **Spatial Modeling**: Economic labour corridors (e.g. Pune ↔ Chhatrapati Sambhajinagar corridor) crossing administrative boundaries.

---

## 4. Key REST API Endpoints

### Planning & Market Intelligence
- `GET /api/overview` — Current planning cycle, pulse metrics, critical signals (dynamically derived from evidence records).
- `GET /api/skills` — List canonical skills with confidence, demand, and observability metrics.
- `GET /api/skills/{id}/graph` — 3D entity relationship graph nodes and edges.
- `POST /api/skills/multilingual-resolve` — Multilingual Skill Intelligence resolver (resolves colloquial Marathi, Hindi, Hinglish, English terms).
- `GET /api/market/signals` — Fused demand signals, monthly velocity, and source mix.
- `GET /api/market/occupations` — Occupation demand matrix.

### Supply & Outcomes
- `GET /api/supply/pipeline` — Nominal vs. effective supply funnel (500 enrolled → 420 completed → 380 certified → 220 target-sector employed → 140 retained at 6mo; 160 unobserved).

### Emerging Skills & Validation
- `GET /api/emerging` — Emerging competency pipeline candidates.
- `POST /api/emerging/skillness-gate` — Live Skillness Gate classifier (evaluates competencies vs. working conditions/job titles).

### Geography & Alignment
- `GET /api/geography` — Districts, labour corridors, and spatial mismatch analysis.
- `GET /api/alignment` — 4-way capability alignment matrix (Industry Requirements vs Curriculum vs Capacity vs Equipment).

### Program Risk & District Action Planning
- `GET /api/supply/program-risks` — Traditional programs with `over_enrolled` flag, intake-shift % and seats to redeploy (rule: HIGH intake + falling placement + falling retention).
- `GET /api/geography/district/{id}/action-plan` — Executive district plan with program-level seat quota changes and budget priority.
- `GET /api/geography/district/{id}/action-plan/export?format=csv|json|html` — Export a single district plan.
- `GET /api/geography/action-plan/statewide` — All districts compiled and ranked (seat quotas, redeployment, budget share).
- `GET /api/geography/action-plan/statewide/export?format=csv|json|html` — Statewide export (HTML is print-to-PDF ready).

### Interventions & Auditability
- `GET /api/interventions` — Proposed controlled pilot interventions.
- `POST /api/interventions/{id}/review` — Update intervention status (`"Proposed controlled pilot"`, `"Planning Review"`, or `"reset"`).
- `GET /api/evidence` — Immutable raw evidence records with complete provenance.
- `GET /api/evidence/chain/{key}` — Interactive "Show Me Why" multi-step audit trail (backed by dynamic DB queries).
- `GET /api/quality` — Data health, freshness, missingness, and visible system limitations.

### Downstream Candidate Guidance
- `GET /api/candidate/guidance` — Grounded downstream learner guidance (diagnostic gap evaluation, verified skill pathways, active hiring employers, industrial problem spaces).

### Search
- `GET /api/search?q={query}` — Unified entity search across skills, courses, employers, and districts.

---

## 5. Canonical Numbers & Verification Truths

To maintain absolute data integrity across all UI panels and API endpoints:
- **Enrolled**: `500`
- **Completed**: `420`
- **Certified**: `380`
- **Target-Sector Employed**: `220`
- **Retained at 6 Months**: `140`
- **Unobserved Outcomes**: `160` (held in unknown status; never counted as zero or failure)
- **Effective Supply Range**: `220–290`
- **Statewide Confidence**: `0.78` (derived from `AVG(confidence_score)` across 23 evidence records)
- **Advanced Capacity Available**: `29%` (derived from `MIN(advanced_capacity_pct)` in districts)
- **Active Evidence Records**: `23` records in `backend/database/skillpulse.db`

---

## 6. Quickstart & Execution

### 1. Start the FastAPI Server:
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Open **`http://127.0.0.1:8000`** in any web browser.

### 2. Run Comprehensive Automated QA Suite:
```powershell
python test_system_qa.py
```
*Validates all 14 core endpoints, database consistency, multilingual resolution, candidate guidance, and intervention state persistence.*

---

## 7. Demonstration Script for Evaluators (3–5 Minutes)

1. **System Overview**:
   - Open **Overview**. Point out Planning Cycle 03, statewide confidence (`0.78`), and the three critical indicators: *CNC Programming demand surge (+18%)*, *Curriculum alignment deficit (42%)*, and *Capacity deficit (29%)*.
2. **Interactive 3D Skill Intelligence Graph**:
   - Open **Skill Intelligence**. Drag to rotate the 3D entity relationship graph, zoom into the node cluster, and click on **CNC Programming** or **Employment Outcomes** to see live database metadata.
3. **Multilingual Skill Intelligence (Layer 04)**:
   - Open **System Status**. In the **Multilingual Skill Intelligence Resolver**, test colloquial phrases such as `"लेथ ऑपरेटर"` (Lathe Operator), `" खराद काम "` (Kharad Kaam), `"सीएनसी प्रोग्रामिंग"`, or `"jig fixtures ka kaam"`. Demonstrate instant canonical resolution with confidence scoring and reverse-translation audit trails.
4. **Market Observability Disambiguation ($Demand \neq Observability$)**:
   - Open **Market Intelligence**. Explain how digital job postings reflect only formal hiring, while MSME clusters operate through offline networks. Show how SkillPulse tracks demand velocity without confusing low digital visibility with lack of demand.
5. **Supply Funnel & Outcome Realities ($Missing \neq Failure$)**:
   - Open **Supply & Outcomes**. Walk through the 500 enrolled $\rightarrow$ 220 employed $\rightarrow$ 140 retained funnel. Emphasize that the 160 untraced graduates are explicitly treated as *unobserved*, avoiding distorted success metrics.
6. **4-Way Capability Alignment Engine**:
   - Open **Alignment Engine**. Explain the multi-dimensional alignment matrix: Industry Requirement (89%) vs. Curriculum Coverage (42%) vs. Training Capacity (29%) vs. Verified Equipment (52%).
7. **Downstream Candidate Guidance**:
   - Open **Candidate Guidance**. Show how institutional intelligence directly benefits individual learners: real-time competency gap diagnosis, step-by-step verified pathways, active employer connections, and real-world industrial problem spaces (e.g. *Tool chatter troubleshooting on Inconel aerospace components*).
8. **Reversible Interventions & "Show Me Why" Auditability**:
   - Open **Interventions**. View proposed pilot `I-01` (*Expand advanced CNC training capacity*). Click **Mark for review** to demonstrate real-time database state persistence.
   - Click **Show me why** on any card to inspect the multi-step evidentiary lineage from raw observation to decision gate.
#   S K I L L P U L S E  
 #   S K I L L P U L S E  
 