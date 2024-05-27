const Bcrypt = require('bcryptjs');
const {User} = require('../models/userLoginModel');
const Logguer = require('../logguer/logger')

module.exports.createOne = async (req,res) =>{
    if(req.body.admin == undefined){
        req.body.admin = false;
    }
   // Logguer.log(req.body)

    let data = req.body
    data.password = data.password[0];
    data.password = Bcrypt.hashSync(data.password, 10);
    let validateUser = await User.validate(data.username);
    if(validateUser){
        let users = await User.getAll(); 
        let user = req.user;
        res.render('gestionarUsuarios',{
            title: 'Usuarios del sistema',
            alert: true,
            alertTitle: 'Advertneccia',
            alertMessage: 'El usuario ya existe en los registros',
            alertIcon: 'error',
            showConfirmButton: true,
            ruta: 'usersManage',
            users,
            user
        });
    }else{
        let users = await User.getAll(); 
        let saveUser = await User.createOne(data);
        let user = req.user;
        if (saveUser){
            res.render('gestionarUsuarios',{
                title: 'Usuarios del sistema',
                alert:true,
                alertTitle: 'Advertnencia',
                alertMessage: 'Registro exitoso',
                alertIcon: 'success',
                showConfirmButton: true,
                ruta: 'usersManage',
                users,
                user
            }); 
        }else{
            let users = await User.getAll(); 
            let user = req.user
            res.render('gestionarUsuarios',{
                title: 'Usuarios del sistema',
                alert: true,
                alertTitle: 'Advertnencia',
                alertMessage: 'Ocurrio un problema al guardar los datos',
                alertIcon: 'error',
                showConfirmButton: true,
                ruta: 'usersManage',
                users,
                user
            });
        }
   
    }
 
};

module.exports.manage = async (req,res) => {
    let users = await User.getAll(); 
    let user = req.user
    res.render('gestionarUsuarios',{title:'Usuarios del sistema',alert:false,users,user})
};

module.exports.editOne = async (req,res) => {
    if(req.body.admin == undefined){
        req.body.admin = false;
    }
    let data = req.body
    data.password = data.password[0];
    data.password = Bcrypt.hashSync(data.password, 10);
    let validateUser = await User.validateId(data.username);
    if(validateUser && validateUser.id != data.id){
        let users = await User.getAll(); 
        let user = req.user;
        res.render('gestionarUsuarios',{
            title: 'Usuarios del sistema',
            alert: true,
            alertTitle: 'Advertnencia',
            alertMessage: 'El usuario ya existe en los registros',
            alertIcon: 'error',
            showConfirmButton: true,
            ruta: 'usersManage',
            users,
            user
        });
    }else{
        let users = await User.getAll(); 
        let updateUser = await User.editOne(data);
        let user = req.user;
        if (updateUser){
            res.render('gestionarUsuarios',{
                title: 'Usuarios del sistema',
                alert:true,
                alertTitle: 'Exito!!!',
                alertMessage: 'Registro exitoso',
                alertIcon: 'success',
                showConfirmButton: true,
                ruta: 'usersManage',
                users,
                user
            }); 
        }else{
            let users = await User.getAll(); 
            let user = req.user
            res.render('gestionarUsuarios',{
                title: 'Usuarios del sistema',
                alert: true,
                alertTitle: 'Advertnencia',
                alertMessage: 'Ocurrio un problema al guardar los datos',
                alertIcon: 'error',
                showConfirmButton: true,
                ruta: 'usersManage',
                users,
                user
            });
        }
    }
}

module.exports.deleteOne = async (req,res) => {
    let id = req.params.id;
    let delUser = await User.deleteOne(id)
    if (delUser){
        res.json({deleted:true});
    }else{
        res.json({deleted:false});
    }
}

module.exports.editPassword = async (req,res) => {
    const user = req.user;
    let data = req.body
    data.password = data.password[0];
    data.password = Bcrypt.hashSync(data.password, 10);
    const setPass = await User.editPass(data)
    if(setPass){
        res.render('home',{
            title: 'home',
            alert:true,
            alertTitle: 'Exito!!!',
            alertMessage: 'Cambio de clave exitoso',
            alertIcon: 'success',
            showConfirmButton: true,
            ruta: 'home',
            user
        });  
    }else{
        res.render('home',{
            title: 'home',
            alert:true,
            alertTitle: 'Error!!!',
            alertMessage: 'Cambio de clave no exitoso',
            alertIcon: 'error',
            showConfirmButton: true,
            ruta: 'home',
            user
        });  
    }
}