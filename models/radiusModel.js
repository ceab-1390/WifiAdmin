const pool = require('./db');
const Logguer = require('../logguer/logger');

class Radius{
    static async createAp(data){
        try {
            
        } catch (error) {
            
        }
    };

    static async showNas(){
        try {
            const allNas = await pool.query('SELECT * FROM nas');
            return allNas.rows
        } catch (error) {
            Logguer.error(error);
            return false;
        }
    }
}

module.exports = {Radius};