const  Account  =  require("../models/accountSchema");
const  mongoose =  require("mongoose");
const { findByIdAndUpdate } = require("../models/userSchema");


exports.transfer  =  async(req,res) =>{
       const session =  await  mongoose.startSession();
       session.startTransaction();
       try
       {      const  fromAccountId =   req.user.id ;
             
              
              const {toAccountId, amount}  =  req.body ;

              if(!toAccountId ||  !amount)
              {
                    return res.status(500).json({
                           success:false ,
                           message:"All field are required"
                    })
              }

              const  account   =  await Account.findOne({userId:fromAccountId});
             

              if(account.balance  < amount  )
              {
                    return res.status(500).json({
                         success:false  ,
                         message:"insuffiient balance"
                    })
              }


              await Account.findOneAndUpdate({ userId: fromAccountId }, { $inc: { balance:-amount } } , {session});

              await  Account.findOneAndUpdate({ userId: toAccountId }, { $inc: { balance:+amount }   }  , {session} ) ; 


              await session.commitTransaction();
              session.endSession();

              return res.status(200).json({
                     success:true,
                     message:"success fully transfer funds"
              })

              



       }
       catch(error)
       {   
               await session.abortTransaction();
               session.endSession();
               console.error("Transaction Failed:", error);

       }
}