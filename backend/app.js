const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const AuthRouter = require("./modules2/auth/AuthRoute");
const ProductRouter = require("./modules2/product/ProductRoute");
const ProfileRouter = require("./modules2/profile/ProfileRoute");
const ReviewRouter = require("./modules2/review/ReviewRouter");
const SellerRouter = require("./modules2/seller/SellerRoute");
const WishlistRouter = require("./modules2/wishlist/WishlistRoute");

const appConfig = (app) => {

    app.get("/test",(req,res) => {
        // throw new Error("An error occured")
        res.status(200).json({msg:"test"})
    });


    app.use("/api/v1/auth",AuthRouter)
    app.use("/api/v1/profile",ProfileRouter)
    app.use("/api/v1/seller",SellerRouter)
    app.use("/api/v1/products",ProductRouter)
    app.use("/api/v1/reviews",ReviewRouter)
    app.use("/api/v1/wishlist",WishlistRouter)


    app.use(notFound);
    app.use(errorHandler);

};


module.exports = appConfig;