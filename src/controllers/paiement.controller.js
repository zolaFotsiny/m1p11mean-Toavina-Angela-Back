const Rendezvous = require('../models/rendezvous.model');
const Paiement = require('../models/paiement.model');
const Client = require('../models/client.model');
const tokenUtils = require('../utils/token');
const utilDB = require('../utils/utilDB');
const Finance = require('../models/finance.model');
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
async function validerPaiement(req, res) {
    try {

        const id_paiement = req.params.id;
        console.log("id_paiement", id_paiement);
        await utilDB.connect();
        const decodedToken = tokenUtils.decodeToken(req.headers.token);
        if (decodedToken.type_utilisateur !== 'client') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les clients peuvent valider un paiement.' });
        }

        const paiement = await Paiement.findById(id_paiement);
        console.log("paiement", paiement);
        if (!paiement) {
            return res.status(404).json({ message: 'Paiement non trouvé' });
        }

        paiement.etat = 51; // Mettre à jour l'état du paiement
        await paiement.save();

        // Trouver tous les documents Finance
        const finances = await Finance.find({});

        if (finances.length === 0) {
            // Si aucun document Finance n'existe, en créer un nouveau
            const newFinance = new Finance({
                entree: paiement.montant_total,
                sortie: 0,
                reste: paiement.montant_total,
            });
            await newFinance.save();
        } else {
            // Si un document Finance existe, mettre à jour le premier document
            const finance = finances[0];
            finance.entree += paiement.montant_total;
            finance.reste += paiement.montant_total;
            await finance.save();
        }

        res.status(200).json({
            message: 'Paiement et finance mis à jour avec succès',
            data: paiement,
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur du serveur' });
    }
}


module.exports = {
    findAll,
    validerPaiement
};
