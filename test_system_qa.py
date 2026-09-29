"""
End-to-End System QA Test Suite for SkillPulse
Tests API, Data Consistency, Spatial Features, and Decision Logic
"""

import json
import urllib.request
import urllib.parse

BASE_URL = "http://127.0.0.1:8000"

def get(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=5) as res:
        assert res.status == 200, f"Failed GET {path}: {res.status}"
        return json.loads(res.read().decode())

def post(path, data):
    url = f"{BASE_URL}{path}"
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=5) as res:
        assert res.status == 200, f"Failed POST {path}: {res.status}"
        return json.loads(res.read().decode())

def run_extension_tests():
    print("\n--- Program risk / action plan / candidate notice ---")
    risks = get("/api/supply/program-risks")
    assert any(r["over_enrolled"] for r in risks), "no over-enrolled program flagged"
    ov = get("/api/overview")
    assert ov["program_risk_summary"]["over_enrolled_count"] >= 1
    assert any(s["code"] == "S-05" for s in ov["critical_signals"])
    sw = get("/api/geography/action-plan/statewide")
    assert len(sw["districts"]) == 4 and sw["totals"]["seats_added"] > 0
    assert get("/api/geography/district/pune/action-plan")["program_seat_quota"]
    cg = get("/api/candidate/guidance")
    assert "Maharashtra Industrial Skilling Pilot (Cycle 03)" in cg["active_system_alignment"]["system_notice"]
    print("[PASS] Over-enrolled flags, statewide plan, candidate system notice")

