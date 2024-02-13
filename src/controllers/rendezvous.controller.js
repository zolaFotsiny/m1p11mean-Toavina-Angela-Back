const Rendezvous = require('../models/rendezvous.model');

class RendezvousController {
    // Méthode pour ajouter un rendez-vous
    async addRendezvous(req, res) {
        try {
            const { id_client, id_service, id_employee, date_heure, etat } = req.body;
            const rendezvous = new Rendezvous({
                id_client,
                id_service,
                id_employee,
                date_heure,
                etat,
            });
            await rendezvous.save();
            res.status(201).json({ message: 'Rendez-vous créé avec succès' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la création du rendez-vous' });
        }
    }

    // Méthode pour récupérer l'historique des rendez-vous
    async getRendezvousHistory(req, res) {
        try {
            const rendezvousHistory = await Rendezvous.find();
            res.status(200).json(rendezvousHistory);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique des rendez-vous' });
        }
    }


    async getRendezvousByClient(req, res) {
        try {
            const { clientId } = req.params;
            const rendezvousByClient = await Rendezvous.find({ id_client: clientId });
            res.status(200).json(rendezvousByClient);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous pour ce client' });
        }
    }
}

module.exports = new RendezvousController();
