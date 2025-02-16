const cookieParser = require("cookie-parser");
const dbConnect  =  require("./config/dbConnect")
const express =  require("express");
const app =  express();

app.use(express.json());
app.use(cookieParser());


dbConnect()
app.listen(3000 , ()=>{
     console.log("servere running  successfully");
})