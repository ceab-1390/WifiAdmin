 const {Radius} = require('../models/radiusModel');


 module.exports.showNas = async (req,res) => {
    const allNas = await Radius.showNas();
    res.render('radius/showNas',{title:'Equipos Registrados',alert:false,user:req.user.user,allNas});
 }

