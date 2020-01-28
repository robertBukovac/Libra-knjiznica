var mongoose = require("mongoose");
require("mongoose-type-url");

var bookSchema = new mongoose.Schema({
   name: String,
   writer: String,
   image: String,
   description: String,
   url: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Book", bookSchema);