const express = require('express');
const rendezvousController = require('../controllers/rendezvous.controller');

const router = express.Router();
// Middleware to inject io into the request object
router.use((req, res, next) => {
    req.io = req.app.get('io'); // Access io from the app instance
    next();
});
// Route pour ajouter un rendez-vous
router.post('/add', rendezvousController.addRendezvous);



// Route pour récupérer les rendez-vous d'un client spécifique
router.get('/', rendezvousController.findAll);



// Route pour récupérer un rendez-vous par son id
router.get('/:id', rendezvousController.findById);
router.get('/stat/getRdvCountPerDay', rendezvousController.getRdvCountPerDay);

router.post('/payer/:id', rendezvousController.payer);

module.exports = router;
