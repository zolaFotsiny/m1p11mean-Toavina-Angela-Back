
async function moyenneTravail(req, res, io) {
    let data = {
        emp: ['luc', 'jean', 'Luis'],
        temps: [4, 5, 2]
    }

    res.status(200).json({
        message: 'data récupérées avec succès',
        data: data,
    });
}


module.exports = {
    moyenneTravail,
};
