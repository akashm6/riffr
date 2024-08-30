import React from "react";
import { useNavigate } from "react-router-dom";
import './backbutton.css';

function BackButton() {

    const navigate = useNavigate();

    return (
        <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
    )
}

export default BackButton;