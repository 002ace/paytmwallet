const express =  require("express");

const  router  =  express.Router() ;
const  {auth}   =  require("../controllers/middleware/auth.js") ; 
const   {transfer}  =  require("../controllers/transferFund.js") ; 


router.post("/transfer" , auth , transfer) ; 


 

module.exports =  router;