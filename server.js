// Initialize an empty JavaScript object to act as the endpoint for all routes
projectData = {};

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

app.use(express.static("website"));

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




// mine 

// GET route to retrieve project data
app.get('/projects', (req, res) => {
  res.json({ data: projectData });
});

// POST route to add new data to projectData
app.post('/projects/add', (req, res) => {
  try {
    const { temperature, details, content } = req.body;
    if (!temperature || !details || !content) {
      throw new Error("Missing required fields");
    }
    
    projectData.push({ temperature, details, content }); 

    res.status(201).json({ projectData, status: 201 });
  } catch (error) {
    res.status(400).json({ error: "There was an error processing your request", status: 400 });
  }
});



//amr


// GET route to return projectData
app.get('/all', (req, res) => {
  res.send(projectData);
});

// POST route to add data to projectData
app.post('/add', (req, res) => {
  try {
    const {temp ,data ,contant} = req.body;
    if(!temp || !contant || !data ){
      throw new error ("missing data");
    }
projectData = {
  temp,data,content,
};

res.status(200).send({projectData,status :200});
} catch (error){
  res.status(500).send({error:"there is error in your request" , status:500,});
}
  });
