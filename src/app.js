require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;
require("./db/conn");
const path = require("path");
const Register = require("./models/registers");
const bcrypt = require("bcryptjs");

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

console.log(process.env.SECRET_KEY);
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    // res.send("hello from rohit");☻
    res.render("home");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

// const securePassword = async (password)=>{
    // const hashedPassword = await bcrypt.hash(password,10);
    // console.log(hashedPassword);
    // console.log(matchPassword);
    // return hashedPassword;
// }
// const matchPassword = async (password,hashedPassword)=>{
//     const matchPassword = await bcrypt.compare(password,hashedPassword);
//     return matchPassword;
// }
// const ans = securePassword("rohit");
// console.log(ans);
// ans.then((result)=>{console.log(result)});
// const res = matchPassword("rohit",ans);

app.post("/register", async (req,res)=>{
    try{
        const password = req.body.password;
        const conpassword = req.body.conpassword;

        if(password == conpassword){

            const registerStudent = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                collegename: req.body.collegename, 
                email: req.body.email,
                phone: req.body.phone,
                password: password,
                conpassword: conpassword
            });

            const token = await registerStudent.generateAuthToken();
            console.log("token getnerated is : "+token);
            const registered = await registerStudent.save();
            res.status(201).render("home");
        }
        else{
            // console.log(password);
            // console.log(conpassword);
            res.send("password doesn't match");
        }
    }
    catch(err){
        res.status(400).send("this is errr"+err);
    }
});

// check for log in
app.get("/login",(req,res)=>{
    res.render("login");
});
app.post("/login", async (req,res)=>{

    try{
        const username = req.body.username;
        const password = req.body.password;
        // console.log(username);
        // console.log(password);
        const userInfo = await Register.findOne({username: username});
        // console.log(userInfo);
        
        const isMatch = await bcrypt.compare(password,userInfo.password);
        const token = await userInfo.generateAuthToken();
        console.log("token getnerated during log in is : "+token);
        // console.log(isMatch);
        if(isMatch){
            res.render("home");
        }
        else{
            res.send("Invalid Log in details");
        }
    }
    catch(err){
        res.status(400).send("Invalid Log in Details");
    }
});


app.listen(port,()=>{console.log(`Server is running on port no : ${port}`)});