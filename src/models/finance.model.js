const mongoose = require('mongoose');

// Modèle Finance
const financeSchema = new mongoose.Schema({
    entree: { type: Number, required: true },
    sortie: { type: Number, required: true },
    reste: { type: Number, required: true },
});

module.exports = mongoose.model('Finance', financeSchema);
