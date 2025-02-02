import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix missing default Leaflet markers
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customMarker = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapSelector = ({ onConfirm, allSpots, setFilteredSpots }) => {
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(5000); 

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
      },
    });
    return location ? <Marker position={location} icon={customMarker} /> : null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <MapContainer 
        center={[45.5017, -73.5673]} 
        zoom={12} 
        style={{ width: "80%", height: "60vh", margin: "0 auto" }} // ✅ Centering fix
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
        {location && <Circle center={location} radius={radius} fillOpacity={0.3} />}
      </MapContainer>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <input 
          type="range" 
          min="1000" 
          max="10000" 
          step="500" 
          value={radius} 
          onChange={(e) => setRadius(parseInt(e.target.value))} 
        />
      </div>

      <button 
        onClick={() => onConfirm(location, radius)}
        style={{ marginTop: "10px", padding: "10px 15px", background: "#4CAF50", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default MapSelector;
