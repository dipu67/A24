require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT;
const userModel = require('./utils/user')

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
   


app.get("/", (req, res) => {
  res.render("home");
});
app.get("/profile", (req, res) => {
  res.render("profile");
});
app.get('/signup',(req,res)=>{
  res.render('signup')
})
app.post('/register', async (req,res)=>{
  const {name, username,email,password} = req.body;
  let user = await userModel.create({
    name,
    username,
    email,
    password
  })
  res.redirect('/profile')
 
})

app.listen(process.env.PORT, (err) => {
  console.log("working server ");
});
