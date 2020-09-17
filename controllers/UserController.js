const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');


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

        if(result.status){
            res.status(200).send("Tudo OK");
        }else{
            res.status(406).send(result.error);
        }
    }

    async recoverPassword(req, res){
        let email = req.body.email;

        let result = await PasswordToken.create(email);

        if(result.status){
            res.status(200).send(result.token);
        }else{
            res.status(406).send(result.error);
        }
    }
}

module.exports = new UserController();