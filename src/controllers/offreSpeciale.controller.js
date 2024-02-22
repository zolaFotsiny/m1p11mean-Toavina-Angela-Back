const utilDB = require('../utils/utilDB');
const OffreSpeciale = require('../models/offreSpeciale.model');
const tokenUtils = require('../utils/token');
const multer = require('../utils/multerConfig');



async function create(req, res) {
    const { titre, description, date_debut, date_fin, id_services, commission_pourcentage } = req.body;
    const fileBuffer = req.file.buffer.toString('base64');
    try {
        // Vérifier le token et le rôle de l'utilisateur
        const decodedToken = tokenUtils.decodeToken(req.headers.token);

        if (decodedToken.type_utilisateur !== 'manager') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers peuvent créer une offre spéciale.' });
        }

        await utilDB.connect();

        // Read the image file as a Buffer
        // Check if the file was included in the request
        if (!fileBuffer) {
            return res.status(400).json({ message: "No file was uploaded." });
        }

        // Create the offreSpeciale with the image buffer
        const offreSpeciale = await OffreSpeciale.create({
            titre,
            description,
            date_debut,
            date_fin,
            id_services,
            commission_pourcentage,
            image: fileBuffer // Save the filename to the database
        });


        res.status(200).json({
            message: 'Offre spéciale créée avec succès',
            data: offreSpeciale,
            decodedToken // Ajoutez le payload décodé à la réponse si nécessaire
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    } finally {
        utilDB.close();
    }


    // Find all OffreSpeciale
    async function findAll(req, res) {
        try {
            await utilDB.connect();
            const offresSpeciales = await OffreSpeciale.find({});
            res.status(200).json({
                message: 'Offres spéciales récupérées avec succès',
                data: offresSpeciales
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        } finally {
            utilDB.close();
        }
    }

    // Update OffreSpeciale with manager token
    async function update(req, res) {
        const { id, titre, description, date_debut, date_fin, id_services, commission_pourcentage, image } = req.body;
        try {
            const decodedToken = tokenUtils.decodeToken(req.headers.token);
            if (decodedToken.type_utilisateur !== 'manager') {
                return res.status(403).json({ message: 'Accès interdit. Seuls les managers peuvent mettre à jour une offre spéciale.' });
            }
            await utilDB.connect();
            const offreSpeciale = await OffreSpeciale.findByIdAndUpdate(id, { titre, description, date_debut, date_fin, id_services, commission_pourcentage, image }, { new: true });
            res.status(200).json({
                message: 'Offre spéciale mise à jour avec succès',
                data: offreSpeciale
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        } finally {
            utilDB.close();
        }
    }

    // Find OffreSpeciale by id
    async function findById(req, res) {
        const { id } = req.params;
        try {
            await utilDB.connect();
            const offreSpeciale = await OffreSpeciale.findById(id);
            res.status(200).json({
                message: 'Offre spéciale récupérée avec succès',
                data: offreSpeciale
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        } finally {
            utilDB.close();
        }
    }

    // Find OffreSpeciale if current date is within date_debut and date_fin
    async function findCurrent(req, res) {
        const currentDate = new Date();
        try {
            await utilDB.connect();
            const offresSpeciales = await OffreSpeciale.find({ date_debut: { $lte: currentDate }, date_fin: { $gte: currentDate } });
            res.status(200).json({
                message: 'Offres spéciales actuelles récupérées avec succès',
                data: offresSpeciales
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        } finally {
            utilDB.close();
        }
    }

}

module.exports = {
    findById,
    findCurrent,
    update,
    findAll,
    create
};