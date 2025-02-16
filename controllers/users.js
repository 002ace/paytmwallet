const  User =  require("../models/userSchema")
const {z}  =  require("zod");
const bcrypt =  require("bcrypt")
const JWT =  require("jsonwebtoken")
require("dotenv").config();

exports.signup = async(req , res)=>{

    try{   
            const requiredBody  = z.object({
                username: z.string().min(3).max(10).email(),
                firstname:z.string().min(3).max(10),
                lastname:z.string().min(3).max(10),
                password:z.string().min(3).max(10)

            }).strict()

            const  parsedDataWithSuccess =   requiredBody.safeParse(req.body)

            if(!parsedDataWithSuccess.success)
            {
                      return res.status(400).json({
                        message: "Incorrect format",
                        error: parsedDataWithSuccess.error,
                      })
            }

            const  {username , firstname , lastname , password} =  parsedDataWithSuccess.data ;

            const  hashPassword =   await bcrypt.hash(password , 10 );

            const userDetails =  await User.create({username , firstname , lastname , password : hashPassword});
            
            const  payload = {
                  username ,
                  id:userDetails._id,
                  firstname ,
                  lastname
            }

            const  option = {
                 expires : new Date(Date.now() +3*24*60*60*1000 ),
                 httpOnly:true,
            }

            let  token =  JWT.sign(payload , process.env.JWT_SECRET , {expiresIn : "2h"} ) ;


            res.cookie('token',token ,option).status(200).send({
                success:true,
                message:"signup successfully",
                userDetails,
                token,
            })


        
             


    }
    catch(error){
        return res.status(500).json({
            message: "failed to signup",
            error: error.message,
          })
    }

}




//login 
exports.login  = async(req,res)=>{
     try{ 

             const {username ,  password}  =  req.body ;

             if(!username  ||  !password)
             {
                   return  res.status(400).json({
                       success:false,
                       message:"all fields are required"
                   })
             }

             const userExist  =  await  User.findOne({username})

             if(!userExist)
             {
                   return res.status(400).json({
                        success:false,
                        message:"user does not exist"

                   })
             }
            
             const payload = {
                 username ,
                 id:userExist._id,
                 firstname :  userExist.firstname,
                 lastname :  userExist.lastname
             }

             if(await bcrypt.compare(password , userExist.password))
             {
                    let token =  JWT.sign(payload , process.env.JWT_SECRET , {expiresIn:"2h"});

                    const  option = {
                        expires : new Date(Date.now()+3*24*60*60*1000),
                        httpOnly:true ,
                    }

                    res.cookie('token' , token , option).status(200).json({
                         message:"login success fully",
                         success:false,
                         token,
                    })
             }
             else
             {
                return res.status(500).json({
                    message:"password did not match",
                    success:false
               })
             }

             

     }
     catch(error)
     {  
           return res.status(500).json({
                message:"failed to login",
                success:false
           })

     }
}

//logout 
exports.logout   = async(req,res)=>{
    try{  
          

          const option = {
                expires : new Date( Date.now() ),
         
          }
          res.cookie('token' , null , option).status(200).json({
                success:true,
                message:"user logedout in successfully"
            })

            
    }
    catch(error)
    {  
        return res.status(400).json({
            message: "failed to  log out",
            error: error.message,
          })

    }
}


//--->update  

exports.update  = async(req , res)=>{
    try
    {   
            const  id  =  req.user.id ;
            const{firstname , lastname  , password} =  req.body ;
            const user = await User.findById(id);

            const details  =   await  User.findByIdAndUpdate(id , 
                               {
                                  firstname: firstname === null ? user.firstname : firstname,
                                  lastname: lastname === null ? user.lastname : lastname,
                                   password: password === null ? user.password : await bcrypt.hash(password, 10),
                               },
                               {new : true}
                              );

            return  res.status(200).json({
                  message : "Updated details  successfully",
                  details,
            })




    }
    catch(error)
    {
         return  res.status(400).json({
              success:false,
              message:"failed to update  details"
         })
    }
}