def run_tests():
    print("--- 1. Testing Health Endpoint ---")
    h = get("/health")
    assert h["status"] == "healthy"
    print("[PASS] Health OK:", h["service"])

    print("\n--- 2. Testing Overview Endpoint ---")
    ov = get("/api/overview")
    assert ov["cycle"] == "PLANNING CYCLE 03"
    assert len(ov["critical_signals"]) >= 4
    print("[PASS] Overview OK: Cycle 03, statewide confidence", ov["statewide_confidence"])

    print("\n--- 3. Testing Skills & 3D Graph Endpoints ---")
    skills = get("/api/skills")
    assert len(skills) >= 4
    print(f"[PASS] Skills returned: {len(skills)} canonical skills")

    graph = get("/api/skills/cnc_programming/graph")
    assert len(graph["nodes"]) >= 10
    assert len(graph["edges"]) >= 15
    print(f"[PASS] 3D Entity Graph OK: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges")

    print("\n--- 4. Testing Market Intelligence & Observability ---")
    market = get("/api/market/signals?skill_id=cnc_programming")
    assert market["fused_signal_level"] == "Strong"
    assert market["market_observability"] in ["Medium", "High", "Low"]
    assert len(market["monthly_trend"]) == 7
    print(f"[PASS] Market Signal OK: {market['fused_signal_level']} with observability {market['market_observability']}")

    occs = get("/api/market/occupations")
    assert len(occs) >= 4
    print(f"[PASS] Occupations OK: {len(occs)} tracked occupations")

    print("\n--- 5. Testing Supply & Outcomes Funnel ---")
    supply = get("/api/supply/pipeline")
    assert supply["certified"] == 380
    assert supply["confirmed_target_employed"] == 220
    assert supply["unobserved_outcome"] == 160
    assert supply["six_month_retained"] == 140
    assert supply["effective_supply_range"] == "220–290"
    print(f"[PASS] Supply Funnel OK: {supply['certified']} certified -> {supply['confirmed_target_employed']} relevant sector -> {supply['six_month_retained']} retained at 6mo -> range {supply['effective_supply_range']}")

    print("\n--- 6. Testing Emerging Skills & Skillness Gate ---")
    emerging = get("/api/emerging")
    assert len(emerging) >= 3
    print(f"[PASS] Emerging Skills OK: {len(emerging)} candidate competencies")

    # Benchmark test phrases
    r1 = post("/api/emerging/skillness-gate", {"phrase": "PLC troubleshooting"})
    assert r1["is_skill"] is True
    print("[PASS] Skillness Gate Passed: 'PLC troubleshooting' -> SKILL")

    r2 = post("/api/emerging/skillness-gate", {"phrase": "Night shift"})
    assert r2["is_skill"] is False
    print("[PASS] Skillness Gate Rejected: 'Night shift' -> WORKING CONDITION")

    r3 = post("/api/emerging/skillness-gate", {"phrase": "Aadhaar required"})
    assert r3["is_skill"] is False
    print("[PASS] Skillness Gate Rejected: 'Aadhaar required' -> ADMINISTRATIVE ELIGIBILITY")

    print("\n--- 7. Testing Labour Market Geography ---")
    geo = get("/api/geography")
    assert len(geo["districts"]) == 4
    assert len(geo["corridors"]) == 3
    print(f"[PASS] Geography OK: {len(geo['districts'])} districts, {len(geo['corridors'])} cross-district corridors")

    print("\n--- 8. Testing Alignment Engine ---")
    align = get("/api/alignment")
    assert len(align["matrix"]) >= 4
    assert len(align["priority_mismatches"]) >= 4
    print(f"[PASS] Alignment Engine OK: {len(align['matrix'])} matrix competencies, {len(align['priority_mismatches'])} priority mismatches")

    print("\n--- 9. Testing Interventions Decision Workflow ---")
    interventions = get("/api/interventions")
    assert len(interventions) >= 1
    rev = post("/api/interventions/int_cnc_pilot/review", {"action": "review"})
    assert rev["status"] == "Under Planning Review"
    print(f"[PASS] Interventions OK: '{rev['code']}' updated to '{rev['status']}'")
    # Reset intervention back to clean demo state so DB is not permanently mutated
    reset_rev = post("/api/interventions/int_cnc_pilot/review", {"action": "reset"})
    assert reset_rev["status"] == "Proposed controlled pilot"
    print(f"[PASS] Interventions Clean State Restored: '{reset_rev['code']}' status -> '{reset_rev['status']}'")

    print("\n--- 10. Testing Evidence Explorer & Show Me Why Provenance ---")
    evidence = get("/api/evidence")
    assert len(evidence) >= 23
    print(f"[PASS] Evidence Explorer OK: {len(evidence)} immutable records")

    for key in ["cnc", "pulse", "supply", "emerging", "geography", "alignment", "intervention", "observability", "quality"]:
        chain = get(f"/api/evidence/chain/{key}")
        assert len(chain["steps"]) >= 4
    print("[PASS] All 9 'Show Me Why' audit chains verified with provenance steps")

    print("\n--- 11. Testing Data Quality & Limitations ---")
    quality = get("/api/quality")
    assert quality["confidence_score"] == 0.78
    assert len(quality["visible_limitations"]) >= 3
    print("[PASS] Data Quality OK: Confidence 0.78 with explicit limitations and conflicting observations")

    print("\n--- 12. Testing Global Search ---")
    search_res = get("/api/search?q=cnc")
    assert len(search_res) >= 2
    print(f"[PASS] Global Search OK: {len(search_res)} hits for query 'cnc'")

    print("\n--- 13. Testing Multilingual Skill Intelligence (Section 6.4) ---")
    m1 = post("/api/skills/multilingual-resolve", {"phrase": "Lathe chalavta aala pahije"})
    assert m1["canonical_id"] == "mech_turning"
    assert m1["is_reversible"] is True
    print(f"[PASS] Multilingual OK: '{m1['raw_phrase']}' -> {m1['canonical_name']} ({m1['detected_language']}, conf {m1['confidence_score']})")

    m2 = post("/api/skills/multilingual-resolve", {"phrase": "सीएनसी मशीनिंग ऑपरेटर"})
    assert m2["canonical_id"] == "cnc_programming"
    print(f"[PASS] Multilingual OK: [Devanagari phrase] -> {m2['canonical_name']} ({m2['detected_language']}, conf {m2['confidence_score']})")

    print("\n--- 14. Testing Candidate Guidance Downstream Extension (Section 4.1 & 10) ---")
    cg = get("/api/candidate/guidance")
    assert "profile" in cg
    assert "learning_intelligence" in cg
    assert len(cg["pathways"]) >= 3
    assert len(cg["careers"]) >= 2
    assert len(cg["real_world_problems"]) >= 2
    print(f"[PASS] Candidate Guidance OK: Profile for '{cg['profile']['name']}', {len(cg['pathways'])} pathway steps, {len(cg['careers'])} career pathways")

    print("\n==========================================")
    print("ALL 14 END-TO-END SYSTEM QA CHECKS PASSED!")
    print("==========================================")

if __name__ == "__main__":
    run_tests()
    run_extension_tests()

