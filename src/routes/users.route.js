const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
// Middleware to inject io into the request object
router.use((req, res, next) => {
    req.io = io;
    next();
});

router.post('/register', userController.registerUser);
router.post('/test', userController.test);

module.exports = router;
