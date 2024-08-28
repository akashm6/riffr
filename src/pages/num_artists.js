import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../components/num_artists.css';

function NumArtistsPage() {
    const [numArtists, setNumArtists] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/top_artists?num_artists=${numArtists}`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            navigate('/top_artists', { state: { artists: data, numArtists } });
        } catch (error) {
            console.error("There was an error fetching the top artists:", error);
        }
    };
    
    return (
        <div className="num-artists-container">
            <form onSubmit={handleSubmit}>
                <label className='form-label'>
                    How many of your top artists would you like to track? (up to 50)
                    <input 
                        className='artist-input-box' 
                        type="number" 
                        name="number_of_artists" 
                        value={numArtists} 
                        onChange={(e) => setNumArtists(e.target.value)}
                    />
                </label>
                <input className='artist-submit-box' type="submit" value="Submit" />
            </form>
            <footer className="footer">
                Created by <a href="https://github.com/akashm6" target="_blank" rel="noopener noreferrer">Akash Mohan</a>
            </footer>
        </div>
    );
}

export default NumArtistsPage;
