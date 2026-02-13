const express = require('express');
const app = express();
const userRoutes = require("./routes/user.routes")
const cookieParser = require('cookie-parser')



app.use(express.json())
app.use(cookieParser())



app.get('/',(req,res)=>{
    res.send('Welcome to the User Management API')
})

app.use('/api/users',userRoutes)

module.exports = app;