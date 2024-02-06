const express = require('express');
const serviceController = require('../controllers/service.controller');

const router = express.Router();

// Définir les routes pour gérer les services
router.post('/', serviceController.create);
router.get('/test', serviceController.test);
router.get('/test2', serviceController.test2);


module.exports = router;
