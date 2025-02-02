import pandas as pd
from services.osm_fetcher import get_dating_spots
from services.ml_models import cluster_dating_spots, detect_hotspots  # Import clustering & hotspots

def process_dating_spots(osm_data):
    """
    Converts OSM dating spots data into a structured Pandas DataFrame.

    Args:
        osm_data (list): List of places from OSM API.

    Returns:
        pd.DataFrame: Processed DataFrame with structured information.
    """
    processed = []
    
    for place in osm_data:
        tags = place.get("tags", {})
        lat = place.get("lat", None)
        lon = place.get("lon", None)

        processed.append({
            "name": tags.get("name", "Unnamed"),
            "type": tags.get("amenity", tags.get("leisure", tags.get("tourism", tags.get("shop", "Unknown")))),
            "lat": lat,
            "lon": lon,
            "cuisine": tags.get("cuisine", "N/A"),
        })

    df = pd.DataFrame(processed)
    df = df.dropna(subset=["lat", "lon"])  # Ensure valid coordinates

    return df

def process_clusters(df, n_clusters=10):
    """
    Applies K-Means clustering to dating spots **separately**.

    Args:
        df (pd.DataFrame): DataFrame of date spots.
        n_clusters (int): Number of clusters.

    Returns:
        pd.DataFrame: Clustered DataFrame.
    """
    return cluster_dating_spots(df, n_clusters)

def process_hotspots(df, radius=0.002, top_n=5):
    """
    Identifies the top hotspots using **K-d Tree**.

    Args:
        df (pd.DataFrame): Clustered DataFrame.
        radius (float): Search radius in **latitude/longitude degrees**.
        top_n (int): Number of hotspots to return.

    Returns:
        pd.DataFrame: Hotspots with location & density count.
    """
    return detect_hotspots(df, radius, top_n)

def process_recommendations(osm_data, preferences):
    """
    Filters dating spots based on user preferences.

    Args:
        osm_data (list): List of places from OSM API.
        preferences (list): List of preferred place types.

    Returns:
        list: Filtered list of recommended spots.
    """
    recommended = []

    for place in osm_data:
        tags = place.get("tags", {})
        place_type = tags.get("amenity", tags.get("leisure", tags.get("tourism", tags.get("shop", "Unknown"))))

        if place_type in preferences:  # Only keep places that match user preferences
            recommended.append({
                "name": tags.get("name", "Unnamed"),
                "type": place_type,
                "lat": place.get("lat"),
                "lon": place.get("lon"),
                "cuisine": tags.get("cuisine", "N/A"),
            })

    return recommended

