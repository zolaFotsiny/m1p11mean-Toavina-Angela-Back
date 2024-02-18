const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    designation: String,
    prix: Number,
    duree: Number,
    commission_pourcentage: Number,
    date_insertion: { type: Date, default: Date.now },
    etat: { type: Number, default: 1 },
    image: String, // Field to store the image name
});

module.exports = mongoose.model('Service', serviceSchema);
