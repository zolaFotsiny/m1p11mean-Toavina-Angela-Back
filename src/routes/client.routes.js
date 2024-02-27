const express = require('express');
const clientController = require('../controllers/client.controller');

const router = express.Router();

router.get('/', clientController.findAll);
router.get('/:id', clientController.findById);

module.exports = router;
