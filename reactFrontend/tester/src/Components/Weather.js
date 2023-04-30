import React, { useState } from "react";
import "../Style/Weather.css";
import "../Style/App.css";


const WeatherForm = ({ access_token, onCityChange }) => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const weatherResponse = await fetch(
        `http://localhost:5001/get-weather/${city}`
      );
      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
  
      if (access_token) {
        const recommendationsResponse = await fetch(
          `http://localhost:5001/get-recommendations/${city}?access_token=${access_token}`
        );
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData);
      }
    };
  
    return (
      <div className="WeatherContainer">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Input City Name"
            />
            <input className="button" type="submit" value="GET SONGS" />
          </div>
        </form>
        {weatherData && (
          <div className="weather-data">
            <h2>Weather in {weatherData.name}</h2>
            <p>Temperature: {weatherData.main.temp} °C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind: {weatherData.wind.speed} m/s</p>
          </div>
        )}
        {recommendations && (
          <div className="recommendations">
            <h2>Song recommendations based on the weather in {city}</h2>
            <ul>
              {recommendations.tracks.map((track) => (
                <li key={track.id}>
                  {track.name} by {track.artists[0].name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  export default WeatherForm;
  