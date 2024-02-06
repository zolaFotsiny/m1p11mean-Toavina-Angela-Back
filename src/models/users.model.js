const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    mot_de_passe: String,
    type_utilisateur: {
        type: String,
        enum: ['employee', 'manager', 'client'],
        required: true
    }
});

module.exports = mongoose.model('User', usersSchema); 
