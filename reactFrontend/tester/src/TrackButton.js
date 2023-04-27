import React from 'react';
import './TrackButton.css';

function TrackButton({ track }) {
  const handleClick = () => {
    window.open(track.external_url);
  };

  return (
    <div className="container" onClick={handleClick}>
      <img src={track.album_cover_url} alt={track.name + " album cover"} className="album-cover" />
      <div className="track-info">
        <div className="track-name">{track.name}</div>
        <div className="artist-name">{track.artist}</div>
      </div>
    </div>
  );
}

export default TrackButton;
