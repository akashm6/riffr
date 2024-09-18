import React, { useEffect, useState } from "react";
import ArtistCard from "../components/artistcard";
import '../components/top_artists.css';
import { useLocation, useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";

function TopArtistsPage() {
    const [artists, setArtists] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    const numArtists = location.state?.numArtists || 10; 

    useEffect(() => {
        const fetchArtists = async () => {
            const response = await fetch(`http://localhost:5000/top_artists?num_artists=${numArtists}`, {
                grant_type: 'client_credentials',
                credentials: 'include'
            });
            if (!response.ok) {
                console.error("Failed to fetch artists");
                return;
            }
            const data = await response.json();
            setArtists(data);
        };

        fetchArtists();
    }, [numArtists]);

    return (
        <div className="top-artists-container">
            {artists.map((artist, index) => (
                <ArtistCard key={index} artist={artist} />
            ))}
            <Link className = 'back-to-home-button' onClick = {() => navigate(-1)}>Go Back</Link>
        </div>
    );
}

export default TopArtistsPage;
