const Logguer = require('../logguer/logger');
const {User} = require('../models/userLoginModel');


module.exports.check = async (req,res,next) =>{

    let user = await User.findOne(req.user.user);
    let isAdmin = user.admin
    if (isAdmin) {
        next()
    }else{
        return res.status(401).render('home',{
            title: 'Home',
            alert:true,
            alertTitle: 'Advertneccia',
            alertMessage: 'No autorizado, por favor contecte al administrador del sistema',
            alertIcon: 'error',
            showConfirmButton: true,
            ruta: 'home',
            user
});
    }   
}