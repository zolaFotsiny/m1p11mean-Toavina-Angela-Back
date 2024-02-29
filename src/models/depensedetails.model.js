const mongoose = require('mongoose');

const depenseDetailsSchema = new mongoose.Schema({
    id_depense: { type: mongoose.Schema.Types.ObjectId, ref: 'Depense' },
    id_tache: { type: mongoose.Schema.Types.ObjectId, ref: 'Tache', required: false }, // Peut être nul
    id_service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: false }, // Peut être nul
    designation: String, // Ajout de l'attribut 'designation'
    montant: Number,
    etat: { type: Number, default: 1 },
});

module.exports = mongoose.model('DepenseDetails', depenseDetailsSchema);
