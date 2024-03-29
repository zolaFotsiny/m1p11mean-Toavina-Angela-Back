const express = require('express');
const employeeController = require('../controllers/employee.controller');


const router = express.Router();

router.get('/', employeeController.findAll);
router.get('/:id', employeeController.findById);


module.exports = router;
