const mongoose = require("mongoose");
const { schema } = require("./user_Model");
const Schema = mongoose.Schema;
const c_emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NFT = new Schema ({
    name: {
        type: String
    },

    description: {
        type: String
    },

    price: {
        type: String
    },

    creator_email: {
        type: String,
        match: c_emailRegx
    },

    nft_Status: {
        type: String,
        enum: ["pending", "confirm"],
        default: "pending"
    },
    nftImage: {
        type: String
    }
});
module.exports=mongoose.model("NFT",NFT);