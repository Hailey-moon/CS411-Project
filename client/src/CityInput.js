import React, { useState } from "react";
import { fetchWeatherData } from "./utils";

function CityInput() {
  // Define a state variable to hold the user input
  const [city, setCity] = useState("");
  // Define a state variable to hold the weather data
  const [weatherData, setWeatherData] = useState(null);
  // Define a state variable to hold any error messages
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the fetchWeatherData function with the user input
      const data = await fetchWeatherData(city);
      // Update the weatherData state variable with the response from the API
      setWeatherData(data);
      // Clear the input field
      setCity("");
      // Clear any error messages
      setError(null);
    } catch (err) {
      // If there is an error, update the error state variable
      setError(err.message);
      // Clear the weatherData state variable
      setWeatherData(null);
    }
  };

  return (
    <div>
      {/* Render any error messages */}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {/* Render the weather data if it is available */}
      {weatherData && (
        <div>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Humidity: {weatherData.main.humidity} %</p>
        </div>
      )}
    </div>
  );
}

export default CityInput;
