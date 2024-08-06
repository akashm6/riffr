import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './artistcard.css';

function ArtistCard({ artist }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listeningStats, setListeningStats] = useState(null);
    const navigate = useNavigate(); 

    const handleStatsClick = async () => {
        
        const response = await fetch(`http://localhost:5000/listening_stats?artist=${artist.name}`, {
            credentials: 'include',
        });
        const data = await response.json();
        setListeningStats(data);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setListeningStats(null);
    };

    const handleConcertInfoClick = () => {
        navigate(`/concerts/${encodeURIComponent(artist.name)}`); 
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
