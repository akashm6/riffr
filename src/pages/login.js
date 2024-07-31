import React from "react";
import '../components/login.css'; 

function LoginPage() {
    const handleLogin = () => {
        window.location.href = 'http://localhost:5000/'; 
    };

    return (
        <div className="login-container">
            <h1 className="animated-title">Riff Notif</h1>
            <button className="login-button" onClick={handleLogin}>
                Sign in with Spotify
            </button>
            <footer className="footer">
                <p>
                    Created by <a href="https://github.com/akashm6" target="_blank" rel="noopener noreferrer">Akash Mohan</a>
                </p>
            </footer>
        </div>
    );
}

export default LoginPage;
