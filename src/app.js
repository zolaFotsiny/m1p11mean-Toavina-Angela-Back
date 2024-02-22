// main file
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const clientRoutes = require('./routes/users.route');
const authRoutes = require('./routes/auth.route');
const serviceRoutes = require('./routes/service.routes');
const rendezvousRoutes = require('./routes/rendezvous.routes');
const employeeRoutes = require('./routes/employee.routes');
const tacheRoutes = require('./routes/tache.routes');
const comisionRoutes = require('./routes/comission.routes');
const cors = require('cors');
const initializeSocket = require('./utils/socket'); // Import the socket initialization function

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ error: 'Invalid JSON format' });
    }
    next();
});

// Initialize socket.io
const io = initializeSocket(server);
// Inject io into routes
// app.use((req, res, next) => {
//     req.io = io;
//     next();
// });

app.set('io', io);

app.use('/users', clientRoutes);
app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use(express.static('affichage'));
app.use('/rendezvous', rendezvousRoutes);
app.use('/employees', employeeRoutes);
app.use('/taches', tacheRoutes);
app.use('/comission', comisionRoutes);



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Serveur démarré sur le port: http://localhost:${port}`);
});
