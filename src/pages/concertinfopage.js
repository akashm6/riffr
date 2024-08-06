import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ConcertCard from "../components/concertcard";
import '../components/concertinfopage.css';

function ConcertInfoPage() {
    const { artistName } = useParams();
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConcerts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/concerts?artist_name=${encodeURIComponent(artistName)}`, {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setConcerts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching concert info:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchConcerts();
    }, [artistName]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching concerts: {error.message}</p>;

    return (
        <div className="concert-info-container">
            <h1>Upcoming Concerts for {artistName}</h1>
            {concerts.length === 0 ? (
                <p>No upcoming concerts found.</p>
            ) : (
                <div className="concerts-list">
                    {concerts.map((concert, index) => (
                        <ConcertCard key={index} concert={concert} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ConcertInfoPage;
