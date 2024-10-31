// server/app.js

const express = require('express');
const app = express();
const PORT = 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Route for the root URL
app.get('/', (req, res) => {
    res.send('<h1>PDF Services API</h1><p>Welcome to the PDF services API!</p>');
});

// Route for the "Resume Page" (dummy example)
app.get('/resume', (req, res) => {
    res.json({
        title: "Resume Page",
        description: "This is a placeholder response for the resume page."
    });
});

// Route for "Search in PDF" (dummy example)
app.get('/search', (req, res) => {
    res.json({
        title: "Search in PDF",
        description: "This is a placeholder response for the search feature."
    });
});

// Route for handling file uploads (optional, if needed)
app.post('/upload', (req, res) => {
    // In a real application, handle PDF file upload here.
    res.send('PDF file uploaded successfully!');
});

// 404 Error Handling for undefined routes
app.use((req, res) => {
    res.status(404).send('404: Page not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
