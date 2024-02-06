// utils/utilDB.js
const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connexion à MongoDB établie avec succès');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error);
        throw new Error('Erreur de connexion à la base de données');
    }
}

function close() {
    mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
}

module.exports = {
    connect,
    close
};
