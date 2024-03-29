const Rendezvous = require('../models/rendezvous.model');
const Tache = require('../models/tache.model');
const Client = require('../models/client.model');
const MailUtils = require('../utils/mailUtils');
const Paiement = require('../models/paiement.model');
const Service = require('../models/service.model');
const PaiementDetails = require('../models/paiementdetails.model');

const tokenUtils = require('../utils/token');
const utilDB = require('../utils/utilDB');
const mongoose = require('mongoose');


async function addRendezvous(req, res) {
    try {
        // console.log('_________',req);
        await utilDB.connect();
        // Verify the token and allow only "client" role
        const decodedToken = tokenUtils.decodeToken(req.headers.token);

        if (decodedToken.type_utilisateur !== 'client') {
            return res.status(403).json({ message: 'Accès interdit. Seuls les clients peuvent ajouter un rendez-vous.' });
        }

        const id_utilisateur = decodedToken.id;

        // Find the client with the decoded id
        const client = await Client.findOne({ id_utilisateur: id_utilisateur });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Now you can use client._id
        const id_client = client._id;
        const { choix, date_heure, remarque } = req.body;  // added remarque

        // Create rendezvous without tasks
        const rendezvous = await Rendezvous.create({
            id_client,
            date_heure,  // updated field
            remarque,  // added remarque
            // other fields...
        });

        // Create tasks and add them to the rendezvous
        let previousTaskEndTime = new Date(date_heure);
        for (let i = 0; i < choix.length; i++) {
            const { id_service, id_employee } = choix[i];
            // Get the service to find its duration
            const service = await Service.findById(id_service);
            if (!service) {
                throw new Error('Service not found');
            }

            // Calculate the start date of the task
            let date_debut;
            if (i === 0) {
                // If it's the first task, it starts at the same time as the rendezvous
                date_debut = new Date(date_heure);
            } else {
                // If it's not the first task, it starts after the previous task, which is the duration of the previous service
                date_debut = previousTaskEndTime;
            }

            // Update the end time of the previous task
            previousTaskEndTime = new Date(date_debut.getTime() + service.duree * 60 * 1000);  // assuming duree is in minutes

            const tache = await Tache.create({
                id_employee,
                id_service,
                id_rendezvous: rendezvous._id,
                date_debut,
                remarque_tache: 'Tache pour plus ' + date_debut,  // new field
                // other fields...
            });
            rendezvous.taches.push(tache._id);
        }

        await rendezvous.save();


        if (req.io) {
            req.io.emit('rdv', { message: 'rdv has registered!' });
            console.log('success');
        }
        else {
            console.log('err io');
        }
        await Rendezvous.populate(rendezvous, {
            path: 'taches',
            model: 'Tache',
            populate: [
                {
                    path: 'id_service',
                    model: 'Service',
                    select: '-image'
                },
                {
                    path: 'id_employee',
                    model: 'Employee',
                    populate: {
                        path: 'id_utilisateur',
                        model: 'User',
                        select: '-mot_de_passe'
                    }
                }
            ]
        });


        const subject = 'Rappel de rendez-vous';
        const text = `<p class="reminder-text">Ceci est un rappel de votre rendez-vous prévu pour <strong>${date_heure}</strong>.</p>`;
        const mailUtilsInstance = new MailUtils();
        await mailUtilsInstance.sendReminderEmail('zolaandriamarosoa@gmail.com', subject, text);
        res.status(201).json({ message: 'Rendez-vous créé avec succès', data: rendezvous });
        utilDB.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du rendez-vous' });
    }
}



async function findAll(req, res) {
    try {
        await utilDB.connect();
        // Verify the token and get the user type
        const decodedToken = tokenUtils.decodeToken(req.headers.token);
        const userType = decodedToken.type_utilisateur;

        if (userType === 'client') {
            // If the user is a client, return the rendezvous where the client is involved
            const id_utilisateur = decodedToken.id;

            // Find the client with the decoded id
            const client = await Client.findOne({ id_utilisateur: id_utilisateur });

            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }

            // Now you can use client._id
            const id_client = client._id;
            const rendezvousByClient = await Rendezvous.find({ id_client })
                .populate({
                    path: 'taches',
                    model: 'Tache',
                    populate: [
                        {
                            path: 'id_service',
                            model: 'Service',
                            select: '-image'

                        },
                        {
                            path: 'id_employee',
                            model: 'Employee',
                            populate: {
                                path: 'id_utilisateur',
                                model: 'User',
                                select: '-mot_de_passe'
                            }

                        }
                    ]
                });

            res.status(200).json({
                message: 'rdv succès',
                data: rendezvousByClient,

            });
        } else {
            // If the user is a manager, return all rendezvous
            const allRendezvous = await Rendezvous.find()
                .populate({
                    path: 'taches',
                    model: 'Tache',
                    populate: [
                        {
                            path: 'id_service',
                            model: 'Service',
                            select: '-image'

                        },
                        {
                            path: 'id_employee',
                            model: 'Employee',
                            populate: {
                                path: 'id_utilisateur',
                                model: 'User',
                                select: '-mot_de_passe'
                            }

                        }
                    ]
                });



            res.status(200).json({
                message: 'rdv succès',
                data: allRendezvous,

            });
        }

        utilDB.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
    }
}
async function findById(req, res) {
    try {
        await utilDB.connect();
        const id = req.params.id;

        // Find the rendezvous with the provided id
        const rendezvous = await Rendezvous.findById(id)
            .populate({
                path: 'taches',
                model: 'Tache',
                populate: [
                    {
                        path: 'id_service',
                        model: 'Service',
                        select: '-image'
                    },
                    {
                        path: 'id_employee',
                        model: 'Employee',
                        populate: {
                            path: 'id_utilisateur',
                            model: 'User',
                            select: '-mot_de_passe'
                        }
                    }
                ]
            });

        if (!rendezvous) {
            return res.status(404).json({ message: 'Rendezvous not found' });
        }

        res.status(200).json({
            message: 'Rendezvous found',
            data: rendezvous,
        });

        utilDB.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while retrieving the rendezvous' });
    }
}

