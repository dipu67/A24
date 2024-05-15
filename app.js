
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT;
const userModel = require("./utils/user");
const postModel = require("./utils/post");
// const bot = require('./utils/bot')

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/profile", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({email: req.user.email}) 
  res.render('profile')
  
  
  
});
app.get("/create", (req, res) => {
  res.render("create");
});
app.get("/read/users", async (req, res) => {
  let alluser = await userModel.find();

  res.json(alluser);
});
app.get("/read/post", async (req, res) => {
  let allpost = await postModel.find();

  res.json(allpost);
});
app.get("/login", (req, res) => {
  res.render("login");  
});
app.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.redirect("/signup");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      // Store hash in your password DB.
      let user = await userModel.create({
        name,
        username,
        email,
        password: hash,
      });
      let token = jwt.sign({ email: email, userid: user._id }, "a24dev");
      res.cookie("token", token);
      res.redirect("/profile");
    });
  });
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.redirect("/login");

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email: email, userid: user._id }, "a24dev");
      res.cookie("token", token);
      res.redirect("/profile"); 
    } else res.redirect("/login");
  });
});  
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});  

function isLoggedIn(req, res, next) {
  if (req.cookies.token === ""){
    res.redirect("/login");
  }else {
    let data = jwt.verify(req.cookies.token, "a24dev");
    req.user = data;  
  }
  next()
}
 
app.listen(process.env.PORT, (err) => {
  console.log("working server ");
});
