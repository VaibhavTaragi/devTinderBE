const express = require('express');

const app = express();

app.use("/hello",(req,res)=>{
    res.send('hello from the server')
})
app.use("/",(req,res)=>{
    res.send('base of server')
})

app.listen(4000,()=>{
    console.log('server started')
})