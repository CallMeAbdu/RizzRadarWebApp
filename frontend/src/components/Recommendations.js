import React, { useState } from "react";

const PREFERENCES_LIST = [
  "restaurant", "bar", "pub", "nightclub", "cafe", "ice_cream", "sports_centre", 
  "bowling_alley", "ice_rink", "park", "garden", 
  "escape_game", "amusement_arcade", "cinema", "theatre", "karaoke_box", "museum", "attraction", "viewpoint", 
  "artwork", "chocolate", "confectionery"
];

const Recommendations = ({ onConfirm }) => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const togglePreference = (preference) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  return (
    <div>
      <h2>Select Your Preferences</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        {PREFERENCES_LIST.map(pref => (
          <button
            key={pref}
            onClick={() => togglePreference(pref)}
            style={{
              padding: "10px 15px",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: selectedPreferences.includes(pref) ? "#4CAF50" : "#ddd",
              color: selectedPreferences.includes(pref) ? "white" : "black",
              transition: "background 0.3s",
            }}
          >
            {pref.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <button
        onClick={() => onConfirm(selectedPreferences)}
        disabled={selectedPreferences.length === 0}
        style={{
            backgroundColor: selectedPreferences.length > 0 ? "#4CAF50" : "#ccc",
            padding: "10px",
            border: "none",
            color: "#fff",
            cursor: selectedPreferences.length > 0 ? "pointer" : "not-allowed",
            marginTop: "20px",
    opacity: selectedPreferences.length > 0 ? 1 : 0.6,
  }}
>
  Confirm Selection
</button>

    </div>
  );
};

export default Recommendations;