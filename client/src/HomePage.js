import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import ResumePage from './ResumePage'; // Ensure this matches your file structure

function Home() {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState({
        resumeFile: null,
        searchFile: null,
    });
    const [modal, setModal] = useState({
        isVisible: false,
        message: '',
    });

    // Function to handle file selection
    const handleFileChange = (event, type) => {
        const file = event.target.files[0]; // Get the selected file
        if (file && file.type === 'application/pdf') {
            setSelectedFiles((prevState) => ({
                ...prevState,
                [type]: file, // Set the selected file
            }));
            setModal({ isVisible: false, message: '' }); // Hide modal if a file is selected
            console.log("Selected file:", file.name);
        } else {
            alert("Please select a valid PDF file."); // Alert if the file is not a PDF
        }
    };

    // Function to remove selected file
    const handleRemoveFile = (type) => {
        setSelectedFiles((prevState) => ({
            ...prevState,
            [type]: null, // Reset the selected file
        }));
        setModal({ isVisible: false, message: '' }); // Hide modal when removing file
    };

    // Function to handle OK button click
    const handleOkClick = (type) => {
        if (!selectedFiles[type]) {
            setModal({
                isVisible: true,
                message: 'Please select a PDF file', // Set modal message
            });
        } else {
            // Implement any further actions on successful file selection here
            console.log(`${type} file selected:`, selectedFiles[type].name);
            setModal({ isVisible: false, message: '' }); // Reset modal if a file is selected
            if (type === 'resumeFile') {
                navigate("/resume-page"); // Navigate to ResumePage
            } else if (type === 'searchFile') {
                navigate("/search-page"); // Navigate to SearchPage (make sure to create this)
            }
        }
    };
    const handleOkClick2 = (type) => {
        
            if (type === 'resumeFile') {
                navigate("/resume-page"); // Navigate to ResumePage
            } else if (type === 'searchFile') {
                navigate("/search-page"); // Navigate to SearchPage (make sure to create this)
            }
        
    };

    // Function to close the modal
    const closeModal = () => {
        setModal({ isVisible: false, message: '' });
    };

    return (
        <div className="App">
            
            <h1>PDF Services</h1>
            <div className="cards-container">
                <div className="card">
                    <h2>Resume PDF</h2>
                    <div className="button-container">
                        <input
                            type="file"
                            accept="application/pdf"
                            
                            id="fileInput1"
                            onChange={(e) => handleFileChange(e, 'resumeFile')}
                            style={{ display: 'none' }} // Hide the file input
                        />
                        <button onClick={() => handleOkClick2('resumeFile')}>GO</button>
                    </div>
                    {selectedFiles.resumeFile && (
                        <div className="file-info">
                            <span>{selectedFiles.resumeFile.name}</span>
                            <button onClick={() => handleRemoveFile('resumeFile')} className="delete-button">❌</button>
                        </div>
                    )}
                </div>
                <div className="card">
                    <h2>Search in PDF</h2>
                    <div className="button-container">
                        <input
                            type="file"
                            accept="application/pdf"
                            id="fileInput2"
                            onChange={(e) => handleFileChange(e, 'searchFile')}
                            style={{ display: 'none' }} // Hide the file input
                        />
                        <button onClick={() => handleOkClick2('searchFile')}>GO</button>
                    </div>
                    {selectedFiles.searchFile && (
                        <div className="file-info">
                            <span>{selectedFiles.searchFile.name}</span>
                            <button onClick={() => handleRemoveFile('searchFile')} className="delete-button">❌</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for displaying messages */}
            {modal.isVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <p>{modal.message}</p>
                    </div>
                </div>
            )}

            <footer>
                <p>Contact info: aissaanu4@gmail.com</p>
            </footer>

            
        </div>
    );
}

export default Home;
