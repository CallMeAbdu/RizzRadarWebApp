import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000"; // Your FastAPI server

export const getAllSpots = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recommendations`);
    return response.data.recommendations; // ✅ Get the full dataset
  } catch (error) {
    console.error("Error fetching all spots:", error);
    return [];
  }
};
