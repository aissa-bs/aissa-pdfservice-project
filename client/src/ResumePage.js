// client/src/ResumePage.js

import React, { useState } from 'react';
import axios from 'axios';

function ResumePage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [selectedOption, setSelectedOption] = useState(''); // State for dropdown selection
    const [loading, setLoading] = useState(false); // Loading state
    const [modal, setModal] = useState({
        isVisible: false,
        message: '',
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setModal({ isVisible: false, message: '' });
        } else {
            alert("Please select a valid PDF file.");
        }
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleOkClick = async () => {
        if (!selectedFile) {
            setModal({
                isVisible: true,
                message: 'Please select a PDF file',
            });
            return;
        }

        if (selectedOption === 'inHouse') {
            await summarizeInHouse();
        } else if (selectedOption === 'openAI') {
            await summarizeWithOpenAI();
        } else {
            setModal({
                isVisible: true,
                message: 'Please select a summarization method',
            });
        }
    };

    const summarizeInHouse = async () => {
        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/summarize', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSummary(response.data.summary);
        } catch (error) {
            console.error("Error during in-house summarization:", error);
            setModal({
                isVisible: true,
                message: 'Error summarizing the PDF',
            });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const summarizeWithOpenAI = async () => {
        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/summarize_openai', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSummary(response.data.summary);
        } catch (error) {
            console.error("Error during OpenAI summarization:", error);
            setModal({
                isVisible: true,
                message: 'Error summarizing the PDF with OpenAI',
            });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setSummary('');
    };

    const closeModal = () => {
        setModal({ isVisible: false, message: '' });
    };

    return (
        <div>
            <h2>Resume Page</h2>
            <p>This is where you can manage your resume PDF.</p>
            <div className="cards-container">
                <div className="card">
                    <h2>Select PDF File</h2>
                    <input
                        type="file"
                        accept="application/pdf"
                        id="fileInput"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <button onClick={() => document.getElementById('fileInput').click()}>Select PDF File</button>

                    <select value={selectedOption} onChange={handleOptionChange} style={{ margin: '5px 0' }}>
                        <option value="">Select Summarization Method</option>
                        <option value="inHouse">In-House Summary</option>
                        <option value="openAI">OpenAI Summary</option>
                    </select>

                    <button onClick={handleOkClick}>OK</button>

                    {selectedFile && (
                        <div className="file-info" style={{ marginTop: '0.1px' }}>
                            <span>{selectedFile.name}</span>
                            <button onClick={handleRemoveFile} className="delete-button">❌</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading spinner and message */}
            {loading && (
                <div style={{ marginTop: '80px', textAlign: 'center' }}>
                    <div className="spinner" />
                    <p>It may take some minutes...</p>
                </div>
            )}

            {/* Display summary in a textarea */}
            {summary && !loading && (
                <div className="summary-container" style={{ marginTop: '140px' }}>
                    <h3>Summary:</h3>
                    <textarea
                        value={summary}
                        readOnly
                        rows={10}
                        style={{ width: '100%', resize: 'none' }}
                    />
                </div>
            )}

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

export default ResumePage;
