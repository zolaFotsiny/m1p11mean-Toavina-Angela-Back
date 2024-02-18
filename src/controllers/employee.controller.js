const mongoose = require('mongoose');
const employeeModel = require('../models/employee.model');
const utilDB = require('../utils/utilDB');

async function findAll(req, res) {
    try {
        await utilDB.connect();

        const employees = await employeeModel.find({}).populate({
            path: 'id_utilisateur',
            model: 'User'
        });

        res.status(200).json({
            message: 'Employés récupérés avec succès',
            data: employees,
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
        const employeeId = req.params.id;

        await utilDB.connect();

        const employee = await employeeModel.findById(employeeId).populate({
            path: 'id_utilisateur',
            model: 'User'
        });

        if (!employee) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }

        res.status(200).json({
            message: 'Employé récupéré avec succès',
            data: employee,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    } finally {
        utilDB.close();
    }
}


module.exports = {
    findAll,
    findById
};
