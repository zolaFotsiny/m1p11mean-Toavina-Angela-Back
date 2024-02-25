const express = require('express');
const router = express.Router();
const dashController = require('../controllers/dash.controller');
// Middleware to inject io into the request object
router.use((req, res, next) => {
    req.io = req.app.get('io'); // Access io from the app instance
    next();
});

router.get('/moyenneTravail', dashController.moyenneTravail);


module.exports = router;
