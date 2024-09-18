import React from "react";
import '../components/about.css';
import { Link } from "react-router-dom";

function AboutPage() {
    return (
        <div className="about-container">
            <h1 className="about-title">what's riffr?</h1>
            <p className="about-description">
                riffr makes keeping up with your favorite musicians easier and more centralized
                than ever. Concert finding can be a hassle, so riffr strives to make it as simple 
                as possible.
            </p>
            <p className="about-description">
                Sign in with Spotify, type in a number, and view concert information for all of your
                top listened artists, in every possible country, all in one place. 
            </p>
            <p className="about-description">
                Find ticket links, up-to-date venue locations, concert times, and more. 
                Unsure about the surrounding area of the venue? Explore satellite views of the area.
            </p>
            <p className = 'about-description'>
                With riffr, you can experience a new level of simplicity, designed to get you tickets
                to your favorite concerts in the least clicks possible.
            </p>
            <p className="about-description">
                My name is Akash Mohan, and I'm currently a Computer Science and Data Science student
                at the University of Wisconsin-Madison. Here's some other <a href="https://github.com/akashm6" target="_blank" rel="noopener noreferrer">things</a> I've worked on.
            </p>

            <Link to = '../' className="back-to-home-button">go back</Link>

        </div>
    );
}

export default AboutPage;
