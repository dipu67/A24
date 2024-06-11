const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB Atlas
const mongoUri = process.env.DATABASE;
console.log(mongoUri);
mongoose.connect(mongoUri)
.then(() => console.log('MongoDB connection established'))
.catch(err => console.error('MongoDB connection error:', err));

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  profilepic:{
    data:Buffer,
    contentType:String
  },
  chats:[
    {type:mongoose.Schema.Types.ObjectId,ref:"chat"}
  ],
  posts:[
    {type:mongoose.Schema.Types.ObjectId,ref:"post"}
  ]
});

module.exports = mongoose.model("user", userSchema);
