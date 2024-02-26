const mongoose = require('mongoose');


const paiementDetailsSchema = new mongoose.Schema({
    id_paiement: { type: mongoose.Schema.Types.ObjectId, ref: 'Paiement' },
    id_tache: { type: mongoose.Schema.Types.ObjectId, ref: 'Tache' },
    id_service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    montant: Number,
    etat: { type: Number, default: 1 },
});

module.exports = mongoose.model('PaiementDetails', paiementDetailsSchema);