import express from "express";
import { GetAllUser, updateUser, usersignup, verifyotp } from "./controllers/user";
import { updateVendor, vendorsignup } from "./controllers/vendor";
import { createBus, getAllBuses } from "./controllers/bus";
// import { bookSeat } from "./controllers/seat";
import errorMiddleware, { asyncHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.get("/", function(req,res){
    res.json({
        message:"hello world"
    })
})

// user API
app.post("/user/send-otp", asyncHandler(usersignup));
app.post("/user/verify-otp", asyncHandler(verifyotp))
app.get("/user/all", asyncHandler(GetAllUser))
app.put("/user/update", updateUser)

  


// vendor API
app.post("/vendor/signup", asyncHandler(vendorsignup))
app.post("/vendor/verify-otp", asyncHandler(verifyotp))
app.get("/vendor/all", asyncHandler(GetAllUser))
app.put("/vendor/update",updateVendor)


// bus API
app.post("/bus/create",createBus)
app.post("/bus/all",getAllBuses)
//seat Api
// app.post("/bus/book",bookSeat)



// ErrorMiddleware
app.use(errorMiddleware)



app.listen(4000,function(){
    console.log("server started")
})