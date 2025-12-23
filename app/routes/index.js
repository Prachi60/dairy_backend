import userRoute from "../../app/routes/user.js";
import storeRoute from "../../app/routes/store.js"
import productRoute from "../../app/routes/product.js"
import categoryRoute from "../../app/routes/category.js";
import cartRoute from "../../app/routes/cart.js"
import orderRoute from "../../app/routes/order.js"
import deliveryRoute from "../../app/routes/deliveryPartner.js"
import paymentController from "../../app/routes/paymentController.js"
import wishlistRoute from "../../app/routes/wishlist.js"
import subscriptionRoute from "../../app/routes/subscription.js"

const setupRoutes=(app)=>{
    app.use("/user",userRoute);
    app.use("/user",storeRoute);
    app.use("/user",productRoute);
    app.use("/user",categoryRoute);
    app.use("/user",cartRoute);
    app.use("/user",orderRoute);
    app.use("/user",deliveryRoute);
    app.use("/payment",paymentController);
    app.use("/product",wishlistRoute);
    app.use("/user",subscriptionRoute);
    
    
}
 export default setupRoutes;

