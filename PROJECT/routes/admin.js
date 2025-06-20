const express=require('express');
const router=express.Router()
const adminController=require('../controller/adminController')
const adminAuth=require('../middleware/adminAuth')
router.get('/login',adminAuth.isLogin,adminController.loadLogin)
router.post('/login',adminController.login);
router.get('/dashboard',adminAuth.checkSession,adminController.loadDashboard)
router.get('/search',adminAuth.checkSession,adminController.searchUsers)
router.get('/delete/:id',adminController.deleteUser)
router.get('/edit/:id',adminAuth.checkSession,adminController.editUser)
router.post('/edit/:id',adminController.editUserForm)
router.get('/addUser',adminAuth.checkSession,adminController.addform)
router.post('/addUser',adminController.adduser)
router.get('/logout',adminAuth.checkSession,adminController.isLogout)
module.exports=router; 