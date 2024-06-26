require('dotenv').config()
level = process.env.LOG_LEVEL;

class Logguer{
    constructor(logguer){
        this.logguer = logguer;
    };
    log(log){
        return console.log(log);
    };
    info(info){
        if (level === 'info' || level === 'warn' || level === 'error' ){
            return console.info(info);
        }else{
            return;
        }
    };   
    warn(warning) {
        if (level === 'warn' || level === 'error' ){
            return console.warn(warning);
        }else{
            return;
        }
    };
    error(error){
        if (level === 'error' ){
            return console.error(new Error(error));
        }else{
            return;
        }
    };
};

const logguer = new Logguer();

module.exports = logguer;