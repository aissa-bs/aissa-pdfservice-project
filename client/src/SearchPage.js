// client/src/SearchPage.js
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for HTTP requests

function SearchPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for the search query
    const [searchResults, setSearchResults] = useState(''); // State for storing search results as a string
    const [modal, setModal] = useState({
        isVisible: false,
        message: '',
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file); // Set the selected file
            setModal({ isVisible: false, message: '' }); // Hide modal if a file is selected
        } else {
            alert("Please select a valid PDF file."); // Alert if the file is not a PDF
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null); // Reset the selected file
        setSearchResults(''); // Clear the search results when removing the file
    };

    const handleOkClick = async () => {
        if (!selectedFile || !searchQuery) {
            setModal({
                isVisible: true,
                message: 'Please select a PDF file and enter a search query.', // Set modal message
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile); // Append the file to FormData
        formData.append('query', searchQuery); // Append the search query

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/search', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type
                },
            });
            // Format the search results for display in a text area
            const resultsText = response.data.results.map((result) => `Page ${result.page}: ${result.context}`).join('\n');
            setSearchResults(resultsText); // Set the search results
        } catch (error) {
            console.error("Error during PDF search:", error);
            setModal({
                isVisible: true,
                message: 'Error searching the PDF',
            });
        }
    };

    const closeModal = () => {
        setModal({ isVisible: false, message: '' });
    };

    return (
        <div>
            <h2>Search in PDF</h2>
            <p>This is where you can search in your PDF.</p>
            <div className="cards-container">
                <div className="card">
                    <h2>Search in PDF</h2>
                    <input
                        type="text"
                        placeholder="Enter search text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Update the search query state
                    />
                    <div className="button-container">
                        <input
                            type="file"
                            accept="application/pdf"
                            id="fileInput2"
                            onChange={handleFileChange}
                            style={{ display: 'none' }} // Hide the file input
                        />
                        <button onClick={() => document.getElementById('fileInput2').click()}>Select PDF File</button>
                        <button onClick={handleOkClick}>OK</button>
                    </div>
                    {selectedFile && (
                        <div className="file-info" style={{ marginTop: '0.1px' }}>
                            <span>{selectedFile.name}</span>
                            <button onClick={handleRemoveFile} className="delete-button">❌</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add space between card and results */}
            <div style={{ marginTop: '90px' }}>
                <h3>Search Results:</h3>
                <textarea
                    readOnly
                    rows={10}
                    style={{ width: '100%', marginTop: '10px' }}
                    value={searchResults} // Set the value to the search results
                />
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
        </div>
    );
}

export default SearchPage;
