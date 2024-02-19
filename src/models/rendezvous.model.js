const mongoose = require('mongoose');

const rendezvousSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    choix: [{
        id_service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    }],
    date_heure: Date,
    etat: { type: Number, default: 1 },

    // autres champs
});

module.exports = mongoose.model('Rendezvous', rendezvousSchema);
