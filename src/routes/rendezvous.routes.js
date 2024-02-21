const express = require('express');
const rendezvousController = require('../controllers/rendezvous.controller');

const router = express.Router();

// Route pour ajouter un rendez-vous
router.post('/add', rendezvousController.addRendezvous);



// Route pour récupérer les rendez-vous d'un client spécifique
router.get('/', rendezvousController.findAll);

module.exports = router;
