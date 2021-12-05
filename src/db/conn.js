const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/collegeRegistration")
.then(()=>{console.log("Connection Successfull")})
.catch((err)=>{console.log("Connection failed")});
