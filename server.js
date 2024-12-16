
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

let signals = []; // Temporary array to hold signals

app.post('/submit-signal', (req, res) => {
    const { name, description, location } = req.body;
    const [lat, lng] = location.split(',').map(Number);
    signals.push({ name, description, lat, lng });
    res.redirect('/');
});

app.get('/signals', (req, res) => {
    res.json(signals);
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => console.log(`Сървърът работи на порт ${PORT}`));
