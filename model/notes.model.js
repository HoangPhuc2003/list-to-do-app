const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const notesSchema = new Schema({
   name: String,
   content: String,
   date: Date
});

const Notes = mongoose.model("Notes", notesSchema);

module.exports = Notes;