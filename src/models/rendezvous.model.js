const mongoose = require('mongoose');

const rendezvousSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    id_service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    date_heure: Date,
    etat: String,

    // autres champs
});

module.exports = mongoose.model('Rendezvous', rendezvousSchema);
