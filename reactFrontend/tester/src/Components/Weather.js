// Weather.js
import React, { useState } from 'react';
import '../Style/Weather.css';
import '../Style/App.css';

const WeatherForm = ({ access_token, onCityChange, weatherData }) => {
  const [city, setCity] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    onCityChange(city);
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
    </div>
  );
};

export default WeatherForm;
