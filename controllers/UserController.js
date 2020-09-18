const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');
const { secret } = require('../middleware/Secret');

const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');


class UserController {

    async index(req, res) {
        let users = await User.findAll();
        res.json(users);
    }

    async findUser(req, res) {
        let id = req.params.id;

        let user = await User.findById(id);

        if (!user) {
            return res.status(404).json({});
        }

        res.status(200).json(user);
    }

    async create(req, res) {

        let { name, email, password, role } = req.body;

        if (!name) {
            return res.status(400).json({ err: "Nome inválido." });
        }

        if (!email) {
            return res.status(400).json({ err: "Email inválido." });
        }

        if (!password) {
            return res.status(400).json({ err: "Senha inválida." });
        }

        let emailExists = await User.findEmail(email);

        if (emailExists) {
            return res.status(406).send("O e-mail já está cadastrado.")
        }

        await User.new(email, password, name);

        res.status(200).send("Tudo OK!");
    }

    async edit(req, res) {
        let { id, name, email, role } = req.body;

        let result = await User.update(id, name, email, role);

        if (result != undefined) {
            if (result.status) {
                res.status(200).send("Tudo OK!");
            } else {
                res.status(406).send(result.error);
            }
        } else {
            res.status(406).send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req, res) {
        let id = req.params.id;

        let result = await User.delete(id);

        if (result.status) {
            res.status(200).send("Tudo OK");
        } else {
            res.status(406).send(result.error);
        }
    }

    async recoverPassword(req, res) {
        let email = req.body.email;

        let result = await PasswordToken.create(email);

        if (result.status) {
            res.status(200).send(result.token);
        } else {
            res.status(406).send(result.error);
        }
    }

    async changePassword(req, res) {
        let token = req.params.token;
        let password = req.body.password;

        let isTokenValid = await PasswordToken.validate(token);

        if (isTokenValid.status) {
            await User.changePassword(isTokenValid.token.user_id, password, isTokenValid.token.token);
            res.status(200).send("Senha alterada.");
        } else {
            res.status(406).send("Token inválido.");
        }
    }

    async login(req, res) {
        let { email, password } = req.body;

        let user = await User.findByEmail(email);

        if (user != undefined) {

            let result = await bcrypt.compare(password, user.password);

            if (result) {

                let token = jwt.sign({ email: user.email, role: user.role }, secret);

                res.status(200).json({ token });

            } else {
                res.status(406).send("Senha incorreta.");
            }

        } else {
            res.json({ status: false });
        }

    }
}

module.exports = new UserController();