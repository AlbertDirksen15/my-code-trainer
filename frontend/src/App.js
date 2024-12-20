import React, { useEffect, useState } from "react";
import { fetchWeatherData } from "./api";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData()
      .then((data) => setData(data))
      .catch((error) => setError(error));
  }, []);

  if (error) return <div>Error: {error.message}</div>;
  if (!data.length) return <div>Loading...</div>;

  return (
    <div>
      <h1>Weather Data</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.date}: {item.temperatureC}°C ({item.summary})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
