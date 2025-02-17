const cookieParser = require("cookie-parser");
const dbConnect  =  require("./config/dbConnect")
const express =  require("express");
const app =  express();

app.use(express.json());
app.use(cookieParser());


const userpath =  require("./routes/userRoute");
const  account  = require("./routes/accountRoute")
app.use("/api" , userpath);
app.use("/account" , account);


dbConnect()
app.listen(4000 , ()=>{
     console.log("servere running  successfully");
})