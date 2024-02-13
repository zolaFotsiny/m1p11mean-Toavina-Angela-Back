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
        await utilDB.connect().catch((error) => {
            console.error("Database connection error", error);
            return res.status(500).json({ message: 'Database connection error' });
        });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const decodedToken = req.headers.token ? tokenUtils.decodeToken(req.headers.token) : null;
        if (!decodedToken && req.headers.token) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if ((type_utilisateur === 'employee' || type_utilisateur === 'manager') && decodedToken.type_utilisateur !== 'manager') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers peuvent créer les employees and managers.' });
        }

        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        const user = await User.create({
            nom,
            prenom,
            email,
            mot_de_passe: hashedPassword,
            type_utilisateur
        });

        switch (type_utilisateur) {
            case 'client':
                await Client.create({ id_utilisateur: user._id });
                break;
            case 'employee':
            case 'manager':
                await Employee.create({ id_utilisateur: user._id });
                break;
            default:
                throw new Error('Invalid user type');
        }

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
