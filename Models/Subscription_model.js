const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Subscription = new Schema({
   seller_Email : {
     type: String
   },

   Sub_Date : {
    type: Date,
    default: () =>Date.now()
   },
   sub_Status: {
    type: String,
   enum: ["Pending","Confirm"],
   default: "Pending"
  },

  refrence_No : {
    type: String,
   
  }
});

module.exports=mongoose.model("Subscription",Subscription);