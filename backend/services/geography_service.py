"""
Labour Market Geography & Spatial Service
"""

from typing import List, Dict, Any
from backend.database.db import query_all, query_one, haversine_distance
from backend.models.schemas import GeographyOut, DistrictOut, CorridorOut

def get_geography_data() -> GeographyOut:
    districts_rows = query_all("SELECT * FROM districts")
    corridors_rows = query_all("SELECT * FROM labour_corridors")
    centres = query_all("SELECT id, name, district_id, latitude, longitude, usable_capacity_pct FROM training_centres")
    employers = query_all("SELECT id, name, sector, district_id, cluster_name, latitude, longitude, verified_openings FROM employers")
    
    districts = [
        DistrictOut(
            id=d["id"],
            name=d["name"],
            state=d["state"],
            latitude=d["latitude"],
            longitude=d["longitude"],
            demand_signal=d["demand_signal"],
            advanced_capacity_pct=d["advanced_capacity_pct"],
            six_month_outcome_pct=d["six_month_outcome_pct"],
            market_observability=d["market_observability"],
            centres_count=d["centres_count"],
            detail=d["detail"],
            boundary_geojson=d.get("boundary_geojson")
        )
        for d in districts_rows
    ]
    
    corridors = [
        CorridorOut(
            id=c["id"],
            name=c["corridor_name"],
            from_district=c["from_district_id"],
            to_district=c["to_district_id"],
            dynamic_type=c["dynamic_type"],
            flow_level=c["candidate_flow_level"],
            notes=c["notes"]
        )
        for c in corridors_rows
    ]
    
    return GeographyOut(
        districts=districts,
        corridors=corridors,
        training_centres=centres,
        employers=employers
    )

def get_district_detail(district_id: str) -> Dict[str, Any]:
    district = query_one("SELECT * FROM districts WHERE id = ? OR name = ?", (district_id.lower(), district_id))
    if not district:
        district = query_one("SELECT * FROM districts WHERE id = 'pune'")
    
    # Fetch linked centres, employers, corridors
    centres = query_all("SELECT * FROM training_centres WHERE district_id = ?", (district["id"],))
    employers = query_all("SELECT * FROM employers WHERE district_id = ?", (district["id"],))
    corridors = query_all("SELECT * FROM labour_corridors WHERE from_district_id = ? OR to_district_id = ?", (district["id"], district["id"]))
    
    return {
        "district": dict(district),
        "training_centres": centres,
        "employers": employers,
        "corridors": corridors
    }
