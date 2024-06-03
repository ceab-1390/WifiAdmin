const pool = require('./db');
const Logguer = require('../logguer/logger');
const Bcrypt = require('bcryptjs');
const { resolveInclude } = require('ejs');


async function upUsers() {
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

async function downUsers() {
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

async function upTipeNAS(){
  try {
    await pool.query(`
        DROP TABLE IF EXISTS nas_types;
        CREATE TABLE nas_types (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50) UNIQUE NOT NULL,
          descripcion VARCHAR(50) NOT NULL
        );

        INSERT INTO nas_types(type,descripcion) VALUES
          ('Others','Otros tipos'),
          ('Wifi','Dispositivo de red Wifi'),
          ('Ethernet','Dispositivo de red cableado'),
          ('PPP','Dispositivo de red punto a punto'),
          ('ISDN','Dispositivo de red para NAS');
          
      `).then((result) =>{
          Logguer.warn('Finalizada la creacion con exito')
        });
      
  } catch (error) {
    Logguer.error(error);
  }
}


console.clear(); // Limpia la pantalla antes de mostrar el menú

function mostrarMenu() {
    console.log("\nMenú de Opciones:");
    console.log("1: Crear todas las tablas");
    console.log("2: Crear la tabla usuarios");
    console.log("3: Crear la tabla tipos de NAS");
    console.log("4: Crear el usuario admin");
    console.log("5: Borrar la tabla usuarios");
    console.log("Seleccione una opción: ");
}

mostrarMenu();

// Abre la entrada estándar
const stdin = process.openStdin();

// Escucha los datos ingresados
stdin.addListener("data", (data) => {
    const opcionSeleccionada = parseInt(data.toString().trim());

    switch (opcionSeleccionada) {
        case 1:
            console.log("Creando todas las tablas...");
            upUsers();
            upTipeNAS();
            break;
        case 2:
            console.log("Creando la tabla usuarios...");
            upUsers();
            break;
        case 3:
            console.log("Creando la tabla tipos de NAS...");
            upTipeNAS();
            break;
        case 4:
            console.log("Creando el usuario admin...");
            admin()
            break;
        case 5:
            console.log("Borrando la tabla usuarios...");
            downUsers()
            break;
        default:
            console.log("Opción no válida. Por favor, seleccione una opción del menú.");
            mostrarMenu();
    }
});

stdin.addListener("close", () => {
    console.log("Saliendo del programa...");
    process.exit(0);
});