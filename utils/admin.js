const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("connected Admins");
});

const adminSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  
});

module.exports = mongoose.model("admin", adminSchema);
