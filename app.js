const express = require('express')

const app = express()

app.set('view engine','ejs')

app.get('/',(req,res) =>{
    res.render('home')
})
app.get('/profile',(req,res) =>{
    res.render('profile')
})
app.get('/home',(req,res) =>{
    res.render('home')
})

app.listen(3000,()=>{
    console.log('working server');
})