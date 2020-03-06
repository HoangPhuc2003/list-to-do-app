const mongoose = require("mongoose");
const schema = mongoose.Schema;


const notes = require("./notes.model");

const userSchema = new schema({
    email:{
        type:String,
        require:true,
        unique:true,
    },
    username:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    notes_id:[{type:mongoose.Types.ObjectId, ref:notes}],
});

const users = mongoose.model("Users", userSchema);
module.exports = users;

