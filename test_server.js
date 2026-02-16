const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/test', (req, res) => {
    res.json({ message: 'Success' });
});

app.listen(3001, () => {
    console.log('Test server running on http://localhost:3001');
});
