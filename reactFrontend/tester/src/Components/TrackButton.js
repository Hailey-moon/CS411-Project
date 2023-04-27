import React from 'react';
import '../Style/TrackButton.css';

function TrackButton({ track }) {
  const handleClick = () => {
    window.open(track.external_url);
  };

  return (
    <div className="track-container" onClick={handleClick}>
      <img className="album-cover" src={track.album_cover_url} alt={track.name + " album cover"} />
      <div className="track-info">
        <div className="track-name">{track.name}</div>
        <div className="artist-name">{track.artist}</div>
      </div>
    </div>
  );
}

export default TrackButton;
