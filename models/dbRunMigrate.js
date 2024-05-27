const pool = require('./db');
const Logguer = require('../logguer/logger');
const Bcrypt = require('bcryptjs');


async function up() {
    Logguer.warn('Iniciando la creacion de tablas')
    try {
        await pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          nombre VARCHAR(50) NOT NULL,
          apellido VARCHAR(50) ,
          cedula VARCHAR(10) ,
          password VARCHAR NOT NULL,
          admin BOOLEAN NOT NULL DEFAULT FALSE
        );
      `);
      Logguer.warn('Finalizada la creacion con exito')
    } catch (error) {
        Logguer.error(error);

    }

};

async function down () {
  Logguer.log('Drop table users')
  await pool.query(`DROP TABLE IF EXISTS users;`);
  Logguer.log('end drop')
};

async function superAdmin(){
  Logguer.warn('Se creara el super admin si no existe');
  try {
    await pool.query(`

    `)
  } catch (error) {
    
  }
}

async function admin(){
  try {
    Logguer.warn('Creando usuario admin')
    let passwordHash = Bcrypt.hashSync('12345678', 10);
    const username = 'admin';
    const nombre = 'admin';
    const apellido = 'of all';
    const password = passwordHash;
    const admin = true;
    const newUser = await pool.query('INSERT INTO users(username,nombre,apellido,password,admin) VALUES($1,$2,$3,$4,$5)',[username,nombre,apellido,password,admin]);
    Logguer.warn('ahora puede ingresar con el usuario admin:12345678')
    return true;
  } catch (error) {
    Logguer.error(error)
    Logguer.error('No se creo el usuario')
    return false;
  }
}

admin()