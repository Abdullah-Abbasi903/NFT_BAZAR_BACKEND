const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const get_User = require("./user_Model");
const A_emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const Admin = new Schema({
    email: {
        type: String,
        required : true,
        match: A_emailRegex
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
       Unique: true
    },

    user_Stat: [
      {
          type: mongoose.Schema.Types.ObjectId,
            ref: get_User
        
      }
    ],

    session_Token : {
        type: String
    },

    total_Nfts_Listed : {
        type: Number,
        default : 0
    },

    Pending_Approvals : {
          type: Number,
          default : 0
    },

    revenue_Earned: {
        type: Number,
        default: 0
    },

});
module.exports=mongoose.model("Admin",Admin);