async function payer(req, res) {
    try {
        await utilDB.connect();

        // Récupérer l'id du rendez-vous à partir de la requête
        const idRendezvous = req.params.id;

        // Trouver le rendez-vous avec l'id donné
        const rendezvous = await Rendezvous.findById(idRendezvous).populate('taches');

        if (!rendezvous) {
            return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        }

        // Vérifier si le rendez-vous a déjà été payé
        if (rendezvous.etat === 51) {
            const paiementExist = await Paiement.findOne({ id_rendezvous: rendezvous._id }).populate({
                path: 'details',
                populate: {
                    path: 'id_service',
                    model: 'Service',
                    select: '-image'
                }
            });
            if (paiementExist) {
                return res.status(200).json({ message: 'Paiement déjà effectué', paiement: paiementExist });
            }
        }

        // Calculer le montant total du paiement
        let montantTotal = 0;
        for (let tache of rendezvous.taches) {
            const service = await Service.findById(tache.id_service);
            montantTotal += service.prix;
        }

        // Créer un nouveau paiement
        const paiement = await Paiement.create({
            id_rendezvous: rendezvous._id,
            montant_total: montantTotal,
            date_paiement: new Date(),
            mode_paiement: 'Carte de crédit', // À remplacer par le mode de paiement réel
            etat: 1,
        });

        // Créer les détails du paiement pour chaque tâche
        for (let tache of rendezvous.taches) {
            const service = await Service.findById(tache.id_service);
            const paiementDetails = await PaiementDetails.create({
                id_paiement: paiement._id,
                id_tache: tache._id,
                id_service: service._id,
                montant: service.prix,
                etat: 1,
            });
            paiement.details.push(paiementDetails);
        }

        await paiement.save();

        // Mettre à jour l'état du rendez-vous
        rendezvous.etat = 51;
        await rendezvous.save();

        const paiementPopulated = await Paiement.findById(paiement._id).populate({
            path: 'details',
            populate: {
                path: 'id_service',
                model: 'Service',
                select: '-image'
            }
        });

        utilDB.close();
        res.status(201).json({ message: 'Paiement effectué avec succès', paiement: paiementPopulated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors du paiement' });
    }
}




const getRdvCountPerDay = async (req, res) => {
    try {
        await utilDB.connect();

        // Get start and end dates of the current week
        const now = new Date();
        const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const lastDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()));

        const rendezvousList = await Rendezvous.aggregate([
            {
                $match: {
                    date_heure: {
                        $gte: firstDayOfWeek,
                        $lt: lastDayOfWeek
                    }
                }
            },
            {
                $project: {
                    dayOfWeek: { $dayOfWeek: "$date_heure" }
                }
            },
            {
                $group: {
                    _id: "$dayOfWeek",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    jourint: "$_id",
                    jour: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", 1] }, then: "Dimanche" },
                                { case: { $eq: ["$_id", 2] }, then: "Lundi" },
                                { case: { $eq: ["$_id", 3] }, then: "Mardi" },
                                { case: { $eq: ["$_id", 4] }, then: "Mercredi" },
                                { case: { $eq: ["$_id", 5] }, then: "Jeudi" },
                                { case: { $eq: ["$_id", 6] }, then: "Vendredi" },
                                { case: { $eq: ["$_id", 7] }, then: "Samedi" }
                            ],
                            default: "Invalid day"
                        }
                    },
                    count: 1
                }
            }
        ]);

        // Transform rendezvousList into the desired format
        const labels = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const data = [0, 0, 0, 0, 0, 0, 0];
        for (const rdv of rendezvousList) {
            const index = labels.indexOf(rdv.jour);
            if (index !== -1) {
                data[index] = rdv.count;
            }
        }

        res.status(200).json({
            message: 'Rendezvous found',
            labels: labels,
            data: data,
        });

    } catch (error) {
        console.error(error);
        throw error;
    }
};


module.exports = {
    addRendezvous,
    findAll,
    findById,
    getRdvCountPerDay,
    payer
};
