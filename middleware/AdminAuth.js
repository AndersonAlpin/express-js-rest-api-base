const jwt = require('jsonwebtoken');
const { secret } = require('./Secret');

module.exports = function (req, res, next) {

    const authToken = req.headers['authorization']

    if (authToken != undefined) {
        const bearer = authToken.split(' ');
        let token = bearer[1];

        try {
            let decoded = jwt.verify(token, secret);

            if (decoded.role == 1) {
                next();
            } else {
                return res.status(403).send("Você não tem permissão para acessar este serviço.");
            }
        } catch (error) {
            return res.status(403).send("Você não está autenticado.");
        }
    } else {
        return res.status(403).send("Você não está autenticado.");
    }

}