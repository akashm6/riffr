import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CountryCard from "../components/countrycard";
import '../components/available_countries.css';
import LoadingSpinner from "../components/loading";
import BackButton from '../components/backbutton';

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

    if (loading) return <LoadingSpinner />;

    return (
        <div className="available-countries-container">
            <h1 className='country-header'>Available Countries for {artistName} Concerts</h1>
            <div className="countries-list">
                {countries.map((country, index) => (
                    <CountryCard 
                        key={index} 
                        country={country.country_name} 
                        onClick={() => history(`/concerts/${artistName}/${country.country_code}`)} 
                    />
                ))}
            </div>
            <BackButton />
        </div>
    );
}

export default AvailableCountriesPage;
