const mongoose = require('mongoose');

const offreSpecialeSchema = new mongoose.Schema({
    titre: String,
    description: String,
    date_debut: Date,
    date_fin: Date,
    id_service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: false }, // Le champ id_service est  optionnel
    image: Buffer, // Add this line to include an image
    commission_pourcentage: Number // Add this line to include a commission percentage
});

const OffreSpeciale = mongoose.model('OffreSpeciale', offreSpecialeSchema);

module.exports = OffreSpeciale;
