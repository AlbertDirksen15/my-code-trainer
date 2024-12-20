const API_BASE_URL = "http://localhost:5067";

export const fetchWeatherData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/weatherforecast`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};