const mongoose = require('mongoose')

// mongoose.connect('mongodb+srv://mddipu:Dipu@?12@a24.ypywfvd.mongodb.net/')
mongoose.connect("mongodb://127.0.1:27017/a24")

const userSchema = mongoose.Schema({
    name:String,
    email: String,
    password: String
})

module.exports = mongoose.model('user',userSchema);