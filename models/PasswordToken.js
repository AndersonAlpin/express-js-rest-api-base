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

}

module.exports = new PasswordToken();