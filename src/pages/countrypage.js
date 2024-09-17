import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CountryCard from "../components/countrycard";
import '../components/available_countries.css';
import LoadingSpinner from "../components/loading";
import BackButton from '../components/backbutton';
import ErrorCard from "../components/errorcard";

function AvailableCountriesPage() {
    const { artistName } = useParams();
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/available-countries?artistName=${encodeURIComponent(artistName)}`);
                const data = await response.json();

                if (data.no_concerts) {
                    setError(true);
                
                } else {
                    setErrorMessage(`${artistName} does not have any upcoming concerts!`)
                    setCountries(data);
                }

                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };

        fetchCountries();
    }, [artistName]);

    if (loading) return <LoadingSpinner />;
    
    if (error || countries.length === 0) return <ErrorCard message={errorMessage} />;

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
