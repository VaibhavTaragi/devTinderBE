const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All data sent");
});

app.post("/user/login", (req, res) => {
  res.send("User logged in");
});

// app.get("/user/getProfile", userAuth, (req, res) => {
//   try {
//     throw new error("errorrrrr");
//     res.send("User Profile sent");
//   } catch (err) {
//     res.status(500).send("error found")
//   }
// });
app.get("/user/getProfile",(req,res)=>{
    throw new error('error')
    res.send('User Profile Sent')
})

app.use('/',(err,req,res,next)=>{
    if(err){
        res.status(500).send('error handled')
    }
})

app.listen(4000, () => {
  console.log("server started");
});
