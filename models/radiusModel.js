const pool = require('./db');
const Logguer = require('../logguer/logger');

class Nas{
    static async createDevice(data){
        try {
            const newDevice = await pool.query('INSERT INTO nas(nasname,shortname,type,ports,secret,server,community,description) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[
                data.nasname,data.shortname,data.type,data.ports,data.secret,data.server,data.community,data.description
            ]);
            return true
        } catch (error) {
            Logguer.error(error)
            return false
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
    };

    static async nasTypes(){
        try {
            const nasTypes = await pool.query('SELECT * FROM nas_types');
            return nasTypes.rows;
        } catch (error) {
            Logguer.log(error)
            return false
        }
    };

    static async validateIp(ip){
        try {
            const validate = await pool.query('SELECT id,nasname FROM nas WHERE nasname = $1',[ip]);
            if (validate.rowCount != 0){
                return validate.rows[0].id;
            }else{
                return false;
            }
        } catch (error) {
            Logguer.error(error);
            return true;
        }
    };

    static async editDevice(data){
        try {
            const newDevice = await pool.query('UPDATE nas SET nasname = $1,shortname = $2,type = $3 ,ports = $4 ,secret = $5,server = $6,community = $7,description = $8 WHERE id = $9',[
                data.nasname,data.shortname,data.type,data.ports,data.secret,data.server,data.community,data.description,data.id
            ]);
            return true
        } catch (error) {
            Logguer.error(error)
            return false
        }
    };

    static async deleteOne(id){
        try {
            const deleteNas = await pool.query('DELETE FROM nas WHERE id = $1',[id]);
            return true
        } catch (error) {
            Logguer.error(error);
            return false
        }
    }

  
};

class RadCheck{
    static async show(page,size){
        try {
            const show = {}
             show.pagination_data = await pool.query('SELECT id,username,session_timeout FROM radcheck ORDER BY id DESC LIMIT $1 OFFSET $2',
                [size,(page - 1) * size]
            );
            show.total_pages = await pool.query('SELECT COUNT(*) FROM radcheck');
            //Logguer.log(show.total_pages)
            return show;
        } catch (error) {
            Logguer.error(error);
            return false
        }
    };

    static async createOne(data){
        try {
            const newUser = await pool.query('INSERT INTO radcheck(username,attribute,op,value,session_timeout) VALUES($1,$2,$3,$4,$5)',[
                data.username,data.attribute,data.op,data.value,data.session_timeout
                ]);
            return true;
        } catch (error) {
            Logguer.error(error);
            return false
        }
    };

    static async validateUser(username){
        try {
            const validate = await pool.query('SELECT id,username FROM radcheck WHERE username = LOWER($1)',[username]);
            if (validate.rowCount != 0){
                return validate.rows[0].id;
            }else{
                return false;
            }
        } catch (error) {
            Logguer.error(error);
            return true;
        }
    };

    static async deleteOne(id){
        try {
            const deleteUser = await pool.query('DELETE FROM radcheck WHERE id = $1',[id]);
            return true
        } catch (error) {
            Logguer.error(error);
            return false
        }
    };

    static async editOne(data){
        try {
            const editUser = await pool.query('UPDATE radcheck SET username = LOWER($1), attribute = $2, value = $3, session_timeout = $4 WHERE id = $5',[data.username,data.attribute,data.value,data.session_timeout,data.id]);
            return true;
        } catch (error) {
            Logguer.error(error);
            return false
        }
    }

    static async name(){
        try {
            
        } catch (error) {
            Logguer.error(error);
            return false
        }
    }
};

class Audit {
    static async show(page,size){
        try {
            const show = {}
            show.pagination_data = await pool.query('SELECT id,username,reply,authdate FROM radpostauth ORDER BY id DESC LIMIT $1 OFFSET $2',
                [size, (page - 1) * size]
            );
            show.total_pages = await pool.query('SELECT COUNT(*) FROM radpostauth');
            return show 
        } catch (error) {
            Logguer.error(error);
            return false
        }
    }
}

module.exports = {Nas,RadCheck,Audit};