/// ither controller function wla system ha
const express = require("express");
const app = express();
const argon2 = require('argon2');
const router = express.Router();
const Subs_model = require("../Models/Subscription_model");
const id_Regex = /^[0-9a-fA-F]{24}$/;
app.use(express.json());


let subscription_Id = null;
 
const admin_Model = require ("../Models/admin_model");

const get_User_Substat = require("../Models/user_Model");     //jo model bnya h vo ithr get kya


router.post("/signup", async (req, res, next) => {
  const { email, password, fullname } = req.body;

  try {
      const existing_Admin = await admin_Model.findOne({email});
      if (existing_Admin){
        return res.status(401).json({mesg:"THIS ADMIN ALREADY EXIST"});
     }
     const hashedPassword = await argon2.hash(password);
     const new_Admin = new admin_Model ({
      email,
      password:hashedPassword,
      fullname
     });
     const result = await new_Admin.save();
     return res.status(200).json({mesg:"Admin Created Sucessfully"});
  }
  catch (error) {
    console.log(error)
  }
},);



// router.get("/get_Subs", async(req, res, next) => {

//    const pending_Status_User = await Subs_model.find({sub_Stats:"pending"});
//    if (!pending_Status_User){
//     return res.status(401).json({mesg:"No pending users found"});
//    }

//    return res.status(200).json({pending_Status_User});

// });


//// subscription status from pending to confirm

// Admin_router
// Admin_route
router.patch("/confirm_Subs", async (req, res, next) => {
  try {

    const { Id } = req.body;

    console.log(Id);
    const id_Length = Id.length
    if (!Id.match(id_Regex)) {
      return res.status(401).json({ mesg: "formate of id is not correct" })
    }

    else if (id_Length < 24 || id_Length > 24) {
      return res.status(401).json({ mesg: "Length of id doesn't proper formate" })
    }
    // Find the subscription by ID
    subscription_Id = await Subs_model.findById(Id);
    console.log(subscription_Id);

    // Check if the subscription is not found
    if (!subscription_Id) {
      return res.status(404).json({ mesg: "No record found" });
    }

    const user_Email = subscription_Id.seller_Email;
    console.log(user_Email);

    // Find the user by email
    const check_User = await get_User_Substat.findOne({ email: user_Email });
    console.log(check_User);

    if (!check_User) {
      return res.status(404).json({ mesg: "User not found" });
    }

    // Update user's subscription status to "confirm"
    check_User.Subscription_status = "confirm";
    check_User.role = "seller";
    await check_User.save();



    // Update subscription status to "Confirm"
    subscription_Id.sub_Status = "Confirm";
    await subscription_Id.save();

    return res.status(200).json({ mesg: "Subscription confirmed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/get_Subs", async (req, res, next) => {
  try {
    const pending_Status_Users = await Subs_model.find({ sub_Stats: "Pending" });

    if (!pending_Status_Users || pending_Status_Users.length === 0) {
      return res.status(401).json({ mesg: "No pending users found" });
    }

    return res.status(200).json({ pending_Status_Users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/revenue", async (rea, res, next)=>{

  let count = 0;
  let revenue = 0;
  let subs_fee = 10;
  const confirmed_User = await get_User_Substat.find({Subscription_status: "confirm"});
  if(!confirmed_User){
    return res.status(401).json({mesg: " NO CONFIRMED USERS FOUND"})
  }
  for(i of confirmed_User ) {
    count++;
    subs_fee *= count;
     
  }
  revenue = subs_fee;
  return res.status(200).json({revenue}) ;
});



module.exports = router;// it should be accessible outside the field
