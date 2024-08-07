const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("connected Post");
}).catch((err)=>{
  console.log("connecting error :"+ err);
}) 

const postSchema = mongoose.Schema({
  user:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  }],
  date: {type:Date,default:Date.now},
  content: {
    type:String,
  },
  likes:[
    {type:mongoose.Schema.Types.ObjectId,ref:"user"}
  ],
  comments:[
    {type:mongoose.Schema.Types.ObjectId,ref:"user"}
  ],
});

module.exports = mongoose.model("post", postSchema);
