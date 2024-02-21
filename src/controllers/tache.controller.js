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

module.exports = {
    findAll,
    getDailyTasksAndCommission  // added findAll
};
