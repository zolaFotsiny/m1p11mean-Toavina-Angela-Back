const utilDB = require('../utils/utilDB');
const Service = require('../models/service.model');
const tokenUtils = require('../utils/token');

async function create(req, res) {
    const { designation, prix, duree, commission_pourcentage } = req.body;

    try {
        // Vérifier le token et le rôle de l'utilisateur
        const decodedToken = tokenUtils.decodeToken(req.headers.token);


        if (decodedToken.type_utilisateur !== 'manager') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers peuvent créer un service.' });
        }

        await utilDB.connect();

        // Créer le service
        const service = await Service.create({
            designation,
            prix,
            duree,
            commission_pourcentage
            // Ajoutez d'autres champs si nécessaire
        })

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

module.exports = {
    create
};
