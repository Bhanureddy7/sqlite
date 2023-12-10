const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5500;

app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Connect to SQLite database
const db = new sqlite3.Database('users.db');

// Create a table if not exists
db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)");

// Create an endpoint for storing data
app.post('/storeData', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Please enter both username and password" });
  }

  // Check if the user already exists
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      // User already exists
      return res.status(400).json({ error: "User already exists" });
    }

    // Insert data into the table
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.json({ message: `User ${username} added to the database` });
      }
    });
  });
});

// Close the database connection on server shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
    process.exit();
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
