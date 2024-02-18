const Rendezvous = require('../models/rendezvous.model');
const MailUtils = require('../utils/mailUtils');

const tokenUtils = require('../utils/token');
const utilDB = require('../utils/utilDB');
const mongoose = require('mongoose');


async function addRendezvous(req, res) {
    try {
        await utilDB.connect();
        // Verify the token and allow only "employee" role
        const decodedToken = tokenUtils.decodeToken(req.headers.token);

        if (decodedToken.type_utilisateur !== 'client') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les employés peuvent ajouter un rendez-vous.' });
        }

        // Extracting id_client from the decoded token
        const id_client = decodedToken.id;

        const { id_service, id_employee, date_heure } = req.body;



        const rendezvous = await Rendezvous.create({
            id_client,
            id_employee,
            id_service,
            date_heure,
        });
        const subject = 'Rappel de rendez-vous';
        const text = `<p class="reminder-text">Ceci est un rappel de votre rendez-vous prévu pour <strong>${date_heure}</strong>.</p>`;
        const mailUtilsInstance = new MailUtils();
        await mailUtilsInstance.sendReminderEmail('zolaandriamarosoa@gmail.com', subject, text);

        utilDB.close();
        res.status(201).json({ message: 'Rendez-vous créé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du rendez-vous' });
    }
}
// Méthode pour récupérer l'historique des rendez-vous
async function getRendezvousHistory(req, res) {
    try {
        const rendezvousHistory = await Rendezvous.find();
        res.status(200).json(rendezvousHistory);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique des rendez-vous' });
    }
}


async function getRendezvousByClient(req, res) {
    try {
        const { clientId } = req.params;
        const rendezvousByClient = await Rendezvous.find({ id_client: clientId });
        res.status(200).json(rendezvousByClient);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous pour ce client' });
    }
}


module.exports = {
    addRendezvous,
    getRendezvousHistory,
    getRendezvousByClient,
};
