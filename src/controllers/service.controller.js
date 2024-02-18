const utilDB = require('../utils/utilDB');
const Service = require('../models/service.model');
const tokenUtils = require('../utils/token');
const multer = require('../utils/multerConfig');
const fs = require('fs').promises;

async function create(req, res) {
    const { designation, prix, duree, commission_pourcentage } = req.body;
    const fileBuffer = req.file.buffer.toString('base64');
    try {
        // Vérifier le token et le rôle de l'utilisateur
        const decodedToken = tokenUtils.decodeToken(req.headers.token);

        if (decodedToken.type_utilisateur !== 'manager') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers peuvent créer un service.' });
        }

        await utilDB.connect();

        // Read the image file as a Buffer
        // Check if the file was included in the request
        if (!fileBuffer) {
            return res.status(400).json({ message: "No file was uploaded." });
        }

        // Create the service with the image buffer
        const service = await Service.create({
            designation,
            prix,
            duree,
            commission_pourcentage,
            image: fileBuffer // Save the filename to the database
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

async function update(req, res) {
    const { id } = req.params;
    const { designation, prix, duree, commission_pourcentage } = req.body;
    try {
        // Vérifier le token et le rôle de l'utilisateur
        const decodedToken = tokenUtils.decodeToken(req.headers.token);

        if (decodedToken.type_utilisateur !== 'manager') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers peuvent mettre à jour un service.' });
        }

        await utilDB.connect();

        // Find the service by ID and update it
        const service = await Service.findByIdAndUpdate(
            id,
            {
                designation,
                prix,
                duree,
                commission_pourcentage,
            },
            { new: true } // Return the updated document
        );

        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé.' });
        }

        res.status(200).json({
            message: 'Service mis à jour avec succès',
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

async function findById(req, res) {
    const { id } = req.params;
    try {
        await utilDB.connect();

        // Récupérer le service par ID
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé.' });
        }

        res.status(200).json({
            message: 'Service récupéré avec succès',
            data: service,
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
    create,
    update,
    findById,
    findAll,
};
