const clientModel = require('../models/client.model');
const utilDB = require('../utils/utilDB');



async function findAll(req, res) {
    try {
        await utilDB.connect();

        // Récupérer tous les services
        const clients = await clientModel.find({});

        res.status(200).json({
            message: 'Client récupérés avec succès',
            data: clients,
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
