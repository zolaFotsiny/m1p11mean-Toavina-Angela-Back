const Tache = require('../models/tache.model');
const tokenUtils = require('../utils/token');
const utilDB = require('../utils/utilDB');
const mongoose = require('mongoose');

async function findAll(req, res) {
    try {
        await utilDB.connect();
        // Verify the token and get the user type
        const decodedToken = tokenUtils.decodeToken(req.headers.token);
        const userType = decodedToken.type_utilisateur;

        if (userType === 'client') {
            // If the user is a client, return the tasks where the client is involved
            const id_client = decodedToken.id;
            const tachesByClient = await Tache.find({ id_client });
            res.status(200).json(tachesByClient);
        } else if (userType === 'employee') {
            // If the user is an employee, return the tasks where the employee is involved
            const id_employee = decodedToken.id;
            const tachesByEmployee = await Tache.find({ id_emp: id_employee });
            res.status(200).json(tachesByEmployee);
        } else if (userType === 'manager') {
            // If the user is a manager, return all tasks
            const allTaches = await Tache.find();
            res.status(200).json(allTaches);
        } else {
            res.status(403).json({ message: 'Accès interdit. Type d\'utilisateur non reconnu.' });
        }

        utilDB.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
    }
}




async function getDailyTasksAndCommission(req, res) {
    try {
        await utilDB.connect();
        // Verify the token and get the user type
        const decodedToken = tokenUtils.decodeToken(req.headers.token);
        const userType = decodedToken.type_utilisateur;

        if (userType !== 'employee') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les employés peuvent accéder à cette fonction.' });
        }

        const id_employee = decodedToken.id;

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Find tasks for the day
        const tasks = await Tache.find({
            id_emp: id_employee,
            date_debut: { $gte: today, $lt: tomorrow }
        }).populate('id_service');

        // Calculate commission
        let totalCommission = 0;
        tasks.forEach(task => {
            const commissionPourcentage = task.id_service.commission_pourcentage;
            const prix = task.id_service.prix;
            const commission = (commissionPourcentage / 100) * prix;
            totalCommission += commission;
        });

        utilDB.close();
        res.status(200).json({ tasks, totalCommission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des tâches et de la commission' });
    }
}

async function validateTask(req, res) {
    try {
        await utilDB.connect();
        // Verify the token and get the user type
        const decodedToken = tokenUtils.decodeToken(req.headers.token);
        const userType = decodedToken.type_utilisateur;

        if (userType !== 'manager' && userType !== 'employee') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les managers et les employés peuvent valider une tâche.' });
        }

        const id_tache = req.params.id; // assuming the id of the task is passed as a URL parameter
        const tache = await Tache.findById(id_tache);

        if (!tache) {
            return res.status(404).json({ message: 'Tâche non trouvée.' });
        }

        tache.etat = 11; // update the state
        tache.date_fait = new Date(); // update the date_fait field to the current date and time
        await tache.save();

        utilDB.close();
        res.status(200).json({ message: 'Tâche validée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la validation de la tâche' });
    }
}

module.exports = {
    findAll,
    getDailyTasksAndCommission,
    validateTask  // added validateTask
};
