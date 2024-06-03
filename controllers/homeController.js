const Logger = require('../logguer/logger');
let {socket,clients} = require('./ws');
const {Nas} = require('../models/radiusModel');
var ping = require('ping');
let homestart = true;


module.exports.index = async (req,res) => {
    const test_url = process.env.TEST_URL
    let user = req.user;
    const nasClients = await Nas.showNas();
    res.render('home',{title:'home',alert: false,user, nasClients,test_url})
}



process.on('homeData',async (data) =>{
  if(homestart){
    let i = 0
    //Logger.log(data)
    const nasClients = await Nas.showNas();

    while(true){
      if (Object.values(clients).length == 0){
        homestart = true;
        break
      }
      nasClients.forEach(nas =>{
        ping.sys.probe(nas.nasname, function(isAlive){
          var msg = isAlive ? {nas:nas.nasname,status:true} : {nas:nas.nasname,status:false};
          Object.values(clients).forEach(client => {
            client.send(JSON.stringify(msg))
          });
        });
      })
      homestart = false
      await new Promise(resolve => setTimeout(resolve,2000))
    } 
  }
});



