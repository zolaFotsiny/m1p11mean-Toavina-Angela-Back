const Tache = require('../models/tache.model');
const Commission = require('../models/comission.model');
const tokenUtils = require('../utils/token');
const utilDB = require('../utils/utilDB');
const Service = require('../models/service.model');
const mongoose = require('mongoose');
const employeeModel = require('../models/employee.model');

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
            const id_utilisateur = decodedToken.id;
            const employee = await employeeModel.findOne({ id_utilisateur: id_utilisateur });
            console.log("employee", employee);
            if (!employee) {
                return res.status(404).json({ message: 'employee not found' });
            }
            // Now you can use client._id
            const id_employee = employee._id;

            const tachesByEmployee = await Tache.find({ id_employee: id_employee });
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

        // Find the service related to the task
        const service = await Service.findById(tache.id_service);
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé.' });
        }

        // Calculate the commission amount
        const montant = service.prix * (service.commission_pourcentage / 100);

        // Create a new commission
        const commission = new Commission({
            id_employee: tache.id_employee,
            id_tache: tache._id,
            id_servie: service._id,
            montant: montant,
            date: tache.date_fait,
            etat: 1
        });
        await commission.save();

        utilDB.close();
        res.status(200).json({ message: 'Tâche validée avec succès. Commission ajoutée.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la validation de la tâche' });
    }
}

module.exports = {
    findAll,
    validateTask  // added validateTask
};
