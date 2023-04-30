import React, { useState, useEffect } from 'react';
import WeatherForm from "./Weather"
import TrackButton from './TrackButton';
import Logout from './Logout'

function Home() {
    const [access_token, setAccessToken] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [city, setCity] = useState(null);

    useEffect(() => {
      fetch('http://localhost:5001/access_token', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
          console.log('access_token response:', data);
          setAccessToken(data.access_token);
        });
    }, []);
  
   useEffect(() => {
      if (access_token && city) {
        console.log('access_token:', access_token);
        console.log('city:', city);
        fetch(`http://localhost:5001/home?access_token=${access_token}&city=${city}`)
          .then(response => response.json())
          .then(data => {
            console.log('data from API:', data);
            if (!data.error) {
              setTracks(data);
            }
          });
      } else {
        console.log("Access token or city is not available yet");
      }
    }, [access_token, city]);
    
    const handleCityChange = (newCity) => {
        setCity(newCity);
    }
  
    return (
      <div>
        <div style={{ textAlign: 'right' }}>
          <Logout />
        </div>
        <WeatherForm access_token={access_token} onCityChange={handleCityChange} />
        {tracks.map(track => (
          <TrackButton key={track.name} track={track} />
          ))}
      </div>
    );
}

export default Home;