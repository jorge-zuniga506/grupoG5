const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware to parse JSON bodies

const DB_PATH = path.join(__dirname, 'db.json');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/home.html'));
});

// Endpoint to handle new reports
app.post('/reportes', (req, res) => {
    const newReport = req.body;

    // Read existing data
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error reading database' });
        }

        let db = JSON.parse(data);

        // Ensure 'reportes' array exists
        if (!db.reportes) {
            db.reportes = [];
        }

        // Add new report (assign an ID if not present, though frontend provides it)
        db.reportes.push(newReport);

        // Write updated data back to file
        fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error saving report' });
            }
            res.status(201).json({ message: 'Report saved successfully', report: newReport });
        });
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});