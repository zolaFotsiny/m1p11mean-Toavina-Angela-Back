const express = require('express');
const financeController = require('../controllers/finance.controller'); // Assurez-vous d'avoir un contrôleur de finance

const router = express.Router();

// Route pour récupérer le premier document Finance
router.get('/', financeController.findFirst); // Assurez-vous d'avoir une méthode findFirst dans votre contrôleur de finance

module.exports = router;
