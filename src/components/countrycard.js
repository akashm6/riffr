import React from 'react';
import './countrycard.css';

function CountryCard({ country, onClick }) {
    return (
        <div className="country-card" onClick={onClick}>
            <h2>{country}</h2>
        </div>
    );
}

export default CountryCard;
