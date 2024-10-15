// cretaing a premium account orrder
const user_db=require('../models/user');
const order_db=require('../models/orderpremium');
const Razorpay=require('razorpay');
const crypto = require('crypto');


exports.createpremium=async(req,res)=>{
   let instance=new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
   })
   console.log("Key ID:", process.env.RAZORPAY_KEY_ID);
    console.log("Key Secret:", process.env.RAZORPAY_KEY_SECRET);
   try{
    const user=await user_db.findByPk(req.session.userId);
    console.log('in razorpay',req.session.userId);
    const option={
    amount:100,
    currency:"INR",
    // prefill: {
    //     name: user.name, 
    //     email: user.mail, 
    // },
   }
  
       const newrazorpay_order=await instance.orders.create(option);
       
       await user.createOrder({
        orderid:newrazorpay_order.id,
        paymentid:"status still pending",
        amount:newrazorpay_order.amount,
        currency:newrazorpay_order.currency,
        status:"pending",
       })
       console.log('razorpay order',newrazorpay_order);
       res.json({newrazorpay_order:newrazorpay_order,
        prefill:{
            name: user.name, 
            email: user.mail, 
        },
        keyid: process.env.RAZORPAY_KEY_ID,
       });
   }catch(err){
    console.log('while creating razorpay order',err);
   }
}

exports.verify_payment=async(req,res)=>{
    const{razorpay_order_id,razorpay_payment_id,razorpay_signature }=req.body;
    //crypto is a module to verify here we concate the orderid with paymentid, thats how the signature got generated 
    //after we compare that with the razorpay if it matches payment was sussess
    // const issignaturevalid=crypto.verify('sha256',Buffer.from(razorpay_order_id+'|'+razorpay_payment_id),{
    //     key:process.env.RAZORPAY_KEY_SECRET,
    // },Buffer.from(razorpay_signature,'hex'));
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');
    console.log(generatedSignature,razorpay_signature);
    if(generatedSignature==razorpay_signature){
       
        try{
            const order=await order_db.findOne({where : {orderid:razorpay_order_id}});
            if(order){
                order.status="success";
                order.paymentid=razorpay_payment_id;
                await order.save();
                //cahnge the ispremium inuertable to true
                const user=await user_db.findByPk(req.session.userId);
                user.ispremium=true;
                await user.save();
                return res.json({message:"payment successful", redirect: true, url: 'http://13.60.229.113:3000/user/openpremiumexpense' });
            }
            else{
                res.json({message:"order not found"}); 
            }
        }catch(err){
            console.log('error in updating orderdb',err)
        }
    }
    else{
        res.json({message:"Payment declined"}); 
    }

}

//check whether its already premium
// exports.checkpremiumstaus=async(req,res)=>{
//     try{
//     const last_order=await order_db.findOne({
//         where:{userId:req.session.userId},
//         order : [['createdAt','DESC']],
//         limit:1
//     });
//     console.log('last order',last_order);
//     if(last_order){
//         if(last_order.status=="success"){
//             res.json({status:"success"});
//         }
//         else{
//             res.json({status:"failed"});
//         }
//     }
//     else{
//         res.json({status:"no last order"});
//     }
// }catch(err){
//     console.log('while finding premium status internal error',err)
// }
// }
