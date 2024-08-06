import React from "react";
import '../components/concertcard.css';

function ConcertCard({ concert }) {
    const localDate = new Date(concert.date).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    

    return (
        <div className="concert-card">
            <h3>{concert.title || "No Title Available"}</h3>
            <p><strong>Venue:</strong> {concert.venue_name}</p>
            <p><strong>Address:</strong> {concert.address || "Address not specified"}</p>
            <p><strong>Date:</strong> {localDate}</p> 
            <a href={concert.url} target="_blank" rel="noopener noreferrer" className="more-info-link">More Info</a>
        </div>
    );
}

export default ConcertCard;
