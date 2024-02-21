require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const clientRoutes = require('./routes/users.route');
const authRoutes = require('./routes/auth.route');
const serviceRoutes = require('./routes/service.routes');
const rendezvousRoutes = require('./routes/rendezvous.routes');
const employeeRoutes = require('./routes/employee.routes');
const tacheRoutes = require('./routes/tache.routes');

const cors = require('cors');

const app = express();

const corsOptions = {
    origin: '*', // Mettez ici l'origine autorisée ou '*' pour autoriser toutes les origines
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ error: 'Invalid JSON format' });
    }
    next();
});
app.use('/users', clientRoutes);
app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use(express.static('affichage'));
app.use('/rendezvous', rendezvousRoutes);
app.use('/employees', employeeRoutes);
app.use('/taches', tacheRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
