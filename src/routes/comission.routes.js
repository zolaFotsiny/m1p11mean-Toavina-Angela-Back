const express = require('express');
const comission = require('../controllers/comission.controller');


const router = express.Router();

router.get('/', comission.findAll);



module.exports = router;
