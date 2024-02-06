const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    designation: String,
    prix: Number,
    duree: Number,
    commission_pourcentage: Number,
    date_insertion: { type: Date, default: Date.now },
    etat: { type: Boolean, default: true },
    // autres champs
});


module.exports = mongoose.model('Service', serviceSchema);
