require("dotenv").config();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");


const studentSchema = mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    collegename:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    conpassword:{
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
});

studentSchema.methods.generateAuthToken = async function(){
    try{
        const token = await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        // console.log(token);
        return token;
    }
    catch(error){
        console.log("the error part is "+error);
        return("the error part is "+error);
    }
}

studentSchema.pre("save", async function(next){
    if(this.isModified("password")){
        // console.log(`before hashed ${this.password}`);
        this.password = await bcryptjs.hash(this.password,10);
        this.conpassword = this.password;
        // console.log(`before hashed ${this.password}`);
        // this.conpassword=undefined;
    }

    next();
});

const Register = new mongoose.model("Register",studentSchema);
module.exports = Register;