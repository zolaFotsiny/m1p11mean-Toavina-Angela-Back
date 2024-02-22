const express = require('express');
const rendezvousController = require('../controllers/rendezvous.controller');

const router = express.Router();
// Middleware to inject io into the request object
// Middleware to inject io into the request object
router.use((req, res, next) => {
    req.io = req.app.get('io'); // Access io from the app instance
    next();
    console.log('-----------',req.io);
});
// Route pour ajouter un rendez-vous
router.post('/add', rendezvousController.addRendezvous);



// Route pour récupérer les rendez-vous d'un client spécifique
router.get('/', rendezvousController.findAll);

module.exports = router;
