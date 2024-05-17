require("dotenv").config();
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
app.get("/editprofile", (req, res) => {
  res.render("editprofile");
});
app.get("/profile", isLoggedIn, async (req, res) => {
  if (req.user) {
    let user = await userModel.findOne({ email: req.user.email });
    user.populate('posts')
    res.render("profile", { user });
  } else {
    res.redirect("/login");
  }
});
app.get("/post", isLoggedIn, async(req, res) => {

  let post = await postModel.find().populate('user')

  // post.populate('user')
  // console.log(post);

  res.render("post",{post});
});
 
app.get("/create",alreadyLoggedIn, (req, res) => {
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
  if (user) return res.redirect("/create");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      // Store hash in your password DB.
      let user = await userModel.create({
        name,
        username,
        email,
        password: hash,
      });
      let token = jwt.sign(
        { email: email, userid: user._id },
        process.env.SECRETKEY
      );
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
      let token = jwt.sign(
        { email: email, userid: user._id },
        process.env.SECRETKEY
      );
      res.cookie("token", token);
      res.redirect("/profile");
    } else res.redirect("/login");
  });
});
app.post("/posts", isLoggedIn, async (req, res) => {
  const { data } = req.body;
  let user = await userModel.findOne({ email: req.user.email });
  user.populate('posts')


  let post = await postModel.create({
    user: user._id,
    content: data,
  });
  user.posts.push(post._id)
  await user.save()
  res.redirect("/post");
});
app.get("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.redirect("/login");
});
 
function isLoggedIn(req, res, next) {
  const authHeader = req.cookies.token;
  // const token = authHeader && authHeader.split(" ")[1];

  if (!authHeader) {
    return res.status(401).redirect("/login");
  }

  jwt.verify(authHeader, process.env.SECRETKEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired JWT" });
    }
    req.user = user; // Attach user info to request object
    next();
  });
}

function alreadyLoggedIn(req,res,next){
  if(req.cookies.token){
    res.redirect('/profile')
  }
  next()
}

app.listen(process.env.PORT, (err) => {
  console.log("working server ");
});
