import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ErrorCard from '../components/errorcard';
import ConcertCard from '../components/concertcard';
import '../components/concertinfopage.css';
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/loading";

function ConcertInfoPage() {
    const { artistName, country } = useParams();
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConcerts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/concerts?artistName=${encodeURIComponent(artistName)}&country=${encodeURIComponent(country)}`, {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const sortedConcerts = data.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB; 
                });

                setConcerts(sortedConcerts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching concert info:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchConcerts();
    }, [artistName, country]);

    if (loading) return <LoadingSpinner />;
    if (error || concerts.length === 0) return <ErrorCard message='The previous listings for this country have either been cancelled, or the listings have expired. Please check the Ticketmaster website or contact the venue for more information!' />;

    return (
        <div className="concert-info-container">
            <div className="concerts-list">
                {concerts.map((concert, index) => (
                    <ConcertCard key={index} concert={concert} />
                ))}
            </div>
            <Link className = 'back-to-home-button' onClick = {() => navigate(-1)}>Go Back</Link>
            
        </div>
    );
}

export default ConcertInfoPage;
