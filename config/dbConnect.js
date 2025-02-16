
const  mongoose  = require("mongoose");
const dotenv  =  require("dotenv")

dotenv.config();
console.log(process.env.MONGODB_URL)

const dbConnect = () =>{
     mongoose.connect(process.env.MONGODB_URL)
     .then(()=>{console.log("db connected successfull")})
     .catch(()=>{console.log("failed to connect db")})
}

module.exports  =  dbConnect;

