const express  =  require("express");

const router  =  express.Router();


const{signup , login , logout , update  ,  details} =  require("../controllers/users.js");
const{auth} =  require("../controllers/middleware/auth.js")

router.post("/signup" , signup);

router.post("/login" , login);

router.post("/logout" , logout) ; 

router.put("/update" , auth  , update) ;

router.get("/details" ,  auth , details ) ;



module.exports =  router ;

