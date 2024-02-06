// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users.model');
const utilDB = require('../utils/utilDB');
const tokenUtils = require('../utils/token');

// Controller to handle authentication
async function login(req, res) {
    const { email, mot_de_passe } = req.body;

    try {
        // Open a connection to the database
        await utilDB.connect();

        // Find the user in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email or password incorrect', data: null });
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email or password incorrect', data: null });
        }

        // Generate the JWT token
        const token = tokenUtils.generateToken(user); // Replace with your actual secret key

        // Send the token and additional data in the response
        res.status(200).json({ message: 'Login successful', data: { token } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', data: null });
    } finally {
        // Close the connection to the database, regardless of the outcome
        utilDB.close();
    }
}

module.exports = {
    login
};
