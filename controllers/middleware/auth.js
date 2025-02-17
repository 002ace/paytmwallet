const  JWT  =  require("jsonwebtoken");
require("dotenv").config();
exports.auth =  async(req ,res , next) =>{
     try
     {  
           const token =  req.cookies.token || req.body ;
     

           if(!token)
           {
                return res.status(500).json({
                       success:false ,
                       message:"token  not find "

                })
           }
           
           try{
                    const decode  =  JWT.verify(token , process.env.JWT_SECRET)

                    req.user  =  decode;

             }
            catch(error)
            {     
                     return res.status(400).json({
                      success:false ,
                      message:"token is invalid "
                 })

            }

            next();

           

     }
     catch(error)
     {
       return res.status(500)
        .json({
            success:false,
            data:"failed to authentication",
            message:err.message,
        })  
     }
}