const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    designation: String,
    prix: Number,
    duree: Number,
    commission_pourcentage: Number,
    date_insertion: { type: Date, default: Date.now },
    etat: { type: Number, default: 1 },
    image: String, // Field to store the image name
    isOffreSpeciale: { type: Boolean, default: false }, // Field for special offer status
    dateDebut: Date, // Field for the start date of the special offer
    dateFin: Date, // Field for the end date of the special offer
});

module.exports = mongoose.model('Service', serviceSchema);
