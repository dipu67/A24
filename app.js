require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT;
// const userModel = require('./utils/user')

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
app.get("/create", async (req, res) => {
  const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
  });
  let userModel = mongoose.model("user", userSchema);

  let user = await userModel.create({
    name: "dipu",
    email: "dipu@gmail.com",
    password: "dipu",
  });

  res.send("working");
});

app.listen(process.env.PORT, (err) => {
  console.log("working server ");
});
