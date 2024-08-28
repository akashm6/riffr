import React from "react";
import { useNavigate } from "react-router-dom";
import '../components/errorcard.css';

function ErrorCard({ message }) {
    const navigate = useNavigate();

    return (
        <div className="error-card">
            <h1 className="message">{message}</h1>
            <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
}

export default ErrorCard;
