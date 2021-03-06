let knex = require('../database/connection');
let bcrypt = require('bcrypt');
const PasswordToken = require('./PasswordToken');

class User {

    async findAll() {
        try {
            let result = await knex.select(['id', 'name', 'email', 'role']).table("users");
            return result;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async findById(id) {
        try {
            let result = await knex.select(['id', 'name', 'email', 'role']).where({ id }).table("users");

            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async findByEmail(email) {
        try {
            let result = await knex.select(['id', 'name', 'email', 'password', 'role']).where({ email }).table("users");

            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async new(email, password, name) {

        try {
            let hash = await bcrypt.hash(password, 10);
            await knex.insert({ email, password: hash, name, role: 0 }).table("users");
        } catch (error) {
            console.log(error);
        }

    }

    async update(id, name, email, role) {

        let user = await this.findById(id);

        if (user != undefined) {

            let editUser = {};

            if (email != undefined) {
                if (email != user.email) {
                    let result = await this.findEmail(email);
                    if (result == false) {
                        editUser.email = email;
                    } else {
                        return { status: false, error: "O e-mail já existe!" }
                    }
                }
            }

            if (name != undefined) {
                editUser.name = name;
            }

            if (role != undefined) {
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({ id: id }).table("users");
                return { status: true }
            } catch (error) {
                return { status: false, error: error }
            }

        } else {
            return { status: false, err: "O usuário não existe!" }
        }
    }

    async delete(id) {
        let user = await this.findById(id);

        if (user != undefined) {

            try {
                await knex.delete().where({ id: id}).table("users");
                return { status: true}
            } catch (error) {
                return { status: false, error: error}
            }

        }else{
            return { status: false, error: "O usuário não existe, portanto não pode ser deletado."}
        }
    }

    async changePassword(id, newPassword, token){
        let hash = await bcrypt.hash(newPassword, 10);
        await knex.update({ password: hash }).where({ id }).table("users");
        await PasswordToken.setUsed(token);
    }

}

module.exports = new User();