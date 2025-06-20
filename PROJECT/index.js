const express=require("express")
const app=express();
const userrouter=require('./routes/user.js')
const adminrouter=require('./routes/admin.js')
const path =require('path')
const session=require('express-session');
const nocache=require('nocache');
const connectDB = require('./db/connectDb');
app.use(nocache());
app.set('views',path.join(__dirname,'views'))
app.set('view engine','hbs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
    name:'session',
    secret:'key',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:500000000*10,
        secure:false
    },
}))
app.use('/user',userrouter);
app.use('/admin',adminrouter);
connectDB();

app.listen(3000,(err)=>{
    console.log('server is running')
    
})