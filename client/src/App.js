import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ResumePage from './ResumePage'; 
import ContactPage from './ContactPage';
import Home from './HomePage';
import SearchPage from './SearchPage';
import AboutPage from './AboutPage';

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set a timeout to stop loading after 1 minute (60000 ms)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 20000);

        // Clear the timeout if the component unmounts before it fires
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="App">
            {loading ? (
                <div className="loading">
                    <h1>Welcome To PDF Servora</h1>
                    <p>The App is Running ...</p>
                    <p>Loading... Please wait.</p>
                    <div className="spinner"></div> {/* Your loading spinner */}
                </div>
            ) : (
                <>
                    <header className="header">
                        <nav>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                        </nav>
                    </header>

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/resume-page" element={<ResumePage />} />
                        <Route path="/search-page" element={<SearchPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </>
            )}
        </div>
    );
}

export default App;
