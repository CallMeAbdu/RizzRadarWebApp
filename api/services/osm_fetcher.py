import requests

OVERPASS_URL = "http://overpass-api.de/api/interpreter"

def get_dating_spots(city="Montréal"):
    """Fetches all relevant dating locations from OpenStreetMap."""
    query = f"""
    [out:json][timeout:60];
    area[name="{city}"]->.searchArea;
    (
      // Food, Drinks, and Nightlife
      node["amenity"~"restaurant|bar|pub|nightclub|cafe|wine_bar|lounge|cocktail_bar|ice_cream|bistro"](area.searchArea);
      
      // Sports & Leisure
      node["leisure"~"sports_centre|stadium|bowling_alley|ice_rink|park|garden|beach|spa|rooftop|escape_game|amusement_arcade"](area.searchArea);
      
      // Entertainment
      node["amenity"~"cinema|theatre|concert_hall|music_venue|karaoke_box"](area.searchArea);
      
      // Tourist Attractions
      node["tourism"~"museum|attraction|viewpoint|artwork"](area.searchArea);
      
      // Unique Shopping
      node["shop"~"marketplace|chocolate|confectionery|gallery|craft"](area.searchArea);
    );
    out body;
    """
    
    print("🔍 DEBUG: Sending request to Overpass API...")  # Debugging
    response = requests.get(OVERPASS_URL, params={'data': query})
    
    print(f"🔍 DEBUG: Response Status Code: {response.status_code}")  # Check response status

    if response.status_code == 200:
        data = response.json().get("elements", [])
        print(f"✅ SUCCESS: Received {len(data)} elements from OSM!")  # Debugging
        print("🔍 DEBUG: First 5 Results:", data[:5])  # Print sample data
        return data
    else:
        print(f"❌ ERROR: Failed to fetch data! Status: {response.status_code}")
        print("🔍 DEBUG: Response Content:", response.text)
        return []

if __name__ == "__main__":
    spots = get_dating_spots()
    print(f"\n🔍 FINAL DEBUG: Retrieved {len(spots)} spots!\n")
