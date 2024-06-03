require('dotenv').config()
const {WebSocket} = require('ws'); 
const {v4: uuidv4} = require('uuid');
const Logger = require('../logguer/logger');
// const emisor = require('events');
// class emitComand extends emisor {};
// const sendComand = new emitComand();

const socket = new WebSocket.Server({port: process.env.WS_PORT},()=>{
    Logger.log('WebSocket start on '+process.env.WS_PORT)
})

const clients = {};
const comand = {};

socket.on('connection', (ws,req) =>{
    const clientId = uuidv4();
    clients[clientId] = ws;
    Logger.log('Nueva conexion '+ clientId);
    ws.on('close', ()=>{
        delete clients[clientId]
        Logger.info('Conexion del cliente ' +clientId+' cerrada');
    });
    ws.on('message', data =>{
        data = JSON.parse(data);
        switch (data.type){
            case 'helo':
                clients[clientId].path = data.path
                clients[clientId].id = clientId
                if(data.path == '/home'){
                    process.emit('homeData', {clientId})
                }
            break;
            case 'command':
                process.emit('command',data);
            break;
        }
    });
    ws.onerror = function (){
        Logger.log('Error ws')
    }
});   



module.exports = {socket,clients}