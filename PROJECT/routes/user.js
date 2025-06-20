const express=require('express');
const router=express.Router()
const userController=require('../controller/userController')
const auth=require('../middleware/auth')
router.get('/login',auth.isLogin,userController.loadLogin)
router.get('/register',auth.isLogin,userController.loadRegister)
router.post('/login',userController.login)
router.post('/register',userController.registerUser)
router.get('/home',auth.checkSession,userController.loadhome)
router.get('/logout',auth.checkSession,userController.isLogout)
module.exports=router;
