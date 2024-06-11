const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("connected botUser");
});

const userSchema = mongoose.Schema({
 userId:{
    type:Number,
    required:true,
    unique:true
 },
 firstName:String,
 lastName:String,
 userName:String
});

module.exports = mongoose.model("botUser", userSchema);
