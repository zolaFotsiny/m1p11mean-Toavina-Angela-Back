const mongoose = require('mongoose');

// Modèle Dépense
const depenseSchema = new mongoose.Schema({
    designation: String,
    montant_total: Number,
    date_depense: { type: Date, default: Date.now },
    mode_depense: String,
    etat: { type: Number, default: 1 },
    details: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DepenseDetails' }],
});

module.exports = mongoose.model('Depense', depenseSchema);
