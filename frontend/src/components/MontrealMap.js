import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
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

const MontrealMap = ({ spots = [], selectedLocation, radius }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>Filtered Results</h2>
      {spots.length === 0 && (
        <p style={{ color: "red", marginTop: "10px" }}>No spots found. Try adjusting your preferences or location.</p>
      )}

      <MapContainer 
        center={[45.5017, -73.5673]} 
        zoom={12} 
        style={{ width: "80%", height: "60vh", margin: "0 auto" }} // ✅ Centering fix
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {selectedLocation && <Circle center={selectedLocation} radius={radius} fillOpacity={0.2} color="red" />}

        {spots.map((spot, index) => (
          <Marker key={index} position={[spot.lat, spot.lon]} icon={customMarker}>
            <Popup>
              <strong>{spot.name}</strong> - {spot.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MontrealMap;
