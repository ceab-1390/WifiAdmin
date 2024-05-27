const pool = require('./db');
const Logguer = require('../logguer/logger');
const fs = require('fs');



async function create(){
    let i = 0
    let direccion = fs.readFileSync('public/venezuela.json','utf8')
    direccion = JSON.parse(direccion);

    console.log(direccion[0].estado)
    direccion.forEach( (estado) => {
        pool.query('INSERT INTO censo.estado(capital,pais_id,estado) VALUES($1,190,$2) RETURNING id_estado;',[estado.capital,estado.estado]).then(
            (result)=>{
                let id_estado = result.rows[0].id_estado
                estado.municipios.forEach(
                    (municipio) =>{
                        pool.query('INSERT INTO censo.municipio(estado_id,municipio) VALUES($1,$2) RETURNING id_municipio',[id_estado,municipio.municipio]).then((result)=>{
                            let id_municipio = result.rows[0].id_municipio;
                            municipio.parroquias.forEach((parroquia)=>{
                                pool.query('INSERT INTO censo.parroquia(municipio_id,parroquia) VALUES($1,$2) RETURNING id_parroquia',[id_municipio,parroquia]).then((result)=>{
                                    console.log(i++)
                                })
                            })
                        })
                    }
                )
            });
    });
        console.log('end')
}

create()