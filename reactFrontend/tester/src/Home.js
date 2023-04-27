import React, { useState, useEffect } from 'react';

function TrackButton({ track }) {
  const handleClick = () => {
    window.open(track.external_url);
  };

  return (
    <button onClick={handleClick} style={{ width: '100px', height: '100px' }}>
      {track.name}
    </button>
  );
}

function Home() {
    const [access_token, setAccessToken] = useState(null);
    const [tracks, setTracks] = useState([]);
  
    useEffect(() => {
      fetch('http://localhost:5001/access_token')
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
          .then(data => setTracks(data));
      }
    }, [access_token]);
  
    return (
      <div>
        {tracks.map(track => (
          <TrackButton key={track.name} track={track} />
        ))}
      </div>
    );
  }
  
  export default Home;