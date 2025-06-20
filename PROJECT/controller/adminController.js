const adminModal=require('../model/adminModel');
const bcrypt=require('bcrypt');
const userModel=require('../model/userModel');
const loadLogin=async(req,res)=>{
    res.render('admin/login',{message:req.session.error});
}
const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const admin=await adminModal.findOne({email});
        req.session.error='Invalid credentials'
        if(!admin) return res.redirect('/admin/login');
        const isMatch=await bcrypt.compare(password,admin.password);
        
        if(!isMatch) return res.redirect('/admin/login');
        req.session.error=''
        req.session.admin=true;
        res.redirect('/admin/dashboard');
    }
    catch(error){
       console.error(error);
    }
}
const loadDashboard=async (req,res)=>{
   try{
      const admin=req.session.admin;
      if(!admin) return res.redirect('/admin/login');
      const users= await userModel.find({});
      res.render('admin/dashboard',{users});
   }
   catch(error){
    console.log(error);
   }
}
const searchUsers = async (req,res) => {
   try{
    const query=req.query.query;
    const users=await userModel.find({
        $or:[
            {name:new RegExp(query,'i')},
            // {email:new RegExp(query,'i')},
        ]
    })
    res.render('admin/dashboard',{users})
    }
    catch(error){
    console.error(error);
    res.status(500).send("An error occured while searching")
    }
 }
 const deleteUser=async (req,res)=>{
    try{
        await userModel.findByIdAndDelete(req.params.id);
        res.redirect('/admin/dashboard');
    }catch(error){
        res.status(500).send("Error deleting user")
    }
 }
const editUser= async (req,res)=>{
    try{
      const user=await userModel.findById(req.params.id);
      if(!user) return res.status(404).send('User not find')
        res.render('admin/editUser',{user})
    }
    catch(error){
       res.status(500).send("Error loadin edit form")
    }
}
const editUserForm = async (req,res)=>{
    try{
        
        const {name,email}=req.body;
        const exitemail= await userModel.findOne({email});
        if(exitemail){
            req.session.edit='user already exists';
        return res.redirect('/admin/dashboard')
        }
        await userModel.findByIdAndUpdate(req.params.id,{name,email});
        res.redirect('/admin/dashboard');
    }
    catch(error){
        console.log(error)
        res.status(500).send("Error updating user data")
    }
}   
const addform= async (req,res)=>{
    try{
      res.render('admin/addUser',{message:req.session.add})
      req.session.add=''
    }catch(error){
      console.log(error)
    }
}
const adduser= async (req,res)=>{
    try{
       const {name,email,password}=req.body;
       const exitemail= await userModel.findOne({email});
       if(exitemail){
        req.session.add='user already exists';
        return res.redirect('/admin/addUser')
       
       }
       const hash= await bcrypt.hash(password,10);
       const newuser= new userModel({
        name,email,password:hash
       })
       await newuser.save()
       res.status(201,{message:"user create success"})
       res.redirect('/admin/dashboard')
      
    }
    catch(error){
        console.log(error)
    }
}

const isLogout = async(req,res)=>{
    req.session.admin=false;
    res.redirect('/admin/login');
}

module.exports={loadLogin,login,loadDashboard,searchUsers,deleteUser,editUser,editUserForm,isLogout,addform,adduser};
