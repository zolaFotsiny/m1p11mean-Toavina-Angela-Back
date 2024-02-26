const mongoose = require('mongoose');

// Modèle Paiement
const paiementSchema = new mongoose.Schema({
    id_rendezvous: { type: mongoose.Schema.Types.ObjectId, ref: 'Rendezvous' },
    montant_total: Number,
    date_paiement: { type: Date, default: Date.now },
    mode_paiement: String, // Par exemple, 'Carte de crédit', 'Espèces', etc.
    etat: { type: Number, default: 1 },
});

module.exports = mongoose.model('Paiement', paiementSchema);