require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const clientRoutes = require('./routes/users.route');
const authRoutes = require('./routes/auth.route');
const serviceRoutes = require('./routes/service.routes');
const rendezvousRoutes = require('./routes/rendezvous.routes');

const cors = require('cors');

const app = express();

const corsOptions = {
    origin: '*', // Mettez ici l'origine autorisée ou '*' pour autoriser toutes les origines
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/users', clientRoutes);
app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use('/uploads', express.static('public/uploads'));
app.use('/rendezvous', rendezvousRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
