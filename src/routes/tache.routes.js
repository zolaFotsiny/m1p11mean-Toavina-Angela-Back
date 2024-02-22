const express = require('express');
const router = express.Router();

const tacheController = require('../controllers/tache.controller');

router.get('/', tacheController.findAll);
router.put('/validateTask/:id', tacheController.validateTask); // Ajout de la nouvelle route

module.exports = router;
