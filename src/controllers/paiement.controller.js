const Rendezvous = require('../models/rendezvous.model');
const Paiement = require('../models/paiement.model');
const Client = require('../models/client.model');
const tokenUtils = require('../utils/token');
const utilDB = require('../utils/utilDB');

async function findAll(req, res) {
    try {
        await utilDB.connect();
        const decodedToken = tokenUtils.decodeToken(req.headers.token);
        if (decodedToken.type_utilisateur !== 'client') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les clients peuvent ajouter un rendez-vous.' });
        }

        const id_utilisateur = decodedToken.id;
        const client = await Client.findOne({ id_utilisateur: id_utilisateur });

        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        const id_client = client._id;
        const paiementsByClient = await Paiement.find({}).populate({
            path: 'id_rendezvous',
            match: { id_client: id_client },
            model: 'Rendezvous'
        }).populate({
            path: 'details',
            populate: {
                path: 'id_service',
                model: 'Service',
                select: '-image'
            }
        });


        res.status(200).json({
            message: 'Succès',
            data: paiementsByClient,
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur du serveur' });
    }
}

module.exports = {
    findAll
};
