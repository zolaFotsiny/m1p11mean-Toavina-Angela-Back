const mongoose = require('mongoose');

// Modèle Dépense
const depenseSchema = new mongoose.Schema({
    designation: String,
    montant_total: Number,
    date_depense: { type: Date, default: Date.now },
    mode_depense: String,
    etat: { type: Number, default: 1 },
});
module.exports = mongoose.model('Depense', depenseSchema);
