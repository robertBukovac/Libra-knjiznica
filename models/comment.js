var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    }
});

module.exports = mongoose.model("Comment", commentSchema);

//kada korisnik zeli komentirati da kad klikne dodaj novi komentar 
//da ne mora pisati svoj username ako je vec prijavljen, 
