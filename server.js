const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('Develop/public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop/public/index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  // Read data from db.json and send as response
  const notes = JSON.parse(fs.readFileSync('Develop/db/db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
    try {
      // Get the new note from the request body
      const newNote = req.body;
  
      // Read existing notes from db.json
      const notes = JSON.parse(fs.readFileSync('Develop/db/db.json', 'utf8'));
  
      // Assign a unique id to the new note
      newNote.id = Date.now().toString();
  
      // Add the new note to the array
      notes.push(newNote);
  
      // Write the updated notes array back to db.json
      fs.writeFileSync('Develop/db/db.json', JSON.stringify(notes));
  
      // Send the entire array of notes as a response
      res.json(notes);
    } catch (error) {
      console.error('Error processing POST request:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
