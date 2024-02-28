const Finance = require('../models/finance.model');
const utilDB = require('../utils/utilDB');

async function findFirst(req, res) {
    try {
        await utilDB.connect();
        const finance = await Finance.findOne();
        if (!finance) {
            return res.status(404).json({ message: 'Aucun document Finance trouvé' });
        }
        res.status(200).json({
            message: 'Succès',
            data: finance,
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur du serveur' });
    }
}

module.exports = {
    findFirst
};
