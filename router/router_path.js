const express=require("express")
const router=express.Router();
const path=require("path");

//creating a route for controller
const controller_route=require('../controller/controller_path');

// creating a path for purchase controller
const purchase_route=require('../controller/purchase');

//creating a path for forget password
const forget_passwordroute=require('../controller/forgetpassword');

router.get("/signup_page",controller_route.signup_page);

//method to add the user as req.user
router.post("/login_credentials",controller_route.add_requser);

//get the login page details
router.post("/login",controller_route.login_details);

// to open the  expense page
router.get("/openexpense",controller_route.openexpensepage);

//to add expense to the backend
router.post("/addexpense",controller_route.add_expense);

//to get old expense from db
router.get("/getexpense",controller_route.get_expense);

router.post('/purchase/premium',purchase_route.createpremium);

//to verify payment
router.post('/verify',purchase_route.verify_payment);

router.get('/openpremiumexpense',controller_route.openpremiumpage);
// //to check whethet its already premium
// router.get('/checkstatus',purchase_route.checkpremiumstaus);
// //to get the leaderboard
router.get('/getleaderboard',controller_route.getleaderboard);
//to delete the expense
router.post('/deleteexpense',controller_route.delete_expense);
//to send the forgetpassword mail
router.post('/send_forgotpassword_mail',forget_passwordroute.sendforgetmail);
// to reset the password
router.use('/resetpassword/:resetid',forget_passwordroute.resetpassword);
//to change the forgotten password with new password
router.post('/resetnewpassword',forget_passwordroute.changenewpassword);
//to get the reports
router.get('/getreports',controller_route.get_reports);
// to get the downlad expense
router.get('/downloadexpense',controller_route.downloadexpense);
module.exports=router;