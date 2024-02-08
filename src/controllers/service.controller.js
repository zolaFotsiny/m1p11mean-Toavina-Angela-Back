const utilDB = require('../utils/utilDB');
const Service = require('../models/service.model');
const tokenUtils = require('../utils/token');
const multer = require('../utils/multerConfig');
const fs = require('fs').promises;

async function create(req, res) {
    const { designation, prix, duree, commission_pourcentage } = req.body;
    const file = req.file; //
    try {
        // Vérifier le token et le rôle de l'utilisateur
        const decodedToken = tokenUtils.decodeToken(req.headers.token);


        if (decodedToken.type_utilisateur !== 'manager') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers peuvent créer un service.' });
        }

        await utilDB.connect();

        // Read the image file as a Buffer
        // Check if the file was included in the request
        if (!file) {
            return res.status(400).json({ message: "No file was uploaded." });
        }


        // Create the service with the image buffer
        const service = await Service.create({
            designation,
            prix,
            duree,
            commission_pourcentage,
            imageName: file.filename // Save the filename to the database
        });

        res.status(200).json({
            message: 'Service créé avec succès',
            data: service,
            decodedToken // Ajoutez le payload décodé à la réponse si nécessaire
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    } finally {
        utilDB.close();
    }
}


async function findAll(req, res) {
    try {
        await utilDB.connect();

        // Récupérer tous les services
        const services = await Service.find({});

        res.status(200).json({
            message: 'Services récupérés avec succès',
            data: services,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    } finally {
        utilDB.close();
    }
}


module.exports = {
    create, findAll
};
