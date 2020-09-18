const knex = require('../database/connection');
const User = require('./User');
const { v4 } = require('uuid');

class PasswordToken {

    async create(email) {
        let user = await User.findByEmail(email);

        if (user != undefined) {

            try {
                let token = v4();

                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("password_tokens");
                return { status: true, token }
            } catch (error) {
                console.log(error);
                return { status: false, error }
            }

        } else {
            return { status: false, error: "O e-mail informado não existe." }
        }
    }

    async validate(token) {


        try {
            let result = await knex.select().where({ token }).table("password_tokens");

            if (result.length > 0) {
                let tk = result[0];

                if (tk.used) {
                    return { status: false };
                } else {
                    return { status: true, token: tk };
                }

            } else {
                return { status: false };
            }

        } catch (error) {
            return { status: false };
            console.log(error);
        }

    }

    async setUsed(token){
        await knex.update({ used: 1}).where({ token }).table("password_tokens");
    }

}

module.exports = new PasswordToken();