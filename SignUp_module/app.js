const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Configure MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sharvipw#2003',
  database: 'storyboard',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); // Exit the application if the database connection fails
  } else {
    console.log('Connected to MySQL database');
  }
});

// Set up a route for the sign-in page
app.get('/signin', (req, res) => {
  res.sendFile(__dirname + '/signin.html');
});

// Serve the CSS file with the correct MIME type
app.get('/style.css', (req, res) => {
  res.header('Content-Type', 'text/css');
  res.sendFile(__dirname + '/style.css');
});

// Serve an image with the correct MIME type
app.get('/Background.png', (req, res) => {
  res.header('Content-Type', 'image/png'); // Adjust the MIME type based on your image type (e.g., image/jpeg for JPEG images)
  res.sendFile(__dirname + '/Background.png'); // Replace 'image.png' with the actual path to your image file
});

app.get('/script.js', (req, res) => {
  res.header('Content-Type', 'application/javascript'); // Set the correct MIME type for JavaScript files
  res.sendFile(__dirname + '/script.js'); // Adjust the file path based on your directory structure
});


// Handle form submission to save data to the database
app.post('/signin', (req, res) => {
  const { username, email, password, 'confirm-password': cpassword } = req.body;

  // Validate and save data to the database (add proper validation and hashing)
  
  const sql = 'INSERT INTO user (username, email, password, cpassword) VALUES (?, ?, ?, ?)';
  db.query(sql, [ username, email, password, cpassword], (err, result) => {
    if (err) {
      console.error('Error saving user data:', err);
      return res.status(500).send('Error occurred while signing in.');
    }
    console.log('User signed in:', username);
    res.send('Sign-in successful');
  });
});

// Start the Express.js server
const port = 2000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});