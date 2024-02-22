const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
    id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    id_tache: { type: mongoose.Schema.Types.ObjectId, ref: 'Tache' },
    id_service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // Référence à Tache
    montant: Number,
    date: { type: Date, default: Date.now },
    etat: { type: Number, default: 1 },
});

module.exports = mongoose.model('Commission', commissionSchema);
