const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;


// Create an Express app
const app = express();
const PORT = 5001; // Make sure this port is different from Flask

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Set up SQLite database connection
const db = new sqlite3.Database('./users.db');

// Route to handle user registration
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
  
    db.get("SELECT * FROM user WHERE email = ?", [email], (err, row) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (row) return res.status(400).json({ message: "User already exists!" });
  
      // Hash the password before storing
      bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: "Error hashing password" });
  
        const stmt = db.prepare("INSERT INTO user (username, email, password) VALUES (?, ?, ?)");
        stmt.run(username, email, hashedPassword, (err) => {
          if (err) return res.status(500).json({ message: "Error registering user" });
          res.status(201).json({ message: "User registered successfully!" });
        });
        stmt.finalize();
      });
    });
  });
  

// Route to handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    db.get("SELECT * FROM user WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (!row) return res.status(400).json({ message: "Invalid email or password!" });
  
        // Compare entered password with hashed one in DB
        bcrypt.compare(password, row.password, (err, result) => {
            if (err) return res.status(500).json({ message: "Error comparing passwords" });
            if (!result) return res.status(400).json({ message: "Invalid email or password!" });
            
            // Send the username and email in the response
            res.json({
                username: row.username, // Use 'row' to access the data fetched from DB
                email: row.email
            });
        });
    });
});

  

  app.listen(PORT, () => {
    console.log(`Node.js server running on http://localhost:${PORT}`);
  });
  
