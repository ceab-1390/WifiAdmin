const router = require('express').Router();
const homeController = require('../controllers/homeController')
const loginController = require('../controllers/loginController')
const userController = require('../controllers/userController');
const midleware = require('../midlewares/auth');
const isAdmin = require('../midlewares/isAdmin');
const radiusController = require('../controllers/radiusController');

router.get('/',loginController.index);
router.post('/login',loginController.logIn);
router.get('/logout',loginController.logOut);
router.get('/home', midleware.loguedIn,homeController.index);
router.get('/usersManage',midleware.loguedIn,isAdmin.check,userController.manage);
router.post('/usersManage',midleware.loguedIn,isAdmin.check,userController.createOne);
router.post('/usersManageEdit',midleware.loguedIn,isAdmin.check,userController.editOne);
router.post('/usersManageDelete/:id',midleware.loguedIn,isAdmin.check,userController.deleteOne);
router.post('/userChangePassword',midleware.loguedIn,userController.editPassword);
//router.get('/user',userController.createOne);

//radius gestion routes
router.get('/showNas',midleware.loguedIn,radiusController.showNas);
router.post('/showNas/create',midleware.loguedIn,radiusController.createNas);
router.post('/showNas/edit',midleware.loguedIn,radiusController.editNas);
router.post('/nasDelete/:id',midleware.loguedIn,radiusController.deleteNas);

//radius gestions usuarios radcheck
router.get('/usersRadius/:page',midleware.loguedIn,radiusController.showradcheck);
router.post('/userRadius/create',midleware.loguedIn,radiusController.radcheckCreate);
router.post('/userRadius/edit/:page',midleware.loguedIn,radiusController.radcheckEdit);
router.post('/userRadius/delete/:id',midleware.loguedIn,radiusController.radcheckDelete);

//radius audit
router.get('/auditRadius/:page',midleware.loguedIn,radiusController.showAudit);
router.get('/auditRadius',midleware.loguedIn,radiusController.showAuditPage);




module.exports = router;