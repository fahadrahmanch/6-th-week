const mongoose=require("mongoose");
const connectDB=async()=>{
   
    try{
        const conn =await mongoose.connect('mongodb://localhost:27017/PROJECT',{});
   
    }catch(error){
        console.log(error);
        process.exit(1)
    }
}
module.exports=connectDB;  