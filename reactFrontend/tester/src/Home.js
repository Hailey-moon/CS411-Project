import React, { useState, useEffect } from 'react';
import WeatherForm from "./Weather"
import TrackButton from './TrackButton';

function Home() {
    const [access_token, setAccessToken] = useState(null);
    const [tracks, setTracks] = useState([]);
  
    useEffect(() => {
      fetch('http://localhost:5001/access_token', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
          console.log('access_token response:', data);
          setAccessToken(data.access_token);
        });
    }, []);
  
    useEffect(() => {
      if (access_token) {
        console.log('access_token:', access_token);
        fetch(`http://localhost:5001/home?access_token=${access_token}`)
          .then(response => response.json())
          .then(data => {
            console.log('data from API:', data);
            if (!data.error) {
              setTracks(data);
            }
          });
      } else {
        console.log("Access token is not available yet");
      }
    }, [access_token]);
    
  
    return (
      <div>
        <WeatherForm />
        {tracks.map(track => (
          <TrackButton key={track.name} track={track} />
          ))}
      </div>
    );
  }
  
  export default Home;