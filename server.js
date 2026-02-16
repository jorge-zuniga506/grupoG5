const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const dbPath = path.join(__dirname, 'db.json');

app.use(express.json());

// Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log(`[DATA] Body:`, JSON.stringify(req.body, null, 2));
    }
    next();
});

// Helper
const updateDB = (collection, newItem, res) => {
    try {
        console.log(`\n[DB] --- REGISTRO EN '${collection}' ---`);
        console.log(`[DB] Datos recibidos:`, JSON.stringify(newItem, null, 2));

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
        if (newItem.email) {
            const exists = db[collection].find(u => u.email === newItem.email);
            if (exists) {
                console.warn(`[DB] CUIDADO: El email '${newItem.email}' ya está registrado.`);
                return res.status(400).json({ message: `El correo '${newItem.email}' ya está registrado.` });
            }
        }

        db[collection].push(newItem);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 4));

        console.log(`[DB] ÉXITO: Usuario '${newItem.nombre || newItem.email}' guardado correctamente.`);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('[DB] ERROR FATAL AL ESCRIBIR:', error);
        res.status(500).json({
            message: 'Error interno del servidor al escribir en la base de datos.',
            details: error.message
        });
    }
};



// API
app.post('/api/registradores', (req, res) => updateDB('registradores', { id: Date.now(), ...req.body }, res));
app.post('/api/ciudadanos', (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        console.warn('[DB] REGISTRO RECHAZADO: Faltan campos obligatorios');
        return res.status(400).json({ message: 'Todos los campos son obligatorios (nombre, email, contraseña).' });
    }
    updateDB('ciudadanos', { id: Date.now(), ...req.body }, res);
});

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
            const dbCiudadanos = db.ciudadanos || [];
            const user = dbCiudadanos.find(u => u.email === email && u.password === password);

            if (user) {
                console.log(`Login de CIUDADANO exitoso: ${user.nombre}`);
                return res.json({ success: true, user, role: 'citizen' });
            } else {
                // Debugging mismatch
                const userExists = dbCiudadanos.find(u => u.email === email);
                if (userExists) {
                    console.warn(`[LOGIN] Usuario encontrado pero contraseña incorrecta. DB pass: '${userExists.password}', Ingresada: '${password}'`);
                } else {
                    console.warn(`[LOGIN] Usuario no encontrado con email: ${email}`);
                }
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


