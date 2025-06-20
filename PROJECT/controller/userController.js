const userSchema=require('../model/userModel')
const bcrypt=require('bcrypt')
const saltround=10
const loadRegister=async (req,res)=>{
    await res.render('user/register',{message:req.session.err});
    req.session.err="";
    
 }
 const loadLogin= async (req,res)=>{
    await res.render('user/login',{message:req.session.errr});
     req.session.errr="";
 }
const registerUser=async(req,res)=>{
    try{
       const{name,email,password}=req.body;
       const user=await userSchema.findOne({email})
       if(user){
        req.session.err="user already exists";
        return res.redirect('/user/register')
       }
       const hashedPassword=await bcrypt.hash(password,saltround)
       const newUser=new userSchema({
        name,
        email,
        password:hashedPassword
       })
       await newUser.save()
       req.session.errr='user created successfully'
       res.redirect('/user/login')
    }
    catch(error){
        
        req.session.err="Something went wrong";
       res.redirect('/user/register')
    }
}
const isLogout=(req,res)=>{
    req.session.user =false;
    res.redirect('/user/login')
}

const login=async(req,res)=>{
    try{
       const {email,password}=req.body;
       req.session.errr='';
       const user=await userSchema.findOne({email});
       req.session.name = user.name;
       req.session.errr="user does not exist";
       if(!user) return res.redirect('/user/login')
        const isMatch=await bcrypt.compare(password,user.password)
       req.session.errr='Incorrect password';
       if(!isMatch) return res.redirect('/user/login')
        req.session.errr='';
        req.session.user=true;
       res.redirect('/user/home');
    }
    catch(error){
        req.session.errr='Something went wrong'
       res.redirect('/user/login');
       req.session.errr='';
    }
}

const loadhome = async (req, res) => {
    try {
        const userData = await userSchema.findOne({ name: req.session.name });
        if (!userData) {
            return res.redirect('/user/login'); 
        }
        res.render('user/userhome', { userData });
    } catch (error) {
        console.error(error);
        res.redirect('/user/login'); 
    }
};

module.exports={registerUser,loadRegister,loadLogin,login,loadhome,isLogout}