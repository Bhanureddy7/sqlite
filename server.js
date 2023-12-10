const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to SQLite database
const db = new sqlite3.Database('gym.db');

// Create a table if not exists
db.run(`
    CREATE TABLE IF NOT EXISTS SupplierRegistration (
        CompanyName TEXT,
        UserLocation TEXT,
        CompanyEmail TEXT,
        WebsiteLink TEXT,
        PhoneNumber TEXT,
        RatePerHour DECIMAL
    )
`);

// Define route for serving the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// POST request handling for form submission
app.post('/submitForm', async (req, res) => {
    try {
        const { companyName, userLocation, companyEmail, websiteLink, phoneNumber, ratePerHour } = req.body;

        // Insert data into the table
        db.run(`
            INSERT INTO SupplierRegistration 
            (CompanyName, UserLocation, CompanyEmail, WebsiteLink, PhoneNumber, RatePerHour)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [companyName, userLocation, companyEmail, websiteLink, phoneNumber, ratePerHour], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error inserting data into the database');
            } else {
                console.log(`Data inserted successfully with ID: ${this.lastID}`);
                res.send('Data inserted successfully!');
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error inserting data into the database');
    }
});

// GET request to check if the user already exists
app.get('/checkUser', (req, res) => {
    const { companyEmail } = req.query;

    // Check if the user exists
    db.get("SELECT CompanyEmail FROM SupplierRegistration WHERE CompanyEmail = ?", [companyEmail], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ exists: !!row });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
