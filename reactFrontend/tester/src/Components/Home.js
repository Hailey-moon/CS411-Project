import React, { useState, useEffect } from 'react';
import WeatherForm from './Weather';
import TrackButton from './TrackButton';
import Logout from './Logout';
import '../Style/Home.css';

function Home() {
  const [access_token, setAccessToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/access_token', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        setAccessToken(data.access_token);
      });
  }, []);

  useEffect(() => {
    if (access_token && city) {
      fetch(`http://localhost:5001/home?access_token=${access_token}&city=${city}`)
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            setTracks(data);
          }
        });

      fetch(`http://localhost:5001/get-weather/${city}`)
        .then(response => response.json())
        .then(data => {
          setWeatherData(data);
        });
    }
  }, [access_token, city]);

  const handleCityChange = (newCity) => {
    setCity(newCity);
  };

  return (
    <div>
      <div className='LogoutButton'>
        <Logout />
      </div>
      <WeatherForm
        onCityChange={handleCityChange}
        weatherData={weatherData}
        access_token={access_token}
      />
      <div className='allTracksContainer'>
        {tracks.map((track) => (
          <TrackButton key={track.name} track={track} />
        ))}
      </div>
    </div>
  );
}

export default Home;
