import React from "react";
import '../components/about.css';
import { Link } from "react-router-dom";

function AboutPage() {
    return (
        <div className="about-container">
            <h1 className="about-title">What's Riff Notif?</h1>
            <p className="about-description">
                Riff Notif makes keeping up with your favorite musicians easier and more centralized
                than ever. Concert finding can be a hassle, so Riff Notif strives to make it as simple 
                as possible.
            </p>
            <p className="about-description">
                Sign in with Spotify, type in a number, and see concert information for all of your
                top listened artists, all in one place. 
            </p>
            <p className="about-description">
                With up-to-date venue locations, concert times, and even Google Map support, 
                Riff Notif is the gateway for a simple, streamlined way to get tickets to your
                favorite concerts.
            </p>
            <p className="about-description">
                My name is Akash Mohan, and I'm currently a Computer Science and Data Science student
                at the University of Wisconsin-Madison. Here's some other <a href="https://github.com/akashm6" target="_blank" rel="noopener noreferrer">things</a> I've worked on.
            </p>

            <Link to = '/' className="back-to-home-button">Back to Home</Link>

        </div>
    );
}

export default AboutPage;
