const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("connected Chat");
});  

const chatSchema = mongoose.Schema({
  user:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  }],
  message: String,
  date: {type:Date,default:Date.now},
 
});

module.exports = mongoose.model("chat", chatSchema);
