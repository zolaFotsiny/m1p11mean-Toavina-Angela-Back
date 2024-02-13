const express = require('express');
const rendezvousController = require('../controllers/rendezvous.controller');

const router = express.Router();

// Route pour ajouter un rendez-vous
router.post('/add', rendezvousController.addRendezvous);

// Route pour récupérer l'historique des rendez-vous
router.get('/history', rendezvousController.getRendezvousHistory);

// Route pour récupérer les rendez-vous d'un client spécifique
router.get('/byclient/:clientId', rendezvousController.getRendezvousByClient);

module.exports = router;
