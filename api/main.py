from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # 🔥 Enables frontend-backend connection
from services.osm_fetcher import get_dating_spots
from services.data_processor import process_dating_spots, process_clusters, process_hotspots, process_recommendations

app = FastAPI()

# 🔥 Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to your frontend URL (e.g., http://localhost:3000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/recommendations")
def fetch_recommendations(preferences: str = "cafe,bar,park"):
    """
    API endpoint to get personalized dating recommendations.

    Example:
        http://127.0.0.1:8000/recommendations?preferences=cafe,bar,park
    """
    try:
        user_preferences = preferences.split(",")  # Convert input to list
        osm_data = get_dating_spots()

        if not osm_data:
            raise HTTPException(status_code=404, detail="No dating spots found.")

        recommendations = process_recommendations(osm_data, user_preferences)

        return JSONResponse(content={"recommendations": recommendations})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
