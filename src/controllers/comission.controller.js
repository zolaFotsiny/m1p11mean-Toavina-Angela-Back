const Commission = require('../models/comission.model'); // Assuming the schema is in models/comission.model.js
const tokenUtils = require('../utils/token');
const utilDB = require('../utils/utilDB');
const Depense = require('../models/depense.model');
const DepenseDetails = require('../models/depensedetails.model');
async function findAll(req, res) {
    try {
        await utilDB.connect();
        const decodedToken = tokenUtils.decodeToken(req.headers.token);
        const userType = decodedToken.type_utilisateur;

        if (userType !== 'manager' && userType !== 'employee') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers et les employés peuvent voir toutes les commissions.' });
        }

        const commissions = await Commission.find({})
            .populate({
                path: 'id_employee',
                populate: {
                    path: 'id_utilisateur',
                    model: 'User'
                }
            })
            .populate({
                path: 'id_tache',
                model: 'Tache'
            }
            ).populate({
                path: 'id_service',
                model: 'Service'
            }
            );

        res.status(200).json({
            message: 'Commissions récupérées avec succès',
            data: commissions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    } finally {
        utilDB.close();
    }
}
async function creerDepense(req, res) {
    try {
        await utilDB.connect();

        // Retrieve the commission id from the request
        const idCommission = req.params.id;
        console.log("test", idCommission);

        // Find the commission with the given id
        const commission = await Commission.findById(idCommission).populate('id_service');
        console.log("commission", commission);
        if (!commission) {
            return res.status(404).json({ message: 'Commission not found' });
        }

        // Create a new expense
        const depense = await Depense.create({
            montant_total: commission.montant,
            date_depense: new Date(),
            mode_depense: 'Cash', // Set the payment method to 'Cash'
            etat: 1,
        });

        // Create the expense details
        const depenseDetails = await DepenseDetails.create({
            id_depense: depense._id,
            id_tache: commission.id_tache,
            id_service: commission.id_service,
            designation: 'Commission', // Replace with the actual designation
            montant: commission.montant,
            etat: 1,
        });

        depense.details.push(depenseDetails);

        await depense.save();

        utilDB.close();
        res.status(201).json({ message: 'Expense created successfully', depense: depense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error during expense creation' });
    }
}

module.exports = {
    findAll,
    creerDepense
};
