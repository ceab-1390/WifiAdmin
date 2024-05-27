require('dotenv').config()
const jwt = require('jsonwebtoken');
const {User} = require('../models/userLoginModel');
const Logguer = require('../logguer/logger');



module.exports.loguedIn = async (req,res,next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).render('login',{
                    alert:true,
                    alertTitle: 'Advertneccia',
                    alertMessage: 'No autorizado, por favor inicie sesion',
                    alertIcon: 'error',
                    showConfirmButton: true,
                    ruta: '',
                    layout: false
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const validUser = await User.findOne(decoded.user);
        if (validUser.id === decoded.id){
            req.user = {}//validUser.user;
            req.user.user = validUser.username;
            req.user.name = validUser.nombre;
            req.user.lastname = validUser.apellido;
            req.user.admin = validUser.admin;
            next();
        }else{
            return res.status(401).redirect('/')
        }
    } catch (error) {
        return res.status(403).redirect('/')
    }

}