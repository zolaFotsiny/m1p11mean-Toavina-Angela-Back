const mongoose = require('mongoose');

const rendezvousSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    taches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tache' }],
    date_heure: Date,  // champ renommé
    remarque: String,
    etat: { type: Number, default: 1 },

    // autres champs
});

module.exports = mongoose.model('Rendezvous', rendezvousSchema);
