const mongoose = require("mongoose");

// Connect to MongoDB Atlas
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("connected");
});

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  posts:[
    {type: mongoose.Schema.Types.ObjectId,ref:"post"}
  ]
});

module.exports = mongoose.model("user", userSchema);
