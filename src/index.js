const express = require ('express')
const mongoose = require ('mongoose')
const path = require("path")
const bcrypt = require("bcrypt")
const collection = require("./config")


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine','ejs');

app.use(express.static("public"));
app.get("/",(req,res) => {
        res.render("login");

})
app.get("/signup",(req,res) => {
    res.render("signup");
})

app.post("/signup",async (req,res) => {
            const data = {
                name : req.body.UserName,
                password : req.body.password
            }
            const existingUser = await collection.findOne({name : data.name})

            if(existingUser){
                res.send("User exists,try another name");
            }
            else {
                const saltRounds = 10;
                const hashPassword = await bcrypt.hash(data.password,saltRounds);

                data.password = hashPassword;

                const userdata = await collection.insertMany(data);
                console.log(userdata);
            }
           
});

app.post("/login",async (req,res) => {
    try{
        const check = await collection.findOne({name : req.body.UserName});
        if(!check){
            res.send("username not found")
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password,check.password);
        if(isPasswordMatch) {
            res.render("home");
        }
        else{
            res.send("wrong password");
        }
    }
    catch{
            res.send("wrong details");
    }
})


const port = 5000;
app.listen (port,() => {
    console.log (`Server running at Port : ${port}`);
})
