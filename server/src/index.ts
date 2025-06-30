import express from "express";
import { GetAllUser, updateUser, usersignup, verifyotp } from "./controllers/user";
import { updateVendor, vendorsignup } from "./controllers/vendor";
import { createBus, getAllBuses } from "./controllers/bus";
import { bookSeat } from "./controllers/seat";

const app = express();

app.use(express.json());

app.get("/", function(req,res){
    res.json({
        message:"hello world"
    })
})

// user API
app.post("/user/signup", usersignup);
app.post("/user/verify-otp",verifyotp)
app.get("/user/all", GetAllUser)
app.put("/user/update",updateUser)

  


// vendor API
app.post("/vendor/signup", vendorsignup)
app.post("/vendor/verify-otp",verifyotp)
app.get("/vendor/all", GetAllUser)
app.put("/vendor/update",updateVendor)


// bus API
app.post("/bus/create",createBus)
app.post("/bus/all",getAllBuses)
//seat Api
app.post("/bus/book",bookSeat)



app.listen(4000,function(){
    console.log("server started")
})