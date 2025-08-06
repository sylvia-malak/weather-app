// Initialize an empty JavaScript object to act as the endpoint for all routes
let projectData = {}; // Use an object, not an array

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of Express
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("website")); // Ensure this points to the correct folder

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// GET route to retrieve project data
app.get('/projects', (req, res) => {
  res.json({ data: [projectData] });
});

// POST route to add new data to projectData
app.post('/projects/add', (req, res) => {
  try {
    const { temperature, date, content } = req.body; // Corrected variable names to match `app.js`
    if (!temperature || !date || !content) {
      throw new Error("Missing required fields");
    }

    // Store the data in `projectData`
    projectData = { temperature, date, content };

    res.status(201).json({ projectData, status: 201 });
  } catch (error) {
    res.status(400).json({ error: "There was an error processing your request", status: 400 });
  }
});
