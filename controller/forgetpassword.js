const axios = require('axios');
const resetdb=require('../models/resetpassword');
const user_db=require('../models/user');
const path = require("path");
const bcrypt = require("bcrypt");

exports.sendforgetmail = async (req, res) => {
  console.log('hi');
  const { mail } = req.body;
  console.log(mail);
  
  try {
    //here require('uuid') imports uuid 
    //v4 gets version of uuid
    //uuidv4 renames it to use in our code
    const{v4:uuidv4}=require('uuid');
    const uniqueid=uuidv4();
    console.log(uniqueid);
    
    const user=await user_db.findOne({where:{mail:mail}});
    console.log(user);
    await user.createPassword({
        id:uniqueid,
        status:"active",
    })
    const mailres = await axios.post(
      'https://api.sendinblue.com/v3/smtp/email',
      {
        sender: { email: "yogeshsri1209@gmail.com", name: "Yogesh" },
        to: [{ email: mail }],
        subject: "Requesting new password",
        htmlContent: `  <!-- Corrected from 'htmlcontent' to 'htmlContent' -->
          <body>
            <h1>Change password</h1>
            <p>You have forgotten your login password. Please reset it.</p>
            <a href='http://localhost:3000/user/resetpassword/${uniqueid}'>reset password</a>
          </body>
        `,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.SENDINBLUE_API_KEY,
        },
      }
    );

    console.log("Mail sent", mailres.data);
    res.status(200).json({ message: "Email sent successfully!" });
    
  } catch (err) {
    console.log('Error sending password reset email', err);
    res.status(500).json({ message: "Failed to send email" });
  }
};

//reset the password
exports.resetpassword=async(req,res)=>{
    const reset_id=req.params.resetid;
    console.log("reset id",reset_id);
    //to add resetid in cookie
    req.session.resetid=reset_id;
    console.log("req.session.resetid", req.session.resetid);
    try{
       const response=await resetdb.findByPk(reset_id);
       if(response){
        if(response.status=="active"){
            console.log("its active");
            res.sendFile(path.join(__dirname,'../view/resetpasswordpage.html'));
        }
       }
    }catch(err){
        console.log('while reset password',err);
    }

}
//change the old password with new password
exports.changenewpassword=async(req,res)=>{
    const{mail,password,confirmpassword}=req.body;
    console.log("req.session.resetid in changepassword", req.session.resetid)
    try{
        if(password==confirmpassword){
            let encrypted_password = await bcrypt.hash(password, 10);
            let user=await user_db.findOne({where:{mail:mail}});
            if(user){
                user.password=encrypted_password;
                user.save();
                let keyid=await resetdb.findOne({where:{id:req.session.resetid}})
                keyid.status="expired";
                keyid.save();
                res.json({message:"password updated successfully"})
            }
            else{
                throw new Error("Reset ID not found");
            }
        }
        else{
            res.json({message:"password and confirmpassword not match"})
        }
    }catch(err){
        console.log('while changing from backend',err);
        res.json({message:"server error"})
    }
}