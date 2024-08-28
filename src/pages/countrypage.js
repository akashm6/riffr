import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CountryCard from "../components/countrycard";
import '../components/available_countries.css';

function AvailableCountriesPage() {
    const { artistName } = useParams();
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/available-countries?artistName=${encodeURIComponent(artistName)}`);
                const data = await response.json();
                console.log(data)
                setCountries(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching available countries:", error);
                setLoading(false);
            }
        };

        fetchCountries();
    }, [artistName]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="available-countries-container">
            <h1>Select a Country for {artistName} Concerts</h1>
            <div className="countries-list">
                {countries.map((country, index) => (
                    <CountryCard 
                        key={index} 
                        country={country} 
                        onClick={() => history(`/concerts/${artistName}/${country}`)} 
                    />
                ))}
            </div>
        </div>
    );
}

export default AvailableCountriesPage;
