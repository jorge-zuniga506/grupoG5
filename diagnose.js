const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

app.post('/api/ciudadanos', (req, res) => {
    console.log('TEST SERVER: POST /api/ciudadanos hit');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    db.ciudadanos.push({ id: Date.now(), ...req.body });
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 4));
    res.status(201).json({ success: true });
});

const server = app.listen(3006, async () => {
    console.log('Test Server running on 3006');
    try {
        const response = await fetch('http://localhost:3006/api/ciudadanos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: 'AutoTest', email: 'auto@test.com' })
        });
        const data = await response.json();
        console.log('Test Result:', data);
    } catch (e) {
        console.error('Test Failed:', e.message);
    } finally {
        server.close();
        process.exit();
    }
});
