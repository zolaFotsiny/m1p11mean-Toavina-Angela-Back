const express = require('express');
const comission = require('../controllers/comission.controller');


const router = express.Router();

router.get('/', comission.findAll);
router.put('/valider/:id', comission.creerDepense);


module.exports = router;
