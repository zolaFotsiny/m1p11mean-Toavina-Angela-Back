require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const clientRoutes = require('./routes/users.route');
const authRoutes = require('./routes/auth.route');
const serviceRoutes = require('./routes/service.routes');
const cors = require('cors');

const app = express();

app.use(cors()); // Enable CORS before any routes
app.use(bodyParser.json());
app.use('/users', clientRoutes);
app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use('/uploads', express.static('public/uploads'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
