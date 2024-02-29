const utilDB = require('../utils/utilDB');
const Depense = require('../models/depense.model');
const DepenseDetails = require('../models/depensedetails.model');
const tokenUtils = require('../utils/token');
const Finance = require('../models/finance.model');
async function create(req, res) {
    const { designation, montant_total, mode_depense, details } = req.body;
    try {
        // Vérifier le token et le rôle de l'utilisateur
        const decodedToken = tokenUtils.decodeToken(req.headers.token);

        if (decodedToken.type_utilisateur !== 'manager') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers peuvent créer une dépense.' });
        }

        await utilDB.connect();

        // Créer d'abord les détails de la dépense
        const createdDetails = await Promise.all(details.map(async detail => {
            const newDetail = new DepenseDetails({
                id_tache: detail.id_tache || null,
                id_service: detail.id_service || null,
                designation: detail.designation,
                montant: detail.montant,
                etat: detail.etat || 1
            });
            return await newDetail.save();
        }));

        // Ensuite, ajouter les détails à la dépense
        const depense = await Depense.create({
            designation,
            montant_total,
            mode_depense,
            details: createdDetails.map(detail => detail._id)
        });

        res.status(200).json({
            message: 'Dépense créée avec succès',
            data: depense,

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
    try {
        const _id = req.params.id;

        await utilDB.connect();

        const employee = await Depense.findById(_id).populate('details');

        if (!employee) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }

        res.status(200).json({
            message: 'Dépenses récupéré avec succès',
            data: employee,
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

        // Récupérer toutes les dépenses avec leurs détails
        const depenses = await Depense.find({}).populate('details');

        res.status(200).json({
            message: 'Dépenses et leurs détails récupérés avec succès',
            data: depenses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    } finally {
        utilDB.close();
    }
}

async function validerDepense(req, res) {
    try {
        const id_depense = req.params.id;
        console.log("id_depense", id_depense);
        await utilDB.connect();
        const decodedToken = tokenUtils.decodeToken(req.headers.token);
        if (decodedToken.type_utilisateur !== 'manager') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les manager  peuvent valider une dépense.' });
        }

        const depense = await Depense.findById(id_depense);
        console.log("depense", depense);
        if (!depense) {
            return res.status(404).json({ message: 'Dépense non trouvée' });
        }

        depense.etat = 51; // Mettre à jour l'état de la dépense
        await depense.save();

        // Trouver tous les documents Finance
        const finances = await Finance.find({});

        if (finances.length === 0) {
            // Si aucun document Finance n'existe, en créer un nouveau
            const newFinance = new Finance({
                entree: 0,
                sortie: depense.montant_total,
                reste: -depense.montant_total,
            });
            await newFinance.save();
        } else {
            // Si un document Finance existe, mettre à jour le premier document
            const finance = finances[0];
            finance.sortie += depense.montant_total;
            finance.reste -= depense.montant_total;
            await finance.save();
        }

        res.status(200).json({
            message: 'Dépense et finance mis à jour avec succès',
            data: depense,
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur du serveur' });
    }
}

module.exports = {
    create,
    update,
    findById,
    findAll,
    validerDepense
};
