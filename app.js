require("dotenv").config();
const express = require("express");
const socket = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const axios = require("axios");
const cors = require('cors');
const port = process.env.PORT;
// const userModel = require("./utils/user");
// const postModel = require("./utils/post");
// const chatModel = require("./utils/chat");
// const setWebhook = require("./utils/setWebHook");
const upload = require("./utils/multer");
// const handleMessage = require('./utils/handleMessage');
const path = require("path");
// const TelegramBot = require('node-telegram-bot-api')

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors());
const BOT_TOKEN = process.env.TOKEN;



app.get("/",isHome, (req, res) => {
  res.render("home",{user: req.user});
});
app.post(`/bot${BOT_TOKEN}`, async (req, res) => {
  const { message } = req.body;
  console.log(message);

  if(message){
    await handleMessage(message)
  }
  

 
  res.sendStatus(200);
});

app.get('/airdrops',isLoggedIn, async(req,res)=>{
  let user = await userModel.findOne({ email: req.user.email });
  res.render('airdrops',{user})
})

app.get("/image/:email",async (req, res) => {
  const email = req.params.email
  let user = await userModel.findOne({email:email}).exec()
    if (!user || !user.profilepic.data) {
      return res.status(404).send('Image not found');
    }

    res.contentType(user.profilepic.contentType);
    res.send(user.profilepic.data);
  });
app.get("/editprofile",isLoggedIn, (req, res) => {
  res.render("editprofile" ,{user: req.user});
});
app.post(
  "/upload",
  upload.single("profilePic"),
  isLoggedIn,
  async (req, res) => {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    console.log(fileBuffer);
    let user = await userModel.findOne({ email: req.user.email });

    user.profilepic = {
      data: fileBuffer,
      contentType: req.file.mimetype,
    };

    await user.save();
    fs.unlinkSync(filePath);

    res.send("Profile image uploaded successfully");
    // res.json(req.file)
  }
);
// app.post("/upload", isLoggedIn,upload.single('profilePic'), async (req, res) => {
//   let user = await userModel.findOne({ email: req.user.email });
//   user.profilepic = req.file.filename;
//   user.save()
//   res.redirect('/profile')

// });
app.get("/profile", isLoggedIn, async (req, res) => {
  if (req.user) {
    let user = await userModel.findOne({ email: req.user.email });
    user.populate("posts");
    // console.log(user);
    res.render("profile", { user });
  } else { 
    res.redirect("/login");
  }
});
app.get("/a24-app",   (req, res) => {
  let user = 'download'
  res.render('download',{user})

});

app.post('test',(req,res)=>{
  axios.post('https://x.com').then((data)=>{
    console.log(data);
    res.json(data)
  })
})

app.get("/app/user", appIsLoggedInd, async (req, res) => {
  if (req.user) {
    // console.log(req.user);
    let user = await userModel.findOne({ email: req.user.email });
    user.populate("posts");
    
    res.json(user)
    
  } else { 
    res.status(404).json('not user')
  }
});

app.get("/post", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });

  let post = await postModel.find().populate("user");

  // post.populate('user')
  console.log(req.user);

  res.render("post", { post, user });
});

app.get("/create", alreadyLoggedIn, (req, res) => {
  res.render("create");
});
app.get("/read/users", async (req, res) => {
  let alluser = await userModel.find();

  res.json(alluser);
});
app.get("/chat", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  console.log(req.body);
  io.on("connection", (socket) => {
    console.log("socket connected");
    socket.emit("user", { user });

    socket.on("message", async (data) => {
      let chat = await chatModel.create({
        user: user._id,
        message: data,
      });
      user.chats.push(chat._id);
      await user.save();
      io.emit("msg", { data, user });
    });
  });
  await chatModel
    .find()
    .populate("user")
    .then((messages) => {
      // console.log(messages);
      res.render("chat", { messages, user });
    });
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
      console.log(user);
      res.cookie("token", token);
      res.redirect("/profile");
    });
  });
});
app.post("/app/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.send('Account is Already');

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
      res.json({token})
    });
  });
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.redirect("/login");

  try {
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
  } catch (error) {
    console.log("login error:" + error);
    
  }
  
});
app.post("/app/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    let user = await userModel.findOne({ email: email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error comparing passwords' });


    

      if (result) {
        let token = jwt.sign(
          { email: email, userid: user._id },
          process.env.SECRETKEY
        );
        // res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post("/posts", isLoggedIn, async (req, res) => {
  const { data } = req.body;
  let user = await userModel.findOne({ email: req.user.email });
  user.populate("posts");

  let post = await postModel.create({
    user: user._id,
    content: data,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/post");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.redirect("/login");
});

function appIsLoggedInd(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    
    next();
  });
}

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

function isHome(req, res, next) {
  const authHeader = req.cookies.token;
  // const token = authHeader && authHeader.split(" ")[1];

  if (!authHeader) {
    return res.status(401)  ,next();
  }

  jwt.verify(authHeader, process.env.SECRETKEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired JWT" });
    }
    req.user = user; // Attach user info to request object
    next();
  });
}

function alreadyLoggedIn(req, res, next) {
  if (req.cookies.token) {
    res.redirect("/profile");
  }
  next();
}

server.listen(process.env.PORT, (err) => {
  console.log("working server ");
});
