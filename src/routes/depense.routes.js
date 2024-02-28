const express = require('express');
const depenseController = require('../controllers/depense.controller');

const router = express.Router();


// Route pour ajouter une dépense
router.post('/add', depenseController.create);

// Route pour récupérer toutes les dépenses
router.get('/', depenseController.findAll);

// Route pour récupérer une dépense par son id
router.get('/:id', depenseController.findById);

// Route pour mettre à jour une dépense
router.put('/:id', depenseController.update);

module.exports = router;
