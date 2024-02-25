const Rendezvous = require('../models/rendezvous.model');
const Tache = require('../models/tache.model');
const Client = require('../models/client.model');
const MailUtils = require('../utils/mailUtils');

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
        const taches = await Promise.all(choix.map(async ({ id_service, id_employee }) => {
            const tache = await Tache.create({
                id_employee,
                id_service,
                id_rendezvous: rendezvous._id,  // added id_rendezvous
                date_debut: date_heure,
                // other fields...
            });
            rendezvous.taches.push(tache._id);
        }));

        await rendezvous.save();

        if (req.io) {
            req.io.emit('rdv', { message: 'rdv has registered!' });
            console.log('success');
        }
        else {
            console.log('err io');
        }
        // const io = req.io;
        // io.emit('rdv', { message: 'rdv has registered!' });


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


module.exports = {
    addRendezvous,
    findAll,
    findById
};
