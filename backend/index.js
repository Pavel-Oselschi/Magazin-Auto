import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const app = express();
app.use(cors());
app.use(express.json());




// 📁 UPLOAD SETUP
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage });

// 🔗 Servire fișiere statice (imagini)
app.use('/uploads', express.static(path.join('uploads')));

// 📩 Upload imagini
app.post('/api/upload', upload.array('images', 5), (req, res) => {
    const filePaths = req.files.map(file => '/uploads/' + file.filename);
    res.json({ success: true, files: filePaths });
});

// 🔧 CĂI FIȘIERE
const PORT = 3001;
const DATA_PATH = './data/cars.json';
const USERS_PATH = './data/users.json';

// 📄 UTILITARE
const readJson = (path) => JSON.parse(fs.readFileSync(path));
const writeJson = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

// 📦 GET toate mașinile
app.get('/api/cars', (req, res) => {
    res.json(readJson(DATA_PATH));
});

// ➕ POST mașină nouă
app.post('/api/cars', (req, res) => {
    const cars = readJson(DATA_PATH);
    const maxId = cars.length > 0 ? Math.max(...cars.map(c => c.id || 0)) : 0;

    const carData = {...req.body }; // preluăm datele exact cum sunt
    delete carData.id; // prevenim ca 'null' să suprascrie
    const newCar = {
        ...carData,
        id: maxId + 1
    };

    cars.push(newCar);
    writeJson(DATA_PATH, cars);
    res.status(201).json(newCar);
});

// ✏️ EDITARE mașină
app.put('/api/cars/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let cars = readJson(DATA_PATH);
    const index = cars.findIndex(car => car.id === id);

    if (index === -1) return res.status(404).json({ success: false });

    cars[index] = {...cars[index], ...req.body };
    writeJson(DATA_PATH, cars);
    res.json({ success: true, car: cars[index] });
});

// 🗑️ ȘTERGERE mașină
app.delete('/api/cars/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let cars = readJson(DATA_PATH);
    cars = cars.filter(car => car.id !== id);
    writeJson(DATA_PATH, cars);
    res.json({ success: true });
});

// 👤 Înregistrare utilizator
app.post('/api/register', (req, res) => {
    const users = readJson(USERS_PATH);
    const { email, password } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email deja înregistrat' });
    }

    const newUser = { id: Date.now(), email, password };
    users.push(newUser);
    writeJson(USERS_PATH, users);
    res.status(201).json({ success: true, user: newUser });
});

// 👤 Login
app.post('/api/login', (req, res) => {
    const users = readJson(USERS_PATH);
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ success: false, message: 'Date incorecte' });
    }

    res.json({ success: true, user });
});

// 🚀 Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));