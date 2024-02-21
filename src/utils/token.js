const jwt = require('jsonwebtoken');

function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        type_utilisateur: user.type_utilisateur
    };

    const options = {
        expiresIn: '24h'
    };

    return jwt.sign(payload, 'MEAN', options);
}

function decodeToken(token) {
    try {
        // Extract the token from the Bearer scheme
        token = token.split(' ')[1];

        const decoded = jwt.verify(token, 'MEAN');
        return decoded;
    } catch (error) {
        throw new Error('Token invalide');
    }
}


module.exports = {
    generateToken,
    decodeToken
};
