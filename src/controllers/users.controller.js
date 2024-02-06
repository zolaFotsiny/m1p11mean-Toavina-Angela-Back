const bcrypt = require('bcrypt');
const Client = require('../models/client.model');
const Employee = require('../models/employee.model');
const Manager = require('../models/manager.model');
const User = require('../models/users.model');
const utilDB = require('../utils/utilDB');
const tokenUtils = require('../utils/token');

async function registerUser(req, res) {
    const { nom, prenom, email, mot_de_passe, type_utilisateur } = req.body;

    try {
        await utilDB.connect();

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Create the user
        const user = await User.create({
            nom,
            prenom,
            email,
            mot_de_passe: hashedPassword,
            type_utilisateur
        });

        // Create the associated record based on user type
        switch (type_utilisateur) {
            case 'client':
                await Client.create({ id_utilisateur: user._id });
                break;
            case 'employee':
                await Employee.create({ id_utilisateur: user._id });
                break;
            case 'manager':
                // You can add additional logic for manager registration if needed
                await Manager.create({ id_utilisateur: user._id });
                break;
            default:
                throw new Error('Invalid user type');
        }

        // Generate JWT token for the registered user
        const token = tokenUtils.generateToken(user);
        res.status(200).json({
            message: `${type_utilisateur} registered successfully`,
            data: {
                token: token
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        utilDB.close();
    }
}

module.exports = {
    registerUser
};
