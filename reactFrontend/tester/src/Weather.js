import React, { useState } from 'react';
import './Weather.css';

const WeatherForm = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`http://localhost:5001/get-weather/${city}`);
        const data = await response.json();
        setWeatherData(data);
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                        <input
                            type="text"
                            value={city}
                            onChange={event => setCity(event.target.value)}
                            placeholder="Input City Name"
                        />
                    <input type="submit" value="Get Weather" />
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
}

export default WeatherForm;