const {User} = require('../models/userLoginModel');
const Logguer = require('../logguer/logger')
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports.index = (req,res) =>{
    let user = req.user
    res.status(200).clearCookie('authToken')
    res.render('login',{layout:false,alert:false,user});
}

module.exports.logIn = async (req,res) => {
    if (req.body.user == '' && req.body.password == ''){
        res.render('login',{
            alert:true,
            alertTitle: 'Advertnencia',
            alertMessage: 'Debe ingresar los datos',
            alertIcon: 'error',
            showConfirmButton: true,
            ruta: '',
            layout: false
        });
    }else{
        const userLogin = await User.findOne(req.body.user).then((U) =>{
        if (!U){
            res.render('login',{
                alert:true,
                alertTitle: 'Advertnencia',
                alertMessage: 'Usuario no valido',
                alertIcon: 'error',
                showConfirmButton: true,
                ruta: '',
                layout: false
            })
            //res.json({success: false, error: 'No exioste el usuario'}).redirect('/');
        }else{
            const compare = Bcrypt.compareSync(req.body.password , U.password)
            if (!compare){
                res.render('login',{
                    alert:true,
                    alertTitle: 'Advertnencia',
                    alertMessage: 'Clave erronea',
                    alertIcon: 'error',
                    showConfirmButton: true,
                    ruta: '',
                    layout: false
                })
            }else{
                const token = jwt.sign({id: U.id, user: U.username}, process.env.SECRET, { expiresIn: '1d' });
                res.status(200).cookie('authToken',token ).redirect('/home');
            }
        }
    }).catch(err => {
        Logguer.error(err);
    })
    }
};

module.exports.logOut = (req,res) =>{
    res.status(200).clearCookie('authToken').redirect('/');
};