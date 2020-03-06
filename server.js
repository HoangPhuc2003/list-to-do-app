const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const passport = require("passport");
const session = require("express-session");


const notesController = require("./controller/notes.controller");
const authController = require("./controller/auth.controller");


mongoose.connect('mongodb://localhost/myDatabase', {useNewUrlParser: true,useUnifiedTopology: true}, function(err){
    if(!err){
        console.log("connect database successful");
    } else{
        console.log("Erorr"+err);
    }
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(session({
    secret:"iloveprograming",
    resave:false,
    saveUninitialized:true,
    cookie: {
        maxAge: 1000 * 50 * 5555555
    }
}));
app.use(express.static("./public"))
app.set("views","./views");
app.set("view engine","ejs");

app.use(passport.initialize());
app.use(passport.session());


app.use("/",notesController);
app.use("/", authController);
app.listen(3000);


