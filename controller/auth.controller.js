const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const users = require("../model/users.model");
//authentication
router.get("/login", (req, res) => {
    res.render("login.ejs");
});

// local login
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await users.findOne({ username: username });
            if (!user) {
                return done(null, false);
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result == true) {
                        return done(null, user)
                    } else {
                        return done(null, false);
                    }
                });
            }
        } catch (err) {
            console.log(err)
        }
    }
));

passport.serializeUser((user,done) => {
     return done(null, user.id);
});

passport.deserializeUser(async (id,done) => {
      const user = await users.findById({_id:id});
      if(user){ 
          return done(null,user);
      } else{
          return done(null,false);
      }
});
//---------------------------------------------------------------------------------------


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: "Invalid username or password"
}));


//----------------------------------------------------------------------------------------

//log out 
router.get('/logout', function(req, res){
    req.session.destroy(function (err) {
        res.redirect('/login'); 
      });
  });

// register user
router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", (req, res) => {
    const newUser = new users({
        email: req.body.email,
        username: req.body.name,
        password: req.body.password,
        notes_id: [],
    });
    bcrypt.hash(newUser.password, 10, async (err, hash) => { //hash password
        try {
            newUser.password = hash
            const save = await newUser.save();
            res.redirect("/login");
        } catch (err) {
            console.log(err); 

        }
    });
});

module.exports = router;