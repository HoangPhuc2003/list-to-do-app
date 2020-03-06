const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const notes = require("../model/notes.model");
const users = require("../model/users.model");


function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        //req.isAuthenticated() will return true if user is logged in
        return next();
    } else {
        res.redirect("/login");
        return;
    }
}

router.get("/", checkAuthentication, async (req, res) => {
    try {
        const user = await users.findOne({_id:req.session.passport.user}).populate({path:"notes_id"});
        res.render("index", {
            notesList: user.notes_id
        })
    } catch (err) {
        console.log(err);

    }
});

router.get("/add", checkAuthentication, (req, res) => {
    res.render("add", { errors: [] });
});

// create new note
router.post("/add", [
    check('content', 'details is require').notEmpty()
], checkAuthentication, async (req, res) => {
    var newNote = new notes({
        name: req.body.name,
        content: req.body.content,
        date: Date.now()
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("add", {
            errors: errors.array()
        })
    }
    if (!req.body.name) {
        newNote.name = "không có tiêu đề";
    }

    try {
        const saveNote = await newNote.save();
        const user = await users.findOneAndUpdate({ _id: req.session.passport.user }, { $push: { notes_id: saveNote._id } }) //update notes_id in user collection
    } catch (err) {
        console.log("Erorr" + err);
    }
    res.redirect("/");
});
//------------------------------------------------------------------------------

// update one note
router.get("/edit/:id", checkAuthentication, async (req, res) => {
    const note = await notes.findById({ _id: req.params.id });
    res.render("edit", {
        note: note
    });
});

router.post("/edit/:id", checkAuthentication, async (req, res) => {
    try {
        const updateNote = await notes.findByIdAndUpdate({ _id: req.params.id }, req.body);
        res.redirect("/");
    } catch (err) {
        console.log("Erorr" + err);
    }

})
//-----------------------------------------------------------------


// delete one note
router.get("/delete/:id", checkAuthentication, async (req, res) => {
    try {
        const deleteNote = await notes.findByIdAndDelete({ _id: req.params.id });
        const user = await users.findOneAndUpdate({ _id: req.session.passport.user }, { $pull: { notes_id: req.params.id } })
        res.redirect("/");
    } catch (err) {
        console.log("Erorr" + err);

    }
});



module.exports = router;