 const Logguer = require('../logguer/logger');
const {Nas,RadCheck,Audit} = require('../models/radiusModel');
const md5 = require('md5');
const crypto = require('crypto');
const { title } = require('process');


 module.exports.showNas = async (req,res) => {
    const allNas = await Nas.showNas();
    const nasTypes = await Nas.nasTypes();
    res.render('radius/showNas',{title:'Equipos Registrados',alert:false,user:req.user,allNas,nasTypes});
 };

 module.exports.createNas = async (req,res) => {
   const allNas = await Nas.showNas();
   const nasTypes = await Nas.nasTypes();
   let data = req.body
   data.ports ? '' : data.ports = null;
   const validate = await Nas.validateIp(data.nasname);
   if (!validate){
     const newDevice = await Nas.createDevice(data);
      if (newDevice){
         res.render('radius/showNas',{
            title:'Equipos Registrados',
            alert:true,
            alertTitle: 'Exito!!!',
            alertMessage: 'Registro exitoso',
            alertIcon: 'success',
            showConfirmButton: true,
            ruta: 'showNas',
            user:req.user,
            allNas,
            nasTypes
         });
      }else{
         res.render('radius/showNas',{
            title:'Equipos Registrados',
            alert:true,
            alertTitle: 'Eroor!!!',
            alertMessage: 'Ocurrio un error al guardar los datos!',
            alertIcon: 'error',
            showConfirmButton: true,
            ruta: 'showNas',
            user:req.user,
            allNas,
            nasTypes
         });
      }
   }else{
      res.render('radius/showNas',{
         title:'Equipos Registrados',
         alert:true,
         alertTitle: 'Eroor!!!',
         alertMessage: 'La ip ya esta registrada',
         alertIcon: 'error',
         showConfirmButton: true,
         ruta: 'showNas',
         user:req.user,
         allNas,
         nasTypes
      });
   }

 }

 module.exports.editNas = async (req,res) => {
   const allNas = await Nas.showNas();
   const nasTypes = await Nas.nasTypes();
   let data = req.body
   data.ports ? '' : data.ports = null
   const validate = await Nas.validateIp(data.nasname);
   async function register(data,req,res){
      const editDevice = await Nas.editDevice(data);
      if (editDevice){
         res.render('radius/showNas',{
            title:'Equipos Registrados',
            alert:true,
            alertTitle: 'Exito!!!',
            alertMessage: 'Registro exitoso',
            alertIcon: 'success',
            showConfirmButton: true,
            ruta: 'showNas',
            user:req.user,
            allNas,
            nasTypes
         });
      }else{
         res.render('radius/showNas',{
            title:'Equipos Registrados',
            alert:true,
            alertTitle: 'Eroor!!!',
            alertMessage: 'Ocurrio un error al guardar los datos!',
            alertIcon: 'error',
            showConfirmButton: true,
            ruta: 'showNas',
            user:req.user,
            allNas,
            nasTypes
         });
      }
   }
   if (!validate){
      register(data,req,res);
   }else if(data.id != validate){
      res.render('radius/showNas',{
         title:'Equipos Registrados',
         alert:true,
         alertTitle: 'Eroor!!!',
         alertMessage: 'La ip ya esta registrada',
         alertIcon: 'error',
         showConfirmButton: true,
         ruta: 'showNas',
         user:req.user,
         allNas,
         nasTypes
      });
   }else{
      register(data,req,res);
   }
 };

 module.exports.deleteNas = async (req,res) => {
   let id = req.params.id;
   let delNas = await Nas.deleteOne(id)
   if (delNas){
       res.json({deleted:true});
   }else{
       res.json({deleted:false});
   }
 }

module.exports.showradcheck = async (req,res) => {
   let page = req.params.page , size = 10;
   page = (page <= 0)? 1 : page;
   const show = await RadCheck.show(page,size); 
   const pages = Math.ceil(show.total_pages.rows[0].count / size);
   if(show.pagination_data.rows.length != 0 ){
      res.render('radius/showUsersRadius',{title:'Usuarios Registrados',alert:false,user:req.user,show:show.pagination_data.rows,pages,page})
   }else{
      page = 1
      res.render('radius/showUsersRadius',{
         title:'Usuarios registrados',
         alert:true,
         user:req.user,
         alertTitle: 'Error!!!',
         alertMessage: 'No se encontraron mas paginas',
         alertIcon: 'error',
         showConfirmButton: true,
         ruta: 'usersRadius/1',
         show:show.pagination_data.rows,
         pages,
         page
      });
   }
}

