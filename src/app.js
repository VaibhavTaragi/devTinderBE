const express = require('express');
const {adminAuth, userAuth}= require('./middlewares/auth')

const app = express();

app.use('/admin',adminAuth)

app.get('/admin/getAllData',(req,res)=>{
    res.send('All data sent')
})

app.post('/user/login',(req,res)=>{
    res.send('User logged in')
})

app.get('/user/getProfile',userAuth,(req,res)=>{
    res.send('User Profile sent')
})

app.listen(4000,()=>{
    console.log('server started')
})