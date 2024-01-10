    const express = require("express");
    const mongoose = require("mongoose");
    const userRoute = require("./Routes/User_route");
    const adminRoute = require("./Routes/admin_route");
    const nftRoute = require ("./Routes/Nft_router")


    const port = 8080;
    const app = express();

    app.use(express.json()); // Use built-in Express JSON parsing middleware

    app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
    });

    mongoose.connect("mongodb://127.0.0.1:27017/NFT_BAZAR", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Remove the following two options as they are not supported in MongoDB 4.0.0+
        // useFindAndModify: false,
        // useCreateIndex: true,
      }).then(() => {
        app.listen(port, () => {
          console.log("App is running");
        });
      }).catch((err) => {
        console.log(err);
      });
      
      

    app.use("/user", userRoute); // /user  -> ye bta ra ha k user model k andar kya kya ha
    
    app.use("/Admin", adminRoute);

    app.use("/NFT", nftRoute)

    app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const mesg = err.mesg || "Internal server Error";
    res.status(statusCode).json({ mesg: mesg, type: err.type });
    });