module.exports.radcheckCreate = async (req,res) => {
   let page = 1 , size = 10;
   page = (page <= 0)? 1 : page;
   const show = await RadCheck.show(page,size); 
   const pages = Math.ceil(show.total_pages.rows[0].count / size);
   let data = req.body
   //data.value = md5(req.body.value);
   data.attribute = 'Cleartext-Password'
   data.op = ':=';
   data.session_timeout == '' ? data.session_timeout = null : data.session_timeout = data.session_timeout * 60;
   console.log(data.session_timeout);
   const validate = await RadCheck.validateUser(data.username);
   if (!validate){
      const register = await RadCheck.createOne(data);
      if(register){
         res.render('radius/showUsersRadius',{
            title:'Usuarios Registrados',
            alert:true,
            user:req.user,
            alertTitle: 'Exito!!!',
            alertMessage: 'Registro exitoso',
            alertIcon: 'success',
            showConfirmButton: true,
            ruta: 'usersRadius/1',
            show:show.pagination_data.rows,
            page,
            pages
         })
      }else{
         res.render('radius/showUsersRadius',{
            title:'Usuarios Registrados',
            alert:true,
            user:req.user,
            alertTitle: 'Error!!!',
            alertMessage: 'No se guardo el registro',
            alertIcon: 'error',
            showConfirmButton: true,
            ruta: 'usersRadius/1',
            show:show.pagination_data.rows,
            page,
            pages
         })
      }
   }else{
      res.render('radius/showUsersRadius',{
         title:'Usuarios Registrados',
         alert:true,
         user:req.user,
         alertTitle: 'Error!!!',
         alertMessage: 'Usuario ya existe!!!',
         alertIcon: 'error',
         showConfirmButton: true,
         ruta: 'usersRadius/1',
         show:show.pagination_data.rows,
         page,
         pages
      })
   }
};

module.exports.radcheckEdit = async (req,res) => {
   let page = req.params.page , size = 10;
   const show = await RadCheck.show(page,size); 
   const pages = Math.ceil(show.total_pages.rows[0].count / size);
   let data = req.body
   //data.value = md5(req.body.value);
   data.attribute = 'Cleartext-Password'
   data.session_timeout == '' ? data.session_timeout = null : data.session_timeout = data.session_timeout * 60;
   console.log(data.session_timeout);
   async function edit(req,res,data){
      const register = await RadCheck.editOne(data);
      if(register){
         res.render('radius/showUsersRadius',{
            title:'Usuarios Registrados',
            alert:true,
            user:req.user,
            alertTitle: 'Exito!!!',
            alertMessage: 'Registro exitoso',
            alertIcon: 'success',
            showConfirmButton: true,
            ruta: 'usersRadius/'+page,
            show:show.pagination_data.rows,
            page,
            pages
         })
      }else{
         res.render('radius/showUsersRadius',{
            title:'Usuarios Registrados',
            alert:true,
            user:req.user,
            alertTitle: 'Error!!!',
            alertMessage: 'No se guardo el registro',
            alertIcon: 'error',
            showConfirmButton: true,
            ruta: 'usersRadius/'+page,
            show:show.pagination_data.rows,
            page,
            pages,
         })
      }
   }
   const validate = await RadCheck.validateUser(data.username);
   if (!validate){
      edit(req,res,data)
   }else if(validate != data.id){
      res.render('radius/showUsersRadius',{
         title:'Usuarios Registrados',
         alert:true,
         user:req.user,
         alertTitle: 'Error!!!',
         alertMessage: 'Usuario ya existe!!!',
         alertIcon: 'error',
         showConfirmButton: true,
         ruta: 'usersRadius/'+page,
         show: show.pagination_data.rows,
         page,
         pages
      })
   }else{
      edit(req,res,data)
   }

}

module.exports.radcheckDelete = async (req,res) => {
   let id = req.params.id;
   let delUser = await RadCheck.deleteOne(id)
   if (delUser){
       res.json({deleted:true});
   }else{
       res.json({deleted:false});
   }
}


module.exports.showAudit = async (req,res) => {
   let  page = req.params.page,size = 10
   page = (page <= 0)? 1 : page;
   const audit = await Audit.show(page,size);
   const pages = Math.ceil(audit.total_pages.rows[0].count / size);
   if(audit.pagination_data.rows.length != 0 ){
      res.render('radius/showAudit',{title:'Auditoria',alert:false,user:req.user.user,show:audit.pagination_data.rows,page,pages});
      //res.json(audit.pagination_data.rows)
   }else{
      page = 1
      res.render('radius/showAudit',{
         title:'Auditoria',
         alert:true,
         user:req.user,
         alertTitle: 'Error!!!',
         alertMessage: 'No se encontraron mas paginas',
         alertIcon: 'error',
         showConfirmButton: true,
         ruta: 'auditRadius/1',
         show:audit.pagination_data.rows,pages,
         page
      });
   }
}
module.exports.showAuditPage = async (req,res) => {

}