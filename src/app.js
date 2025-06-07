const express = require('express');

const app = express();

app.get('/test',(req,res)=>{
    res.send({userName:'Vaibhav',age:25})
})
app.post('/test',(req,res)=>{
    res.send('user added')
})
app.put('/test',(req,res)=>{
    res.send('user updated')
})
app.delete('/test',(req,res)=>{
    res.send('user deleted')
})

app.listen(4000,()=>{
    console.log('server started')
})