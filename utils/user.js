const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("connected User");
});

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  profilepic:{
    type:String,
    default:'profile.png'
  },
  posts:[
    {type:mongoose.Schema.Types.ObjectId,ref:"post"}
  ]
});

module.exports = mongoose.model("user", userSchema);
