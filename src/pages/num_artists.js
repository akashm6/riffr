import React from "react";
import '../components/num_artists.css';

function NumArtistsPage() {
    return (
        <div className="num-artists-container">
            <form>
                <label className='form-label'>
                    How many of your top artists would you like to track?
                    <input className='artist-input-box' type="number" name="number of artists" />
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
