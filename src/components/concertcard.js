import React, { useState } from "react";
import '../components/concertcard.css';

function ConcertCard({ concert }) {
    const [isMapVisible, setMapVisible] = useState(false);

    const handleMapToggle = () => {
        setMapVisible(!isMapVisible);
    };

    const getMapUrl = () => {
        const address = encodeURIComponent(concert.address);
        const maps_key = encodeURIComponent(concert.maps_key)
        return `https://www.google.com/maps/embed/v1/place?key=${maps_key}&q=${address}`;
    };

    return (
        <div className="concert-card">
            <h3>{concert.title || "No Title Available"}</h3>
            <p><strong>Venue:</strong> {concert.venue_name}</p>
            <p><strong>Address:</strong> {concert.address || "Address not specified"}</p>
            <p><strong>Date:</strong> {concert.date}</p> 
            <p><strong>City:</strong> {concert.city}</p> 
            <p><strong>Time:</strong> {concert.time}</p> 
            <a href={concert.ticket_link} target="_blank" rel="noopener noreferrer" className="buy-ticket-button">Buy Tickets</a>
            <button onClick={handleMapToggle} className="show-map-button">
                {isMapVisible ? "Hide Map" : "Show Map"}
            </button>

            {isMapVisible && (
                <div className="map-popup">
                    <iframe className = 'map-frame'
                        title="Concert Venue Map"
                        src={getMapUrl()}
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            )}
        </div>
    );
}

export default ConcertCard;
