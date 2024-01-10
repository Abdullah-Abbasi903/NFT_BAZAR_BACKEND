const mongoose=require("mongoose"); // pora mongo uthaya
const Schema=mongoose.Schema; // ab sirf mongo mn se scheme uthaya
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NFT = require("./nft_model"); // idr ref mn nft chiys tha is lya idr import




const user=new Schema({
    
   email: {
    type: String,
    match : emailRegex,
    required : true
   },
   password: {
    type: String,
    minlength: 6,
   
    required: true
},

fullname : {
    type : String,
    minlength : 4,
    maxlength : 20,
    
   },

   phone_No: {
   type: String,
   maxlength: 11,
   required: true
   },

   role : {
     type: String,
     enum : ["buyer","seller"],
     default: "buyer"
   },

  nft: [
    {type: mongoose.Schema.Types.ObjectId,
     ref: NFT
    }
  ],

  T_Id_S : {
   type: String
  },
    
  T_N_L : {
   type: String,
   default: 0
  },

  T_N_S : {
   type: String
  },

  T_N_P : {
   type: String
  },

  Subscription_status : {
   type: String,
   enum: ["pending", "confirm"],
   default: "pending"
  }
});
module.exports=mongoose.model("User",user); // ye jo chota user ha ya query mn route k lya chle ga