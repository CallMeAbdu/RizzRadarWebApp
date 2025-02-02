import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from scipy.spatial import KDTree

def cluster_dating_spots(df, n_clusters=10):
    """
    Applies K-Means clustering to dating spots based on latitude & longitude.

    Args:
        df (pd.DataFrame): Processed DataFrame of date spots.
        n_clusters (int): Number of clusters.

    Returns:
        pd.DataFrame: DataFrame with an additional 'cluster' column.
    """
    if df.empty or "lat" not in df or "lon" not in df:
        return df  # Return unchanged if no valid data

    coords = df[["lat", "lon"]].dropna().values  # Extract coordinates

    print("⚡ Running K-Means Clustering...")  # Debugging

    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    df["cluster"] = kmeans.fit_predict(coords)  # Assign cluster labels

    # Add cluster center coordinates for reference
    df["cluster_center_lat"] = df["cluster"].apply(lambda x: kmeans.cluster_centers_[x][0])
    df["cluster_center_lon"] = df["cluster"].apply(lambda x: kmeans.cluster_centers_[x][1])

    print(f"✅ SUCCESS: Assigned {n_clusters} clusters!")  # Debugging
    return df

def detect_hotspots(df, radius=0.002, top_n=5):
    """
    Identifies the top hotspots using a K-d Tree.

    Args:
        df (pd.DataFrame): Clustered DataFrame.
        radius (float): Search radius in **latitude/longitude degrees**.
        top_n (int): Number of hotspots to return.

    Returns:
        pd.DataFrame: Hotspots with location & density count.
    """
    if df.empty or "lat" not in df or "lon" not in df:
        return df  # Return unchanged if no valid data

    coords = df[["lat", "lon"]].dropna().values  # Extract valid coordinates
    tree = KDTree(coords)  # Build K-d Tree

    print("⚡ Detecting hotspots...")  # Debugging
    densities = [len(tree.query_ball_point(point, r=radius)) for point in coords]

    df["hotspot_density"] = densities  # Add density column

    # Get top N most dense locations
    top_hotspots = df.nlargest(top_n, "hotspot_density")[["lat", "lon", "hotspot_density"]]

    print(f"✅ SUCCESS: Found {top_n} top hotspots!")  # Debugging
    return top_hotspots
