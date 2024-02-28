const express = require('express');
const paiementController = require('../controllers/paiement.controller'); // Assurez-vous d'avoir un contrôleur de paiement

const router = express.Router();



// Route pour récupérer tous les paiements d'un client spécifique
router.get('/', paiementController.findAll); // Assurez-vous d'avoir une méthode findAll dans votre contrôleur de paiement
router.put('/valider/:id', paiementController.validerPaiement);
module.exports = router;
