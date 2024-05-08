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
});

module.exports = mongoose.model("user", userSchema);
