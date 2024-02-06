const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date_creation: { type: Date, default: Date.now },
    // Add any additional fields specific to the Manager model
    department: { type: String },
    // ... other fields
});

module.exports = mongoose.model('Manager', managerSchema);
