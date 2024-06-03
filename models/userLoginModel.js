const pool = require('./db');
const Logguer = require('../logguer/logger');

class User {
    static async findOne(user) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE username = LOWER($1)', [user]);
            return result.rows[0];
        } catch (error) {
            Logguer.error(error)
        }

    };

    static async createOne(data){
        try {
            const username = data.username;
            const nombre = data.nombre;
            const apellido = data.apellido;
            const cedula = data.cedula
            const password = data.password;
            const admin = data.admin
            const newUser = await pool.query('INSERT INTO users(username,nombre,apellido,cedula,password,admin) VALUES(LOWER($1),LOWER($2),LOWER($3),$4,$5,$6)',[username,nombre,apellido,cedula,password,admin]);
            return true;
        } catch (error) {
            Logguer.log(error);
            return false;
        }
    };

    static async getAll(){
        try {
            let allUsers = await pool.query('SELECT * FROM users');
            return allUsers; 
        } catch (error) {
           Logguer.error(error) 
           return false;
        }
    };

    static async validate(user){
        try {
            let valid = await pool.query('SELECT * FROM users WHERE username = LOWER($1)', [user]);
            if (valid.rowCount == 1){
                return true
            }else{
                return false
            }
        } catch (error) {
            Logguer.error(error)
            return true
        }
    };

    static async editOne(data){
        try {
            const id = data.id
            const username = data.username;
            const nombre = data.nombre;
            const apellido = data.apellido;
            const cedula = data.cedula;
            const password = data.password;
            const admin = data.admin
            const newUser = await pool.query('UPDATE users SET username = LOWER($1), nombre = LOWER($2), apellido = LOWER($3), cedula = $4 , password = $5, admin = $6  WHERE id = $7',[username,nombre,apellido,cedula,password,admin,id]);
            return true
        } catch (error) {
            Logguer.error(error);
            return false
        }
    };

    static async validateId(user){
        try {
            let valid = await pool.query('SELECT * FROM users WHERE username = LOWER($1)', [user]);
            if (valid.rowCount == 1){
                return valid.rows[0]
            }else{
                return false
            }
        } catch (error) {
            Logguer.error(error)
            return true
        }
    };

    static async deleteOne(id){
        try {
            const delUser = await pool.query('DELETE FROM users WHERE id = $1',[id]);
            return true;
        } catch (error) {
            Logguer.error(error);
            return false;
        }
    };

    static async editPass(data){
        try {
            const username = data.username;
            const password = data.password;
            const change = await pool.query('UPDATE users SET password = $1 WHERE username = LOWER($2)',[password,username]);
            return true;
        } catch (error) {
            Logguer.error(error);
            return false;
        }
    };

    /*static async validateAdmin(user){
        try {
            const exists = await pool.query('SELECT admin,username FROM users WHERE admin = true');
            console.log(exists)
            return exists.rows
        } catch (error) {
            Logguer.error(error)
            return false           
        }
    }*/

}

async function testConnection() {
    try {
        const result = await pool.query('SELECT version();');
        console.log('Conexión a DB exitosa!');
        return true
    } catch (error) {
        Logguer.error( error);
        return false
    }
}

module.exports = {User,testConnection}