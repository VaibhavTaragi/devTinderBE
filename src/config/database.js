const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://vaibhav:Vaibhav%407@cluster0.eogwszk.mongodb.net/devTinder")
}

module.exports=connectDB