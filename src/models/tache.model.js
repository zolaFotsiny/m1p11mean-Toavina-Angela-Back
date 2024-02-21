const mongoose = require('mongoose');

const tacheSchema = new mongoose.Schema({
    id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    id_service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    id_rendezvous: { type: mongoose.Schema.Types.ObjectId, ref: 'Rendezvous' },
    date_debut: Date,
    date_fait: Date,
    etat: { type: Number, default: 1 },

    // autres champs
});

module.exports = mongoose.model('Tache', tacheSchema);
