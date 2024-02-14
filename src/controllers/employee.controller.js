const clientModel = require('../models/client.model');
const utilDB = require('../utils/utilDB');



async function findAll(req, res) {
    try {
        await utilDB.connect();

        const clients = await clientModel.find({}).populate({
            path: 'id_utilisateur', // Correct the path to match the schema
            populate: {
                path: 'employee.id_utilisateur',
                model: 'User'
            }
        });


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
