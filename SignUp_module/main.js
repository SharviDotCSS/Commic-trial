const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// Set up MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sharvipw#2003',
  database: 'storyboard',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON and urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files like your HTML and CSS
app.use(express.static('public'));


// Define a route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html'); // Adjust the path as needed
  });

// Handle form submission
app.post('/signup', (req, res) => {
  const { username, email, password, cpassword } = req.body;

  // Validation checks
  
  // Insert user data into the database
  const user = { username, email, password, cpassword };
  const query = 'INSERT INTO user (username, email, password, cpassword) VALUES (?, ?, ?, ?)';

  db.query(query, user, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log('User registered successfully');
    return res.status(200).json({ message: 'User registered successfully' });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

