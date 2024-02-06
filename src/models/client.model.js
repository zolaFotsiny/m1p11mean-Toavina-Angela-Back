const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date_creation: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Client', clientSchema);
