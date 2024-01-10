const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema ({
  order_Date: {
    type: Date,
    default: ()=> Date.now()
  },
   order_Status : {
     type: String,
     enum : ["Pending", "Confirmed"],
     default: "Pending"
  },
  buyer_Email : {
    type: String
  },
  nft_Id: {
    type: String,
    required: true
  },
  payment_Info: {
     type: String,
     enum: ["Easypaisa", "Sadapay", "Bank"],
     default: "Bank" 
  },
  Transection_id : {
    type: String
  }

});
module.exports=mongoose.model("Order",Order);