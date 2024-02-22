const Commission = require('../models/comission.model'); // Assuming the schema is in models/comission.model.js
const tokenUtils = require('../utils/token');
const utilDB = require('../utils/utilDB');

async function findAll(req, res) {
    try {
        await utilDB.connect();
        const decodedToken = tokenUtils.decodeToken(req.headers.token);
        const userType = decodedToken.type_utilisateur;

        if (userType !== 'manager' && userType !== 'employee') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers et les employés peuvent voir toutes les commissions.' });
        }

        const commissions = await Commission.find({})
            .populate({
                path: 'id_employee',
                populate: {
                    path: 'id_utilisateur',
                    model: 'User'
                }
            })
            .populate({
                path: 'id_tache',
                model: 'Tache'
            }
            ).populate({
                path: 'id_service',
                model: 'Service'
            }
            );

        res.status(200).json({
            message: 'Commissions récupérées avec succès',
            data: commissions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    } finally {
        utilDB.close();
    }
}

module.exports = {
    findAll
};
