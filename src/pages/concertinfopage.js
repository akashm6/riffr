import React from "react";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import ErrorCard from '../components/errorcard';
import ConcertCard from '../components/concertcard';
import '../components/concertinfopage.css'
function ConcertInfoPage() {
    const { artistName, country } = useParams();
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setConcerts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching concert info:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchConcerts();
    }, [artistName, country]);

    if (loading) return <p>Loading...</p>;
    if (error || concerts.length === 0) return <ErrorCard message='No Upcoming Concerts Found.'></ErrorCard>;

    return (
        <div className="concert-info-container">
            <div className="concerts-list">
                {concerts.map((concert, index) => (
                    <ConcertCard key={index} concert={concert} />
                ))}
            </div>
        </div>
    );
}

export default ConcertInfoPage;
