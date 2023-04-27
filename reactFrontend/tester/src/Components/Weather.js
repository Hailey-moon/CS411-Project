import React, { useState } from 'react';
import '../Style/Weather.css';
import '../Style/App.css'

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
        <div className="WeatherContainer">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                        <input
                            type="text"
                            value={city}
                            onChange={event => setCity(event.target.value)}
                            placeholder="Input City Name"
                        />
                    <input className='button' type="submit" value="GET WEATHER" />
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