const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const dbPath = path.join(__dirname, 'db.json');

app.use(express.json());

// Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Helper
const updateDB = (collection, newItem, res) => {
    try {
        console.log(`\n[DB] Intentando registrar en '${collection}':`, newItem.email || newItem.nombre || 'Sin nombre');

        if (!fs.existsSync(dbPath)) {
            console.log('[DB] Creando base de datos inicial...');
            fs.writeFileSync(dbPath, JSON.stringify({ usuarios: [], ciudadanos: [], config: { adminCode: "admin123" } }, null, 4));
        }

        const data = fs.readFileSync(dbPath, 'utf8');
        let db;
        try {
            db = JSON.parse(data);
        } catch (e) {
            console.error('[DB] ERROR: El archivo db.json está corrupto. Intentando resetear...');
            db = { usuarios: [], ciudadanos: [], config: { adminCode: "admin123" } };
        }

        if (!db[collection]) db[collection] = [];

        // Evitar duplicados por email si existe
        if (newItem.email && db[collection].some(u => u.email === newItem.email)) {
            console.warn(`[DB] CUIDADO: El email ${newItem.email} ya está registrado.`);
            return res.status(400).json({ message: 'Este correo electrónico ya está registrado.' });
        }

        db[collection].push(newItem);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 4));

        console.log(`[DB] ÉXITO: Usuario guardado correctamente.`);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('[DB] ERROR FATAL:', error);
        res.status(500).json({
            message: 'Error interno del servidor al escribir en la base de datos.',
            details: error.message
        });
    }
};



// API
app.post('/api/registradores', (req, res) => updateDB('registradores', { id: Date.now(), ...req.body }, res));
app.post('/api/ciudadanos', (req, res) => updateDB('ciudadanos', { id: Date.now(), ...req.body }, res));

app.post('/api/login', (req, res) => {
    try {
        const { email, password, role, adminCode } = req.body;
        console.log(`\n--- INTENTO DE LOGIN ---`);
        console.log(`Email: ${email}, Rol seleccionado: ${role}`);

        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

        if (role === 'admin') {
            console.log(`Verificando código de admin...`);
            if (adminCode !== db.config?.adminCode) {
                console.warn(`Código de administrador incorrecto: ${adminCode}`);
                return res.status(403).json({ message: 'Código de administrador incorrecto' });
            }
            const user = (db.usuarios || []).find(u => u.email === email && u.password === password);
            if (user) {
                console.log(`Login de ADMIN exitoso: ${user.nombre}`);
                return res.json({ success: true, user, role: 'admin' });
            }
        } else {
            console.log(`Buscando en ciudadanos...`);
            const user = (db.ciudadanos || []).find(u => u.email === email && u.password === password);
            if (user) {
                console.log(`Login de CIUDADANO exitoso: ${user.nombre}`);
                return res.json({ success: true, user, role: 'citizen' });
            }
        }

        console.warn(`Credenciales inválidas para email: ${email}`);
        res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    } catch (e) {
        console.error('SERVER LOGIN ERROR:', e);
        res.status(500).json({ message: 'Error en el proceso de login' });
    }
});


// Static
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/home.html')));

const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`\n================================`);
    console.log(`Servidor activo en puerto ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`================================\n`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n[!] ERROR: El puerto ${PORT} ya está en uso.`);
        console.error(`Por favor, detén el proceso anterior (Ctrl+C) y reinicia.\n`);
    } else {
        console.error('Error al iniciar servidor:', err);
    }
});


