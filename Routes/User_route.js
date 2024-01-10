/// ither controller function wla system ha
const express = require("express");
const app = express();
const argon2 = require('argon2');
const router = express.Router();
const multer = require("multer");

app.use(express.json());

 //Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });



const USER= require("../Models/user_Model");     //jo model bnya h vo ithr get kya
const nft_model = require("../Models/nft_model");
const order_Model = require("../Models/order_model");
const Subs_model = require("../Models/Subscription_model");
router.post("/signup",async (req,res,next) => { // req: jo front end se data ai ga   //res: jo server se front end pr show ho ga              
 
    const {email, password, phone_No} = req.body; // frontent se data get kr re hn
    try {
        const existing_User = await USER.findOne({email});
        const check_Number = phone_No.length;
        if (check_Number<11){
          return res.status(401).json({mesg: "length is < than 11"})
        }
        if (existing_User){
           return res.status(401).json({mesg:"THIS EMAIL ALREADY EXIST"});
        }
        else {
          const hashedPassword = await argon2.hash(password);
          const new_User = new USER({
            email,
            password: hashedPassword,
            phone_No
          });

          const result = await new_User.save()
           return res.status(200).json({mesg:"User Created Sucessfully"})
        }

    }
        catch(error){
             console.log(error)
        }                                      
});

// now making login credentials

router.post("/login",async (req,res,next) =>{
    const {email, password, phone_No} = req.body;
    const check_User = await USER.findOne({email});
    const check_Number = phone_No.length;

    if(!check_User){
       return res.status(401).json({mesg:"USER NOT FOUND"});
    }
    if (check_Number<11){
      return res.status(401).json({mesg: "length is < than 11"})
    }
      //stored hashed password ko check kr re hn
    const valid_Password = await argon2.verify(check_User.password, password);
    if (!valid_Password) {
      return res.status(401).json({ message: "INVALID PASSWORD" });
      }   
      return res.status(200).json({ message: "Login successful" });
});   

router.post("/create_Nft", async (req,res,next)=>{
    const {name, description,price,creator_email} = req.body;
    const check_Creator= await USER.findOne({email: creator_email})
    if(!check_Creator){
      return res.status(401).json({mesg: "CREATOR NOT FIND"});
    }
    const new_Nft = new nft_model ({
      name,
      description,
      price,
      creator_email
    });
    const result = await new_Nft.save();
    check_Creator.nft.push(new_Nft._id); //syntax for getting nft id
    await check_Creator.save();
    return res.status(200).json({mesg:"NFT UPLOADED SUCCESSFULLY"});
});

router.post("/buy_Subscription", async (req,res, next) => {
          const {seller_Email,refrence_No}=req.body;

          const new_Subs = new Subs_model ({
            
            seller_Email,
            refrence_No
          });

          await new_Subs.save();
          return res.status(200).json({mesg:"Subscription Status wating for admins approval"});
});

/// Order creation 
router.post("/order", async (req,res, next) => {
  const {Buyer_Email,Transection_id,payment_Info,nft_Id}=req.body;

  const new_Order = new order_Model ({
    
    buyer_Email:Buyer_Email,
    Transection_id,
    payment_Info,
    nft_Id
  });

  await new_Order.save();
  return res.status(200).json({mesg:"ORDER CREATED SUCCESSFULLY"});
});


router.post("/UploadNFT", upload.single("nftImage"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(404).json({ error: "Please Provide Nft Image" });
    }
    
    const {name, description,price,creator_email} = req.body;

    const user = await USER.findOne({email: creator_email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const nftImage = req.file.buffer.toString("base64");


    


    // creating nft with image:
    
    
    const new_Nft = new nft_model ({
      name,
      description,
      price,
      creator_email,
      nftImage
    });
    await new_Nft.save();
    // check_Creator.nft.push(new_Nft._id); //syntax for getting nft id
    // await check_Creator.save();
    return res.status(200).json({mesg:"NFT UPLOADED SUCCESSFULLY WITH IMAGE"});


  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;// it should be accessible outside the field