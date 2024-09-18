import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './artistcard.css';

function ArtistCard({ artist }) {
    const navigate = useNavigate(); 

    const handleConcertInfoClick = () => {
        navigate(`/available-countries/${encodeURIComponent(artist.name)}`); 
    };

    return (
        <div className="artist-card">
            <img src={artist.image} alt={artist.name} className="artist-image" />
            <div className="artist-info">
                <h2>{artist.name}</h2>
                <p>Followers: {artist.followers}</p>
                <p>Genres: {artist.genres.join(', ')}</p>
            </div>
            <div className="button-container">
                <a href={artist.url} target="_blank" rel="noopener noreferrer" className="spotify-link">Listen on Spotify</a>
                <button className="concert-info-button" onClick={handleConcertInfoClick}>Concert Info</button>
            </div>
        </div>
    );
}

export default ArtistCard;
