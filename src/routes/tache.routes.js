const express = require('express');
const router = express.Router();

const tacheController = require('../controllers/tache.controller');

router.get('/', tacheController.findAll);
router.get('/getDailyTasks', tacheController.getDailyTasksAndCommission);

module.exports = router;
