import React, { useState, useEffect, useRef } from "react";
import Recommendations from "./components/Recommendations";
import MapSelector from "./components/MapSelector";
import MontrealMap from "./components/MontrealMap";
import { getAllSpots } from "./services/api"; 

function App() {
  const mapRef = useRef(null);
  const [preferences, setPreferences] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(5000); 
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [allSpots, setAllSpots] = useState([]); 

  // Fetch all spots when the app loads
  useEffect(() => {
    const fetchAllSpots = async () => {
      try {
        const spots = await getAllSpots();
        setAllSpots(spots);
        setFilteredSpots(spots);
      } catch (error) {
        console.error("Error fetching all spots:", error);
      }
    };
    fetchAllSpots();
  }, []);

  // Confirm preferences: Filter spots (no new API call)
  const handleConfirmPreferences = (chosenPreferences) => {
    setPreferences(chosenPreferences);
    filterData(selectedLocation, radius, chosenPreferences);
    document.getElementById("area2").scrollIntoView({ behavior: "smooth" });
  };

  // Confirm location: Filter existing data
  const handleConfirmLocation = (location, radius) => {
    setSelectedLocation(location);
    setRadius(radius);
    filterData(location, radius, preferences);
    document.getElementById("area3").scrollIntoView({ behavior: "smooth" });
  };

  // **Filter preloaded spots instead of making an API call**
  const filterData = (location, radius, preferences) => {
    if (!location) return;
    
    const filtered = allSpots.filter((spot) => {
      const distance = getDistance(location.lat, location.lng, spot.lat, spot.lon);
      return (
        distance <= radius / 1000 && // Convert radius to km
        (preferences.length === 0 || preferences.includes(spot.type))
      );
    });

    setFilteredSpots(filtered);
  };

  // Helper function: Calculate distance between two lat/lon points
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return (
    <div style={{ textAlign: "center" }}>
      {/* Area 1 - Preferences Selection */}
      <div id="area1" style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1>RizzRadar - Find Your Perfect Date Spot</h1>
        <Recommendations onConfirm={handleConfirmPreferences} />
      </div>

      {/* Area 2 - Map for Location Selection */}
      <div id="area2" style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <MapSelector onConfirm={handleConfirmLocation} allSpots={allSpots} setFilteredSpots={setFilteredSpots} />
      </div>

      {/* Area 3 - Filtered Map Results */}
      <div id="area3" style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <MontrealMap spots={filteredSpots} selectedLocation={selectedLocation} radius={radius} />
      </div>
    </div>
  );
}

export default App;
