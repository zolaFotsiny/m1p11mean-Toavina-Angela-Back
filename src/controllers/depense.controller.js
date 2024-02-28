const utilDB = require('../utils/utilDB');
const Depense = require('../models/depense.model');
const tokenUtils = require('../utils/token');

async function create(req, res) {
    const { designation, montant_total, mode_depense } = req.body;
    try {
        // Vérifier le token et le rôle de l'utilisateur
        const decodedToken = tokenUtils.decodeToken(req.headers.token);

        if (decodedToken.type_utilisateur !== 'manager') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers peuvent créer une dépense.' });
        }

        await utilDB.connect();

        // Créer la dépense
        const depense = await Depense.create({
            designation,
            montant_total,
            mode_depense
        });

        res.status(200).json({
            message: 'Dépense créée avec succès',
            data: depense,
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
    const { designation, montant_total, mode_depense } = req.body;
    try {
        // Vérifier le token et le rôle de l'utilisateur
        const decodedToken = tokenUtils.decodeToken(req.headers.token);

        if (decodedToken.type_utilisateur !== 'manager') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers peuvent mettre à jour une dépense.' });
        }

        await utilDB.connect();

        // Trouver la dépense par ID et la mettre à jour
        const depense = await Depense.findByIdAndUpdate(
            id,
            {
                designation,
                montant_total,
                mode_depense,
            },
            { new: true } // Retourner le document mis à jour
        );

        if (!depense) {
            return res.status(404).json({ message: 'Dépense non trouvée.' });
        }

        res.status(200).json({
            message: 'Dépense mise à jour avec succès',
            data: depense,
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

        // Récupérer la dépense par ID
        const depense = await Depense.findById(id);

        if (!depense) {
            return res.status(404).json({ message: 'Dépense non trouvée.' });
        }

        res.status(200).json({
            message: 'Dépense récupérée avec succès',
            data: depense,
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

        // Récupérer toutes les dépenses
        const depenses = await Depense.find({});

        res.status(200).json({
            message: 'Dépenses récupérées avec succès',
            data: depenses,
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
    findAll
};
