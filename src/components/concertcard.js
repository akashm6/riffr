import React from "react";
import '../components/concertcard.css';

function ConcertCard({ concert }) {

    return (
        <div className="concert-card">
            <h3>{concert.title || "No Title Available"}</h3>
            <p><strong>Venue:</strong> {concert.venue_name}</p>
            <p><strong>Address:</strong> {concert.address || "Address not specified"}</p>
            <p><strong>Date:</strong> {concert.date}</p> 
            <p><strong>City:</strong> {concert.city}</p> 
            <p><strong>Time:</strong> {concert.time}</p> 
            <a href={concert.ticket_link} target="_blank" rel="noopener noreferrer" className="buy-more-link">Buy Tickets</a>
        </div>
    );
}

export default ConcertCard;
