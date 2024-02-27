const mongoose = require('mongoose');
const clientModel = require('../models/client.model');
const utilDB = require('../utils/utilDB');

async function findAll(req, res) {
    try {
        await utilDB.connect();

        const clients = await clientModel.find({}).populate({
            path: 'id_utilisateur',
            model: 'User'
        });

        res.status(200).json({
            message: 'Clients récupérés avec succès',
            data: clients,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    } finally {
        utilDB.close();
    }
}

async function findById(req, res) {
    try {
        const clientId = req.params.id;

        await utilDB.connect();

        const client = await clientModel.findById(clientId).populate({
            path: 'id_utilisateur',
            model: 'User'
        });

        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        res.status(200).json({
            message: 'Client récupéré avec succès',
            data: client,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    } finally {
        utilDB.close();
    }
}

module.exports = {
    findAll,
    findById
};
