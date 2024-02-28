const express = require('express');
const serviceController = require('../controllers/service.controller');

const router = express.Router();

const multer = require('./../utils/multerConfig');

router.post('/', multer.single('file'), serviceController.create);
router.get('/', serviceController.findAll);

// Route pour supprimer un service
router.delete('/:id', serviceController.deleteService);
module.exports = router;
