const express = require ("express");
const app = express();
const router =  express.Router();


const USER = require("../Models/user_Model"); 
const Subs_model = require("../Models/Subscription_model");    //jo model bnya h vo ithr get kya
const nft_model = require("../Models/nft_model");  




router.get ("/get_nft", async(req,res,next)=>{
  try {
    // Find all users with a Subscription_status of 'confirm'
    const confirmedSellers = await USER.find({ Subscription_status: 'confirm' });

    if (!confirmedSellers || confirmedSellers.length === 0) {
      return res.status(404).json({ message: 'No confirmed sellers found' });
    }

    // Extract the NFTs for each confirmed seller 
    const nfts = [];
    for (const seller of confirmedSellers) {
      const sellerNFTs = await nft_model.find({ creator_email: seller.email });
      nfts.push(...sellerNFTs);
    }

    return res.status(200).json({ nfts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
   


   
});

// controller function for pending nfts

router.get("/pending_Nft", async (req,res,next)=>{

  const confirm_Users= await USER.find({Subscription_status:"confirm"});
  if(!confirm_Users){
    return res.status(401).json({mesg: "NO USERS WITH CONFIRM STATUS FOUND"});
  }
  const pen_Nft =[];
  for (i of confirm_Users){
    const pending_ha_nft = await nft_model.find({creator_email:i.email,nft_Status:"pending"});
    pen_Nft.push(pending_ha_nft)
  }
 
  return res.status(200).json({pen_Nft});
});

// Admin_router


// nftRouter.js


// router.get("/get_nft", async (req, res, next) => {
//   try {
//     const confirmedUsers = await Subs_model.find({ sub_Status: "confirm" });

//     if (!confirmedUsers || confirmedUsers.length === 0) {
//       return res.status(401).json({ mesg: "No confirmed users found" });
//     }

//     return res.status(200).json({ confirmedUsers });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });



///



module.exports = router;